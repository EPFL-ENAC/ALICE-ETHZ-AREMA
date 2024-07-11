// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { BuildingMaterialNaturalResourceService } from './building-material-natural-resource.class'

// Main data model schema
export const buildingMaterialNaturalResourceSchema = Type.Object(
  {
    id: Type.Optional(Type.Union([Type.Null(), Type.Number()])),
    buildingMaterialId: Type.Number(),
    naturalResourceId: Type.Number()
  },
  { $id: 'BuildingMaterialNaturalResource', additionalProperties: false }
)
export type BuildingMaterialNaturalResource = Static<typeof buildingMaterialNaturalResourceSchema>
export const buildingMaterialNaturalResourceValidator = getValidator(
  buildingMaterialNaturalResourceSchema,
  dataValidator
)
export const buildingMaterialNaturalResourceResolver = resolve<
  BuildingMaterialNaturalResource,
  HookContext<BuildingMaterialNaturalResourceService>
>({})

export const buildingMaterialNaturalResourceExternalResolver = resolve<
  BuildingMaterialNaturalResource,
  HookContext<BuildingMaterialNaturalResourceService>
>({})

// Schema for creating new entries
export const buildingMaterialNaturalResourceDataSchema = Type.Pick(
  buildingMaterialNaturalResourceSchema,
  ['buildingMaterialId', 'naturalResourceId'],
  {
    $id: 'BuildingMaterialNaturalResourceData'
  }
)
export type BuildingMaterialNaturalResourceData = Static<typeof buildingMaterialNaturalResourceDataSchema>
export const buildingMaterialNaturalResourceDataValidator = getValidator(
  buildingMaterialNaturalResourceDataSchema,
  dataValidator
)
export const buildingMaterialNaturalResourceDataResolver = resolve<
  BuildingMaterialNaturalResource,
  HookContext<BuildingMaterialNaturalResourceService>
>({})

// Schema for updating existing entries
export const buildingMaterialNaturalResourcePatchSchema = Type.Partial(
  buildingMaterialNaturalResourceSchema,
  {
    $id: 'BuildingMaterialNaturalResourcePatch'
  }
)
export type BuildingMaterialNaturalResourcePatch = Static<typeof buildingMaterialNaturalResourcePatchSchema>
export const buildingMaterialNaturalResourcePatchValidator = getValidator(
  buildingMaterialNaturalResourcePatchSchema,
  dataValidator
)
export const buildingMaterialNaturalResourcePatchResolver = resolve<
  BuildingMaterialNaturalResource,
  HookContext<BuildingMaterialNaturalResourceService>
>({})

// Schema for allowed query properties
export const buildingMaterialNaturalResourceQueryProperties = Type.Pick(
  buildingMaterialNaturalResourceSchema,
  ['id', 'buildingMaterialId', 'naturalResourceId'],
)
export const buildingMaterialNaturalResourceQuerySchema = Type.Intersect(
  [
    querySyntax(buildingMaterialNaturalResourceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BuildingMaterialNaturalResourceQuery = Static<typeof buildingMaterialNaturalResourceQuerySchema>
export const buildingMaterialNaturalResourceQueryValidator = getValidator(
  buildingMaterialNaturalResourceQuerySchema,
  queryValidator
)
export const buildingMaterialNaturalResourceQueryResolver = resolve<
  BuildingMaterialNaturalResourceQuery,
  HookContext<BuildingMaterialNaturalResourceService>
>({})
