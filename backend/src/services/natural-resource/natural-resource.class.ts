// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  NaturalResource,
  NaturalResourceData,
  NaturalResourcePatch,
  NaturalResourceQuery
} from './natural-resource.schema'

export type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery }

export interface NaturalResourceParams extends KnexAdapterParams<NaturalResourceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class NaturalResourceService<ServiceParams extends Params = NaturalResourceParams> extends KnexService<
  NaturalResource,
  NaturalResourceData,
  NaturalResourceParams,
  NaturalResourcePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'natural-resource'
  }
}
