// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionPatch,
  TechnicalConstructionQuery,
  TechnicalConstructionService
} from './technical-construction.class'

export type {
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionPatch,
  TechnicalConstructionQuery
}

export type TechnicalConstructionClientService = Pick<
  TechnicalConstructionService<Params<TechnicalConstructionQuery>>,
  (typeof technicalConstructionMethods)[number]
>

export const technicalConstructionPath = 'technical-construction'

export const technicalConstructionMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const technicalConstructionClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(technicalConstructionPath, connection.service(technicalConstructionPath), {
    methods: technicalConstructionMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [technicalConstructionPath]: TechnicalConstructionClientService
  }
}
