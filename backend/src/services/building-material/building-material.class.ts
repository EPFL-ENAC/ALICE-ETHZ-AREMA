// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  BuildingMaterial,
  BuildingMaterialData,
  BuildingMaterialPatch,
  BuildingMaterialQuery
} from './building-material.schema'

export type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery }

export interface BuildingMaterialParams extends KnexAdapterParams<BuildingMaterialQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BuildingMaterialService<
  ServiceParams extends Params = BuildingMaterialParams
> extends KnexService<
  BuildingMaterial,
  BuildingMaterialData,
  BuildingMaterialParams,
  BuildingMaterialPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'building-material'
  }
}
