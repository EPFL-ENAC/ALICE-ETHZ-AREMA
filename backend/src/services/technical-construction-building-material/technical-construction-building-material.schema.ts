// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TechnicalConstructionBuildingMaterialService } from './technical-construction-building-material.class'

// Main data model schema
export const technicalConstructionBuildingMaterialSchema = Type.Object(
  {
    id: Type.Number(),
    technicalConstructionId: Type.Number(),
    buildingMaterialId: Type.Number()
  },
  { $id: 'TechnicalConstructionBuildingMaterial', additionalProperties: false }
)
export type TechnicalConstructionBuildingMaterial = Static<typeof technicalConstructionBuildingMaterialSchema>
export const technicalConstructionBuildingMaterialValidator = getValidator(
  technicalConstructionBuildingMaterialSchema,
  dataValidator
)
export const technicalConstructionBuildingMaterialResolver = resolve<
  TechnicalConstructionBuildingMaterial,
  HookContext<TechnicalConstructionBuildingMaterialService>
>({})

export const technicalConstructionBuildingMaterialExternalResolver = resolve<
  TechnicalConstructionBuildingMaterial,
  HookContext<TechnicalConstructionBuildingMaterialService>
>({})

// Schema for creating new entries
export const technicalConstructionBuildingMaterialDataSchema = Type.Pick(
  technicalConstructionBuildingMaterialSchema,
  ['technicalConstructionId', 'buildingMaterialId'],
  {
    $id: 'TechnicalConstructionBuildingMaterialData'
  }
)
export type TechnicalConstructionBuildingMaterialData = Static<
  typeof technicalConstructionBuildingMaterialDataSchema
>
export const technicalConstructionBuildingMaterialDataValidator = getValidator(
  technicalConstructionBuildingMaterialDataSchema,
  dataValidator
)
export const technicalConstructionBuildingMaterialDataResolver = resolve<
  TechnicalConstructionBuildingMaterial,
  HookContext<TechnicalConstructionBuildingMaterialService>
>({})

// Schema for updating existing entries
export const technicalConstructionBuildingMaterialPatchSchema = Type.Partial(
  technicalConstructionBuildingMaterialSchema,
  {
    $id: 'TechnicalConstructionBuildingMaterialPatch'
  }
)
export type TechnicalConstructionBuildingMaterialPatch = Static<
  typeof technicalConstructionBuildingMaterialPatchSchema
>
export const technicalConstructionBuildingMaterialPatchValidator = getValidator(
  technicalConstructionBuildingMaterialPatchSchema,
  dataValidator
)
export const technicalConstructionBuildingMaterialPatchResolver = resolve<
  TechnicalConstructionBuildingMaterial,
  HookContext<TechnicalConstructionBuildingMaterialService>
>({})

// Schema for allowed query properties
export const technicalConstructionBuildingMaterialQueryProperties = Type.Pick(
  technicalConstructionBuildingMaterialSchema,
  ['id', 'technicalConstructionId', 'buildingMaterialId']
)
export const technicalConstructionBuildingMaterialQuerySchema = Type.Intersect(
  [
    querySyntax(technicalConstructionBuildingMaterialQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TechnicalConstructionBuildingMaterialQuery = Static<
  typeof technicalConstructionBuildingMaterialQuerySchema
>
export const technicalConstructionBuildingMaterialQueryValidator = getValidator(
  technicalConstructionBuildingMaterialQuerySchema,
  queryValidator
)
export const technicalConstructionBuildingMaterialQueryResolver = resolve<
  TechnicalConstructionBuildingMaterialQuery,
  HookContext<TechnicalConstructionBuildingMaterialService>
>({})
