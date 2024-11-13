import { defineStore } from 'pinia';
import { keycloak } from 'src/boot/api';

export interface Profile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAuthStore = defineStore('auth', () => {

  const profile = ref<Profile>();
  const realmRoles = ref<string[]>([]);
  const isAuthenticated = computed(() => profile.value !== undefined);
  const isAdmin = computed(() => realmRoles.value.includes('admin'));
  const accessToken = computed(() => keycloak.token);

  async function init() {
    if (isAuthenticated.value) return Promise.resolve(true);
    profile.value = undefined;
    realmRoles.value = [];
    return keycloak.init({
      onLoad: 'check-sso' // Optional: 'login-required' forces login right away, 'check-sso' checks if the user is already logged in.
    }).then((authenticated: boolean) => {
      if (authenticated) {
        realmRoles.value = keycloak.tokenParsed.realm_access.roles
        return keycloak.loadUserProfile().then((prof: Profile) => {
          profile.value = prof;
          return authenticated;
        });
      } else {
        return authenticated;
      }
    });
  }

  async function login() {
    if (isAuthenticated.value) return;
    // redirects to keycloak login page
    return keycloak.login();
  }

  async function logout() {
    if (!isAuthenticated.value) return;
    return keycloak.logout({
      redirectUri: window.location.origin,
    }).then(() => {
      profile.value = undefined;
      realmRoles.value = [];
    });
  }

  async function updateToken() {
    return keycloak.updateToken(30)
      .catch(() => {
        console.error('Failed to refresh token');
        return logout().finally(() => Promise.reject('Failed to refresh token'));
      });
  }

  return {
    isAuthenticated,
    isAdmin,
    profile,
    realmRoles,
    accessToken,
    init,
    login,
    logout,
    updateToken,
  };

});