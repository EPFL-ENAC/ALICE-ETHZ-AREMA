import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery } from './professional-type.schema';
export type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery };
export interface ProfessionalTypeParams extends KnexAdapterParams<ProfessionalTypeQuery> {
}
export declare class ProfessionalTypeService<ServiceParams extends Params = ProfessionalTypeParams> extends KnexService<ProfessionalType, ProfessionalTypeData, ProfessionalTypeParams, ProfessionalTypePatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
