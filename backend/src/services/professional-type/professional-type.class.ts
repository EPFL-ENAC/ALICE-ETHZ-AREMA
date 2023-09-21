// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ProfessionalType,
  ProfessionalTypeData,
  ProfessionalTypePatch,
  ProfessionalTypeQuery
} from './professional-type.schema'

export type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery }

export interface ProfessionalTypeParams extends KnexAdapterParams<ProfessionalTypeQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ProfessionalTypeService<
  ServiceParams extends Params = ProfessionalTypeParams
> extends KnexService<
  ProfessionalType,
  ProfessionalTypeData,
  ProfessionalTypeParams,
  ProfessionalTypePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'professional-type'
  }
}
