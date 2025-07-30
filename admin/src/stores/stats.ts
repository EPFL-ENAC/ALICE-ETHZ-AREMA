import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type { GroupByResult } from 'src/models';

const authStore = useAuthStore();

export const useStatsStore = defineStore('stats', () => {
  const loading = ref(false);
  const groupBy = ref<string>('state');
  const frequencies = ref<Record<string, GroupByResult>>({});

  async function loadFrequencies(by: string, filter: Record<string, string> | undefined) {
    loading.value = true;
    groupBy.value = by;
    frequencies.value = {};
    return Promise.all(
      [
        'natural-resource',
        'building-material',
        'technical-construction',
        'building',
        'professional',
      ].map(async (type) => {
        const response = await countTypeGroupBy(type, by, filter);
        frequencies.value[type] = response;
      }),
    ).finally(() => {
      loading.value = false;
    });
  }

  async function countTypeGroupBy(
    type: string,
    by: string,
    filter: Record<string, string> | undefined = undefined,
  ): Promise<GroupByResult> {
    try {
      await authStore.updateToken();
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.getAccessToken()}`,
        },
      };
      return await api
        .get(`/stats/frequencies/${type}`, {
          ...config,
          params: {
            by,
            filter: filter ? JSON.stringify(filter) : undefined,
          },
          paramsSerializer: {
            indexes: null, // no brackets at all
          },
        })
        .then((response) => response.data);
    } catch (error) {
      console.error(`Failed to load frequencies for type ${type} by ${by}`, error);
      return Promise.resolve({
        field: by,
        counts: [],
      });
    }
  }

  return {
    loading,
    groupBy,
    frequencies,
    loadFrequencies,
  };
});
