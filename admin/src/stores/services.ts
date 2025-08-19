import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import type {
  NaturalResource,
  TechnicalConstruction,
  BuildingMaterial,
  Building,
  Professional,
  BuildingElement,
} from 'src/models';
import type { Query } from 'src/components/models';

const authStore = useAuthStore();

export class Service<
  Type extends
    | NaturalResource
    | TechnicalConstruction
    | BuildingMaterial
    | Building
    | Professional
    | BuildingElement,
> {
  constructor(
    public entityType: Type,
    public entityName: string,
  ) {}

  async create(payload: Type) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.post(`/${this.entityName}/`, payload, config);
  }

  async get(id: string): Promise<Type> {
    const res = await api.get(`/${this.entityName}/${id}`);
    return res.data;
  }

  async find(query: Query | undefined) {
    const skip = query?.$skip || 0;
    const limit = query?.$limit || 10;
    const range = [skip, skip + limit - 1];
    const sort = query?.$sort ? [query?.$sort[0], query?.$sort[1] ? 'DESC' : 'ASC'] : ['id', 'ASC'];
    const res = await api.get(`/${this.entityName}/`, {
      params: {
        select: query?.$select ? JSON.stringify(query?.$select) : undefined,
        range: JSON.stringify(range),
        sort: JSON.stringify(sort),
        filter: JSON.stringify(query?.filter),
      },
    });
    return res.data;
  }

  async update(id: string | number, payload: Type) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (payload as any)?.created_at;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (payload as any)?.updated_at;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (payload as any)?.created_by;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (payload as any)?.updated_by;
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.put(`/${this.entityName}/${id}`, payload, config);
  }

  async togglePublish(id: string | number) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.put(`/${this.entityName}/${id}/_publish`, {}, config);
  }

  async publish(id: string | number) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.put(`/${this.entityName}/${id}/_index`, {}, config);
  }

  async unpublish(id: string | number) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.delete(`/${this.entityName}/${id}/_index`, config);
  }

  async setState(id: string | number, state: string) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.put(`/${this.entityName}/${id}/_state?s=${state}`, {}, config);
  }

  async assign(id: string | number, assignee: string | null | undefined) {
    if (!assignee) return await this.unassign(id);

    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.put(`/${this.entityName}/${id}/_assign?assignee=${assignee}`, {}, config);
  }

  async unassign(id: string | number) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.delete(`/${this.entityName}/${id}/_assign`, config);
  }

  async remove(id: string | number) {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
    };
    return await api.delete(`/${this.entityName}/${id}`, config);
  }

  async index() {
    if (!authStore.isAuthenticated) throw new Error('Not authenticated');
    await authStore.updateToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.getAccessToken()}`,
      },
      params: {
        type: this.entityName,
      },
    };
    const res = await api.post('/search/_index', {}, config);
    return res.data[this.entityName];
  }
}

export const useServices = defineStore('services', () => {
  function make(
    entityName: string,
  ): Service<
    | NaturalResource
    | TechnicalConstruction
    | BuildingMaterial
    | Building
    | Professional
    | BuildingElement
  > {
    let entityType;
    switch (entityName) {
      case 'natural-resource':
        entityType = {} as NaturalResource;
        break;
      case 'technical-construction':
        entityType = {} as TechnicalConstruction;
        break;
      case 'building-material':
        entityType = {} as BuildingMaterial;
        break;
      case 'building':
        entityType = {} as Building;
        break;
      case 'professional':
        entityType = {} as Professional;
        break;
      case 'building-element':
        entityType = {} as BuildingElement;
        break;
    }
    if (!entityType) {
      throw new Error('Invalid entity name');
    }
    return new Service(entityType, entityName);
  }

  return {
    make,
  };
});
