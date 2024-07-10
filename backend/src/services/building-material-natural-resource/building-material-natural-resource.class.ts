// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourcePatch,
  BuildingMaterialNaturalResourceQuery
} from './building-material-natural-resource.schema'

export type {
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourcePatch,
  BuildingMaterialNaturalResourceQuery
}

export interface BuildingMaterialNaturalResourceParams
  extends KnexAdapterParams<BuildingMaterialNaturalResourceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BuildingMaterialNaturalResourceService<
  ServiceParams extends Params = BuildingMaterialNaturalResourceParams
> extends KnexService<
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourceParams,
  BuildingMaterialNaturalResourcePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'building-material-natural-resource'
  }
}
