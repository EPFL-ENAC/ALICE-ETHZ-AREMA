// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialPatch,
  TechnicalConstructionBuildingMaterialQuery
} from './technical-construction-building-material.schema'

export type {
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialPatch,
  TechnicalConstructionBuildingMaterialQuery
}

export interface TechnicalConstructionBuildingMaterialParams
  extends KnexAdapterParams<TechnicalConstructionBuildingMaterialQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TechnicalConstructionBuildingMaterialService<
  ServiceParams extends Params = TechnicalConstructionBuildingMaterialParams
> extends KnexService<
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialParams,
  TechnicalConstructionBuildingMaterialPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'technical-construction-building-material',
    multi: [ 'remove', 'create' ]
  }
}
