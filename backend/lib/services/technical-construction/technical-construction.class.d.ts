import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionPatch, TechnicalConstructionQuery } from './technical-construction.schema';
export type { TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionPatch, TechnicalConstructionQuery };
export interface TechnicalConstructionParams extends KnexAdapterParams<TechnicalConstructionQuery> {
}
export declare class TechnicalConstructionService<ServiceParams extends Params = TechnicalConstructionParams> extends KnexService<TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionParams, TechnicalConstructionPatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
