// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Building, BuildingData, BuildingPatch, BuildingQuery, BuildingService } from './building.class'

export type { Building, BuildingData, BuildingPatch, BuildingQuery }

export type BuildingClientService = Pick<
  BuildingService<Params<BuildingQuery>>,
  (typeof buildingMethods)[number]
>

export const buildingPath = 'building'

export const buildingMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const buildingClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(buildingPath, connection.service(buildingPath), {
    methods: buildingMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [buildingPath]: BuildingClientService
  }
}
