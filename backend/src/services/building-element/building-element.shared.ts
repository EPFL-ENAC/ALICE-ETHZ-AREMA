// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  BuildingElement,
  BuildingElementData,
  BuildingElementPatch,
  BuildingElementQuery,
  BuildingElementService
} from './building-element.class'

export type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery }

export type BuildingElementClientService = Pick<
  BuildingElementService<Params<BuildingElementQuery>>,
  (typeof buildingElementMethods)[number]
>

export const buildingElementPath = 'building-element'

export const buildingElementMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const buildingElementClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(buildingElementPath, connection.service(buildingElementPath), {
    methods: buildingElementMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [buildingElementPath]: BuildingElementClientService
  }
}
