// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ProfessionalType,
  ProfessionalTypeData,
  ProfessionalTypePatch,
  ProfessionalTypeQuery,
  ProfessionalTypeService
} from './professional-type.class'

export type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery }

export type ProfessionalTypeClientService = Pick<
  ProfessionalTypeService<Params<ProfessionalTypeQuery>>,
  (typeof professionalTypeMethods)[number]
>

export const professionalTypePath = 'professional-type'

export const professionalTypeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const professionalTypeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(professionalTypePath, connection.service(professionalTypePath), {
    methods: professionalTypeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [professionalTypePath]: ProfessionalTypeClientService
  }
}
