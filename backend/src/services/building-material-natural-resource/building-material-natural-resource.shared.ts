// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourcePatch,
  BuildingMaterialNaturalResourceQuery,
  BuildingMaterialNaturalResourceService
} from './building-material-natural-resource.class'

export type {
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourcePatch,
  BuildingMaterialNaturalResourceQuery
}

export type BuildingMaterialNaturalResourceClientService = Pick<
  BuildingMaterialNaturalResourceService<Params<BuildingMaterialNaturalResourceQuery>>,
  (typeof buildingMaterialNaturalResourceMethods)[number]
>

export const buildingMaterialNaturalResourcePath = 'building-material-natural-resource'

export const buildingMaterialNaturalResourceMethods: Array<keyof BuildingMaterialNaturalResourceService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const buildingMaterialNaturalResourceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(buildingMaterialNaturalResourcePath, connection.service(buildingMaterialNaturalResourcePath), {
    methods: buildingMaterialNaturalResourceMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [buildingMaterialNaturalResourcePath]: BuildingMaterialNaturalResourceClientService
  }
}
