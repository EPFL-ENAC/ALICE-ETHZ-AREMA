// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialPatch,
  TechnicalConstructionBuildingMaterialQuery,
  TechnicalConstructionBuildingMaterialService
} from './technical-construction-building-material.class'

export type {
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialPatch,
  TechnicalConstructionBuildingMaterialQuery
}

export type TechnicalConstructionBuildingMaterialClientService = Pick<
  TechnicalConstructionBuildingMaterialService<Params<TechnicalConstructionBuildingMaterialQuery>>,
  (typeof technicalConstructionBuildingMaterialMethods)[number]
>

export const technicalConstructionBuildingMaterialPath = 'technical-construction-building-material'

export const technicalConstructionBuildingMaterialMethods: Array<
  keyof TechnicalConstructionBuildingMaterialService
> = ['find', 'get', 'create', 'patch', 'remove']

export const technicalConstructionBuildingMaterialClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(
    technicalConstructionBuildingMaterialPath,
    connection.service(technicalConstructionBuildingMaterialPath),
    {
      methods: technicalConstructionBuildingMaterialMethods
    }
  )
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [technicalConstructionBuildingMaterialPath]: TechnicalConstructionBuildingMaterialClientService
  }
}
