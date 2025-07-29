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
    if (['locked', 'to-delete', 'to-unpublish'].includes(entity.state || '')) return false;
    if (isAdmin.value || isReviewer.value) return true;
    if (entity.state !== 'draft') return false;
    const userName = profile.value?.username;
    return entity.created_by === userName || entity.updated_by === userName;
  }

  function canPublish(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state !== 'to-publish') return false;
    return isAdmin.value;
  }

  function canUnpublish(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state !== 'to-unpublish') return false;
    return isAdmin.value;
  }

  function canDelete(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state !== 'to-delete') return false;
    return isAdmin.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function canLock(entity: Entity) {
    if (!isAuthenticated.value) return false;
    return isAdmin.value;
  }

  function canInReview(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state !== 'draft') return false;
    const userName = profile.value?.username;
    return (
      entity.created_by === userName ||
      entity.updated_by === userName ||
      isAdmin.value ||
      isReviewer.value
    );
  }

  function canToPublish(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state !== 'in-review') return false;
    return isAdmin.value || isReviewer.value;
  }

  function canToUnpublish(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state === 'to-unpublish') return false;
    if (entity.published_at === undefined) return false;
    const userName = profile.value?.username;
    return (
      entity.created_by === userName ||
      entity.updated_by === userName ||
      isAdmin.value ||
      isReviewer.value
    );
  }

  function canToDelete(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state === 'to-delete') return false;
    const userName = profile.value?.username;
    return (
      entity.created_by === userName ||
      entity.updated_by === userName ||
      isAdmin.value ||
      isReviewer.value
    );
  }

  function canDraft(entity: Entity) {
    if (!isAuthenticated.value) return false;
    if (entity.state === 'draft') return false;
    if (entity.state === 'locked') return isAdmin.value;
    return isAdmin.value || isReviewer.value;
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
    canUnpublish,
    canDelete,
    canLock,
    canInReview,
    canToPublish,
    canToUnpublish,
    canToDelete,
    canDraft,
  };
});
