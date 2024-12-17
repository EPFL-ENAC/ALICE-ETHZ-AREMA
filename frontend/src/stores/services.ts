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

  async get(id: string): Promise<Type> {
    return api.get(`/${this.entityName}/${id}`).then((res) => res.data);
  }

  async find(query: Query | undefined) {
    const range = [query?.$skip || 0, query?.$limit || 10 - 1];
    const sort = query?.$sort
      ? [query?.$sort[0], query?.$sort[1] ? 'DESC' : 'ASC']
      : ['id', 'ASC'];
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
