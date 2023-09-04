// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  BuildingMaterial,
  BuildingMaterialData,
  BuildingMaterialPatch,
  BuildingMaterialQuery,
  BuildingMaterialService
} from './building-material.class'

export type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery }

export type BuildingMaterialClientService = Pick<
  BuildingMaterialService<Params<BuildingMaterialQuery>>,
  (typeof buildingMaterialMethods)[number]
>

export const buildingMaterialPath = 'building-material'

export const buildingMaterialMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const buildingMaterialClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(buildingMaterialPath, connection.service(buildingMaterialPath), {
    methods: buildingMaterialMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [buildingMaterialPath]: BuildingMaterialClientService
  }
}
