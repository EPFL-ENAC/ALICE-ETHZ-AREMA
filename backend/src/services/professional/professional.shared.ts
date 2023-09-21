// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Professional,
  ProfessionalData,
  ProfessionalPatch,
  ProfessionalQuery,
  ProfessionalService
} from './professional.class'

export type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery }

export type ProfessionalClientService = Pick<
  ProfessionalService<Params<ProfessionalQuery>>,
  (typeof professionalMethods)[number]
>

export const professionalPath = 'professional'

export const professionalMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const professionalClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(professionalPath, connection.service(professionalPath), {
    methods: professionalMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [professionalPath]: ProfessionalClientService
  }
}
