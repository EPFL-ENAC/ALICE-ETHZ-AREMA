import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery } from './building-material.schema';
export type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery };
export interface BuildingMaterialParams extends KnexAdapterParams<BuildingMaterialQuery> {
}
export declare class BuildingMaterialService<ServiceParams extends Params = BuildingMaterialParams> extends KnexService<BuildingMaterial, BuildingMaterialData, BuildingMaterialParams, BuildingMaterialPatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
