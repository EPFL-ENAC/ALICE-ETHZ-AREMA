// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionPatch,
  TechnicalConstructionQuery
} from './technical-construction.schema'

export type {
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionPatch,
  TechnicalConstructionQuery
}

export interface TechnicalConstructionParams extends KnexAdapterParams<TechnicalConstructionQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TechnicalConstructionService<
  ServiceParams extends Params = TechnicalConstructionParams
> extends KnexService<
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionParams,
  TechnicalConstructionPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'technical-construction'
  }
}
