// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalPatch,
  BuildingProfessionalQuery
} from './building-professional.schema'

export type {
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalPatch,
  BuildingProfessionalQuery
}

export interface BuildingProfessionalParams extends KnexAdapterParams<BuildingProfessionalQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BuildingProfessionalService<
  ServiceParams extends Params = BuildingProfessionalParams
> extends KnexService<
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalParams,
  BuildingProfessionalPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'building-professional'
  }
}
