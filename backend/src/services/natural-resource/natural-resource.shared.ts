// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  NaturalResource,
  NaturalResourceData,
  NaturalResourcePatch,
  NaturalResourceQuery,
  NaturalResourceService
} from './natural-resource.class'

export type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery }

export type NaturalResourceClientService = Pick<
  NaturalResourceService<Params<NaturalResourceQuery>>,
  (typeof naturalResourceMethods)[number]
>

export const naturalResourcePath = 'natural-resource'

export const naturalResourceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const naturalResourceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(naturalResourcePath, connection.service(naturalResourcePath), {
    methods: naturalResourceMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [naturalResourcePath]: NaturalResourceClientService
  }
}
