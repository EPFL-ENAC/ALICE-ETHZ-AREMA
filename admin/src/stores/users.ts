import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { AppUser } from 'src/models';

const authStore = useAuthStore();

export const useUsersStore = defineStore('users', () => {
  const users = ref<AppUser[]>([]);
  const loading = ref(false);

  async function init() {
    // fetch users from the server
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    loading.value = true;
    return authStore
      .updateToken()
      .then(() => {
        const config = {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        };
        return api
          .get('/user/', config)
          .then((res) => {
            users.value = res.data.data;
          })
          .finally(() => {
            loading.value = false;
          });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function create(payload: AppUser) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      if (payload.enabled === undefined) {
        payload.enabled = true;
      }
      if (payload.roles === undefined) {
        payload.roles = ['app-user'];
      } else if (!payload.roles.includes('app-user')) {
        payload.roles.push('app-user');
      }
      if (payload.username === undefined) {
        payload.username = payload.email;
      }
      payload.email_verified = true;
      return api.post('/user/', payload, config);
    });
  }

  async function update(payload: AppUser) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    if (payload.roles === undefined) {
      payload.roles = ['app-user'];
    } else if (!payload.roles.includes('app-user')) {
      payload.roles.push('app-user');
    }
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.put(`/user/${payload.id}`, payload, config);
    });
  }

  async function update_password(payload: AppUser, password: string) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.put(`/user/${payload.id}/password`, { password }, config);
    });
  }

  async function remove(id: string) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.delete(`/user/${id}`, config);
    });
  }

  return {
    users,
    loading,
    init,
    create,
    update,
    update_password,
    remove,
  };
});
