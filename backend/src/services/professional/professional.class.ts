// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  Professional,
  ProfessionalData,
  ProfessionalPatch,
  ProfessionalQuery
} from './professional.schema'

export type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery }

export interface ProfessionalParams extends KnexAdapterParams<ProfessionalQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ProfessionalService<ServiceParams extends Params = ProfessionalParams> extends KnexService<
  Professional,
  ProfessionalData,
  ProfessionalParams,
  ProfessionalPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'professional'
  }
}
