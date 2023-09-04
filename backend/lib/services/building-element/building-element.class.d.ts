import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery } from './building-element.schema';
export type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery };
export interface BuildingElementParams extends KnexAdapterParams<BuildingElementQuery> {
}
export declare class BuildingElementService<ServiceParams extends Params = BuildingElementParams> extends KnexService<BuildingElement, BuildingElementData, BuildingElementParams, BuildingElementPatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
