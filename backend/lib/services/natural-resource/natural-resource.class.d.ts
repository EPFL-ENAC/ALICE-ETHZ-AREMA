import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery } from './natural-resource.schema';
export type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery };
export interface NaturalResourceParams extends KnexAdapterParams<NaturalResourceQuery> {
}
export declare class NaturalResourceService<ServiceParams extends Params = NaturalResourceParams> extends KnexService<NaturalResource, NaturalResourceData, NaturalResourceParams, NaturalResourcePatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
