from enacit4r_auth.services.admin import KeycloakAdminService
from enacit4r_auth.services.auth import KeycloakService, User
from fastapi import HTTPException, status

from api.config import config
from api.db import get_session
from api.services.authz import ACLService

kc_service = KeycloakService(
    config.KEYCLOAK_URL,
    config.KEYCLOAK_REALM,
    config.KEYCLOAK_API_ID,
    config.KEYCLOAK_API_SECRET,
    "app-administrator",
    client_roles=True,
)

kc_admin_service = KeycloakAdminService(
    config.KEYCLOAK_URL,
    config.KEYCLOAK_REALM,
    config.KEYCLOAK_API_ID,
    config.KEYCLOAK_API_SECRET,
    "app-user",
    client_roles=True,
)

acl_service = ACLService(get_session())


def check_admin_or_perm(user: User, resource: str, permission: str):
    # check permission was granted
    permitted = acl_service.check_user_permission(resource, permission, user.email)
    if permitted:
        return True
    # else check is admin
    try:
        kc_service.require_admin(user)
    except Exception:
        return False


def require_admin_or_perm(user: User, resource: str, permission: str):
    permitted = check_admin_or_perm(user, resource, permission)
    if not permitted:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorised to perform this operation"
        )
