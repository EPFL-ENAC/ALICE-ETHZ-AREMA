import { defineStore } from 'pinia';
import { api } from 'src/boot/api';
import {
  NaturalResource,
  TechnicalConstruction,
  BuildingMaterial,
  Building,
  Professional,
} from 'src/models';
import { Query } from 'src/components/models';

export class Service<
  Type extends
    | NaturalResource
    | TechnicalConstruction
    | BuildingMaterial
    | Building
    | Professional,
> {
  constructor(
    public entityType: Type,
    public entityName: string,
  ) {}

  async create(payload: Type) {
    return api.post(`/${this.entityName}`, payload);
  }

  async get(id: string): Promise<Type> {
    return api.get(`/${this.entityName}/${id}`);
  }

  async find(query: Query | undefined) {
    const range = [query?.$skip || 0, query?.$limit || 10];
    return api
      .get(`/${this.entityName}/`, {
        params: {
          range: JSON.stringify(range),
          filter: JSON.stringify(query?.filter),
        },
      })
      .then((res) => res.data);
  }

  async update(id: string, payload: Type) {
    return api.put(`/${this.entityName}/${id}`, payload);
  }

  async delete(id: string) {
    return api.delete(`/${this.entityName}/${id}`);
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
