import { defineStore } from 'pinia';
import { keycloak } from 'src/boot/api';
import type { KeycloakProfile } from 'keycloak-js';
import type { Entity } from 'src/models';

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<KeycloakProfile>();
  const realmRoles = ref<string[]>([]);
  const isAuthenticated = computed(() => profile.value !== undefined);
  const isAdmin = computed(() => realmRoles.value.includes('app-administrator'));
  const isReviewer = computed(() => realmRoles.value.includes('app-reviewer'));
  const isContributor = computed(() => realmRoles.value.includes('app-contributor'));

  async function init() {
    if (isAuthenticated.value) return Promise.resolve(true);
    profile.value = undefined;
    realmRoles.value = [];
    return keycloak
      .init({
        onLoad: 'check-sso', // Optional: 'login-required' forces login right away, 'check-sso' checks if the user is already logged in.
      })
      .then(async (authenticated: boolean) => {
        if (authenticated) {
          realmRoles.value = keycloak.tokenParsed?.realm_access?.roles || [];
          profile.value = await keycloak.loadUserProfile();
          return authenticated;
        } else {
          return authenticated;
        }
      });
  }

  async function login() {
    if (isAuthenticated.value) return;
    // redirects to keycloak login page
    return await keycloak.login();
  }

  async function logout() {
    if (!isAuthenticated.value) return;
    return await keycloak
      .logout({
        redirectUri: window.location.origin,
      })
      .then(() => {
        profile.value = undefined;
        realmRoles.value = [];
      });
  }

  function getAccessToken() {
    if (!isAuthenticated.value) throw new Error('Not authenticated');
    return keycloak.token;
  }

  async function updateToken() {
    return await keycloak.updateToken(30).catch((err) => {
      console.error('Failed to refresh token', err);
      return logout().finally(() => {
        throw new Error('Failed to refresh token');
      });
    });
  }

  function canEdit(entity: Entity) {
    if (!isAuthenticated.value) return false;
    const userName = profile.value?.username;
    return (
      entity.created_by === userName ||
      entity.updated_by === userName ||
      isAdmin.value ||
      isReviewer.value
    );
  }

  function canPublish(entity: Entity) {
    if (!isAuthenticated.value) return false;
    console.debug('TODO check publish permissions for entity:', entity);
    return isAdmin.value;
  }

  function canDelete(entity: Entity) {
    if (!isAuthenticated.value) return false;
    console.debug('TODO check delete permissions for entity:', entity);
    return isAdmin.value;
  }

  return {
    isAuthenticated,
    isAdmin,
    isReviewer,
    isContributor,
    profile,
    realmRoles,
    keycloak,
    init,
    login,
    logout,
    updateToken,
    getAccessToken,
    canEdit,
    canPublish,
    canDelete,
  };
});
