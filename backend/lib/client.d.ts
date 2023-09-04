import type { TransportConnection, Application } from '@feathersjs/feathers';
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client';
import './services/technical-construction/technical-construction.shared';
export type { TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionQuery, TechnicalConstructionPatch } from './services/technical-construction/technical-construction.shared';
import './services/professional-type/professional-type.shared';
export type { ProfessionalType, ProfessionalTypeData, ProfessionalTypeQuery, ProfessionalTypePatch } from './services/professional-type/professional-type.shared';
import './services/professional/professional.shared';
export type { Professional, ProfessionalData, ProfessionalQuery, ProfessionalPatch } from './services/professional/professional.shared';
import './services/building-material/building-material.shared';
export type { BuildingMaterial, BuildingMaterialData, BuildingMaterialQuery, BuildingMaterialPatch } from './services/building-material/building-material.shared';
import './services/building-element/building-element.shared';
export type { BuildingElement, BuildingElementData, BuildingElementQuery, BuildingElementPatch } from './services/building-element/building-element.shared';
import './services/natural-resource/natural-resource.shared';
export type { NaturalResource, NaturalResourceData, NaturalResourceQuery, NaturalResourcePatch } from './services/natural-resource/natural-resource.shared';
import './services/users/users.shared';
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared';
export interface Configuration {
    connection: TransportConnection<ServiceTypes>;
}
export interface ServiceTypes {
}
export type ClientApplication = Application<ServiceTypes, Configuration>;
/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export declare const createClient: <Configuration_1 = any>(connection: TransportConnection<ServiceTypes>, authenticationOptions?: Partial<AuthenticationClientOptions>) => ClientApplication;
