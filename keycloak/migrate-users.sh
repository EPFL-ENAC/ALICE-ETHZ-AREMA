#!/usr/bin/env bash
# Migrate the AREMA users from the legacy Keycloak (realm AREMA, app-* realm roles) to
# the shared realm (app-* client roles of the backend client), keeping the user ids
# (content authors are "user:<id>") and the password hashes.
# Run it from the git-ignored migration/ folder: the files hold password hashes.
#
# 1. Export the legacy realm with its users having the app-user realm role. The password hashes are not available through
#    the admin API, so kc.sh export runs in the legacy Keycloak container (it reads the
#    database settings from the container environment). KC_EXEC runs a command in it:
#      KC_EXEC="ssh <host> docker exec -i <container>" ../keycloak/migrate-users.sh export AREMA > AREMA.json
#      KC_EXEC="kubectl exec -i -n <namespace> <pod> --" ...
#
# 2. Convert the users having the app-user realm role and a password (app-* realm roles -> client roles), report what needs attention (offline):
#      ../keycloak/migrate-users.sh transform AREMA.json arema-dev-api > users-dev.json
#
# 3. Dry-run (read only): check the target client and roles, and tell for each user
#    whether it is new, already there (same id: skipped by the import) or a collision
#    (another user has the username or email). Prompts for the admin password.
#      KC_USER=<admin> ../keycloak/migrate-users.sh dry-run users-dev.json arema-dev-api
#
# 4. Import users-dev.json with the partial import of the admin console, see README.md.
#
# kcadm.sh runs in the Keycloak docker image, its config (tokens) goes to ./.kcadm.config.
set -euo pipefail

KC_URL=${KC_URL:-https://enac-it-sso2.epfl.ch}
KC_REALM=${KC_REALM:-external}
KC_LOGIN_REALM=${KC_LOGIN_REALM:-$KC_REALM}
# client to log in with: public, direct access grants, full scope (else the admin roles are not in scope)
KC_CLIENT=${KC_CLIENT:-admin-cli}
KC_DEFAULT_ROLE=${KC_DEFAULT_ROLE:-default-roles-$KC_REALM}
KC_IMAGE=${KC_IMAGE:-quay.io/keycloak/keycloak:26.4}
# kc.sh in the legacy Keycloak container (Bitnami chart keycloak-21.0.2, Keycloak 24)
KC_SH=${KC_SH:-/opt/bitnami/keycloak/bin/kc.sh}
# keep the export process out of the server cache cluster (JGroups kubernetes stack):
# no peer discovered and another port than the server's (7800)
KC_EXPORT_JAVA_OPTS=${KC_EXPORT_JAVA_OPTS:--Djgroups.dns.query=export.invalid -Djgroups.bind.port=7801}
APP_ROLES='["app-administrator", "app-reviewer", "app-contributor", "app-user"]'

# KCADM_TTY=-t for the password prompt
kcadm() {
  docker run --rm -i ${KCADM_TTY:-} --network host --user "$(id -u)" -v "$PWD:/work" -w /work \
    --entrypoint /opt/keycloak/bin/kcadm.sh "$KC_IMAGE" "$@" --config /work/.kcadm.config
}

login() {
  : "${KC_USER:?KC_USER (admin username) is required}"
  KCADM_TTY=-t kcadm config credentials --server "$KC_URL" --realm "$KC_LOGIN_REALM" --user "$KC_USER" --client "$KC_CLIENT" >&2
  kcadm get "realms/$KC_REALM" --fields realm >/dev/null || {
    echo "$KC_USER of realm $KC_LOGIN_REALM cannot administer realm $KC_REALM with client $KC_CLIENT (see KC_CLIENT and KC_LOGIN_REALM in README.md)" >&2
    exit 1
  }
}

export_realm() {
  local realm=$1
  : "${KC_EXEC:?KC_EXEC (command running a command in the legacy Keycloak container) is required}"
  # export to a directory, users in pages of local users, one transaction each: a single file
  # export lists all the users of the user federation (LDAP) in one transaction, which times out.
  # The export logs go to stderr, the users files to stdout, merged keeping only the users with the
  # app-user realm role: the other users (and their password hashes) are not written.
  # shellcheck disable=SC2086
  $KC_EXEC sh -c "JAVA_OPTS_APPEND='$KC_EXPORT_JAVA_OPTS' $KC_SH export --realm $realm --dir /tmp/$realm-export --users different_files --users-per-file 100 >&2 && cat /tmp/$realm-export/$realm-users-*.json; status=\$?; rm -rf /tmp/$realm-export; exit \$status" |
    jq -s '{realm: .[0].realm, users: [.[].users[] | select(.serviceAccountClientId == null and (.realmRoles // [] | index("app-user")))]}'
}

transform() {
  local export_file=$1 client=$2
  # report on stderr
  jq -r '
    def has_password: any(.credentials[]?; .type == "password");
    [.users[] | select(.serviceAccountClientId == null)] as $users
    | [$users[] | select(.realmRoles // [] | index("app-user"))] as $app
    | [$app[] | select(has_password)] as $migrated
    | "users: \($users | length), with the app-user role: \($app | length), migrated (with password): \($migrated | length)",
      "not migrated (no app-user role): \([$users[] | select(.realmRoles // [] | index("app-user") | not) | .username] | join(", "))",
      "not migrated (no password, e.g. EPFL LDAP or identity provider): \([$app[] | select(has_password | not) | .username] | join(", "))",
      "identity provider links dropped: \([$migrated[] | select(.federatedIdentities | length > 0) | "\(.username) [\([.federatedIdentities[].identityProvider] | join(","))]"] | join(", "))",
      "user federation (LDAP...) links dropped: \([$migrated[] | select(.federationLink) | .username] | join(", "))",
      "with OTP (check the OTP policy of the target realm matches): \([$migrated[] | select(any(.credentials[]?; .type == "otp")) | .username] | join(", "))"
  ' "$export_file" >&2
  # partial import file: keep id, profile, credentials (hashes), required actions;
  # drop groups, consents and links to the legacy realm; app realm roles -> client roles
  jq --argjson roles "$APP_ROLES" --arg client "$client" --arg default_role "$KC_DEFAULT_ROLE" '
    {users: [.users[]
      | select(.serviceAccountClientId == null and (.realmRoles // [] | index("app-user")) and any(.credentials[]?; .type == "password"))
      | ((.realmRoles // []) - ((.realmRoles // []) - $roles)) as $app_roles
      | {id, username, email, emailVerified, firstName, lastName, enabled, createdTimestamp,
         attributes, requiredActions, notBefore, credentials: [.credentials[]? | del(.id)],
         realmRoles: [$default_role],
         clientRoles: {($client): $app_roles}}
      | with_entries(select(.value != null))]}
  ' "$export_file"
}

# one line per user of the import file: {status: new|existing|collision, id, username}
# existing: same id (e.g. imported for another client); collision: other user with the username or email
classify() {
  local import_file=$1
  # ponytail: loads id, username and email of all the realm users, page it if the realm gets very large
  jq -c --slurpfile existing <(kcadm get users -r "$KC_REALM" --fields id,username,email -l 1000000) '
    def lower: if . == null then null else ascii_downcase end;
    $existing[0] as $ex
    | .users[] | . as $u
    | {id, username, status: (
        if any($ex[]; .id == $u.id) then "existing"
        elif any($ex[]; .username == ($u.username | lower) or (.email != null and (.email | lower) == ($u.email | lower))) then "collision"
        else "new" end)}
  ' "$import_file"
}

dry_run() {
  local import_file=$1 client=$2 cid
  login
  cid=$(kcadm get clients -r "$KC_REALM" -q clientId="$client" --fields id | jq -r '.[0].id // empty')
  if [ -z "$cid" ]; then
    echo "MISSING client $client in $KC_REALM"
  else
    kcadm get "clients/$cid/roles" -r "$KC_REALM" --fields name |
      jq -r --argjson roles "$APP_ROLES" --arg c "$client" '$roles - map(.name) | select(length > 0) | "MISSING client roles of \($c): \(join(", "))"'
  fi
  kcadm get "roles/$KC_DEFAULT_ROLE" -r "$KC_REALM" --fields name >/dev/null 2>&1 || echo "MISSING realm role $KC_DEFAULT_ROLE"
  classify "$import_file" | jq -rs '
    {new: "new (imported)",
     existing: "existing (same id, skipped by the import: add the client roles by hand)",
     collision: "COLLISION (another user has the username or email: remove it from the file, else the import is skipped or fails)"} as $labels
    | group_by(.status)[] | "\($labels[.[0].status]): \(length)", (.[] | "  \(.username) (\(.id))")'
}

case "${1:-}" in
  export) export_realm "$2" ;;
  transform) transform "$2" "$3" ;;
  dry-run) dry_run "$2" "$3" ;;
  *) sed -n '2,23p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
