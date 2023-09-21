// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  BuildingElement,
  BuildingElementData,
  BuildingElementPatch,
  BuildingElementQuery
} from './building-element.schema'

export type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery }

export interface BuildingElementParams extends KnexAdapterParams<BuildingElementQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BuildingElementService<ServiceParams extends Params = BuildingElementParams> extends KnexService<
  BuildingElement,
  BuildingElementData,
  BuildingElementParams,
  BuildingElementPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'building-element'
  }
}
