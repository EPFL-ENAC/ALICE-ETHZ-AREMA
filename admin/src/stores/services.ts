import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import {
  NaturalResource,
  TechnicalConstruction,
  BuildingMaterial,
  Building,
  Professional,
  BuildingElement,
} from 'src/models';
import { Query } from 'src/components/models';

const authStore = useAuthStore();

export class Service<
  Type extends NaturalResource | TechnicalConstruction | BuildingMaterial | Building | Professional | BuildingElement,
> {
  constructor(
    public entityType: Type,
    public entityName: string,
  ) {}

  async create(payload: Type) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.post(`/${this.entityName}/`, payload, config);
    });
  }

  async get(id: string): Promise<Type> {
    return api.get(`/${this.entityName}/${id}`).then((res) => res.data);
  }

  async find(query: Query | undefined) {
    const range = [query?.$skip || 0, query?.$limit || 10 - 1];
    const sort = query?.$sort ? [query?.$sort[0], query?.$sort[1] ? 'DESC' : 'ASC'] : ['id', 'ASC'];
    return api
      .get(`/${this.entityName}/`, {
        params: {
          select: query?.$select ? JSON.stringify(query?.$select) : undefined,
          range: JSON.stringify(range),
          sort: JSON.stringify(sort),
          filter: JSON.stringify(query?.filter),
        },
      })
      .then((res) => res.data);
  }

  async update(id: string | number, payload: Type) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.created_by;
    delete payload.updated_by;
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.put(`/${this.entityName}/${id}`, payload, config);
    });
  }

  async remove(id: string | number) {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      return api.delete(`/${this.entityName}/${id}`, config);
    });
  }

  async index() {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        params: {
          type: this.entityName,
        },
      };
      return api.post('/search/_index', {}, config).then((res) => res.data[this.entityName]);
    });
  }
}

export const useServices = defineStore('services', () => {
  function make(
    entityName: string,
  ): Service<NaturalResource | TechnicalConstruction | BuildingMaterial | Building | Professional | BuildingElement> {
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
