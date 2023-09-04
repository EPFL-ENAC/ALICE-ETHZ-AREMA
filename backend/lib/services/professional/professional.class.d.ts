import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery } from './professional.schema';
export type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery };
export interface ProfessionalParams extends KnexAdapterParams<ProfessionalQuery> {
}
export declare class ProfessionalService<ServiceParams extends Params = ProfessionalParams> extends KnexService<Professional, ProfessionalData, ProfessionalParams, ProfessionalPatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
