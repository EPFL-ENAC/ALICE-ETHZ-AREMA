// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { technicalConstructionBuildingMaterialClient } from './services/technical-construction-building-material/technical-construction-building-material.shared'
export type {
  TechnicalConstructionBuildingMaterial,
  TechnicalConstructionBuildingMaterialData,
  TechnicalConstructionBuildingMaterialQuery,
  TechnicalConstructionBuildingMaterialPatch
} from './services/technical-construction-building-material/technical-construction-building-material.shared'

import { technicalConstructionNaturalResourceClient } from './services/technical-construction-natural-resource/technical-construction-natural-resource.shared'
export type {
  TechnicalConstructionNaturalResource,
  TechnicalConstructionNaturalResourceData,
  TechnicalConstructionNaturalResourceQuery,
  TechnicalConstructionNaturalResourcePatch
} from './services/technical-construction-natural-resource/technical-construction-natural-resource.shared'

import { buildingMaterialNaturalResourceClient } from './services/building-material-natural-resource/building-material-natural-resource.shared'
export type {
  BuildingMaterialNaturalResource,
  BuildingMaterialNaturalResourceData,
  BuildingMaterialNaturalResourceQuery,
  BuildingMaterialNaturalResourcePatch
} from './services/building-material-natural-resource/building-material-natural-resource.shared'

import { buildingProfessionalClient } from './services/building-professional/building-professional.shared'
export type {
  BuildingProfessional,
  BuildingProfessionalData,
  BuildingProfessionalQuery,
  BuildingProfessionalPatch
} from './services/building-professional/building-professional.shared'

import { buildingClient } from './services/building/building.shared'
export type {
  Building,
  BuildingData,
  BuildingQuery,
  BuildingPatch
} from './services/building/building.shared'

import { technicalConstructionClient } from './services/technical-construction/technical-construction.shared'
export type {
  TechnicalConstruction,
  TechnicalConstructionData,
  TechnicalConstructionQuery,
  TechnicalConstructionPatch
} from './services/technical-construction/technical-construction.shared'

import { professionalTypeClient } from './services/professional-type/professional-type.shared'
export type {
  ProfessionalType,
  ProfessionalTypeData,
  ProfessionalTypeQuery,
  ProfessionalTypePatch
} from './services/professional-type/professional-type.shared'

import { professionalClient } from './services/professional/professional.shared'
export type {
  Professional,
  ProfessionalData,
  ProfessionalQuery,
  ProfessionalPatch
} from './services/professional/professional.shared'

import { buildingMaterialClient } from './services/building-material/building-material.shared'
export type {
  BuildingMaterial,
  BuildingMaterialData,
  BuildingMaterialQuery,
  BuildingMaterialPatch
} from './services/building-material/building-material.shared'

import { buildingElementClient } from './services/building-element/building-element.shared'
export type {
  BuildingElement,
  BuildingElementData,
  BuildingElementQuery,
  BuildingElementPatch
} from './services/building-element/building-element.shared'

import { naturalResourceClient } from './services/natural-resource/natural-resource.shared'
export type {
  NaturalResource,
  NaturalResourceData,
  NaturalResourceQuery,
  NaturalResourcePatch
} from './services/natural-resource/natural-resource.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(naturalResourceClient)
  client.configure(buildingElementClient)
  client.configure(buildingMaterialClient)
  client.configure(professionalClient)
  client.configure(professionalTypeClient)
  client.configure(technicalConstructionClient)
  client.configure(buildingClient)
  client.configure(buildingProfessionalClient)
  client.configure(buildingMaterialNaturalResourceClient)
  client.configure(technicalConstructionNaturalResourceClient)
  client.configure(technicalConstructionBuildingMaterialClient)
  return client
}
