// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalPatch,
  BuildingProfessionalQuery,
  BuildingProfessionalService
} from './building-professional.class'

export type {
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalPatch,
  BuildingProfessionalQuery
}

export type BuildingProfessionalClientService = Pick<
  BuildingProfessionalService<Params<BuildingProfessionalQuery>>,
  (typeof buildingProfessionalMethods)[number]
>

export const buildingProfessionalPath = 'building-professional'

export const buildingProfessionalMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const buildingProfessionalClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(buildingProfessionalPath, connection.service(buildingProfessionalPath), {
    methods: buildingProfessionalMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [buildingProfessionalPath]: BuildingProfessionalClientService
  }
}
