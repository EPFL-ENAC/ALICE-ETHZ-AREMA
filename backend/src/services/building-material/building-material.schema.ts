// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const buildingMaterialSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'BuildingMaterial', additionalProperties: false }
)
export type BuildingMaterial = Static<typeof buildingMaterialSchema>
export const buildingMaterialValidator = getValidator(buildingMaterialSchema, dataValidator)
export const buildingMaterialResolver = resolve<BuildingMaterial, HookContext>({})

export const buildingMaterialExternalResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for creating new entries
export const buildingMaterialDataSchema = Type.Pick(buildingMaterialSchema, ['text'], {
  $id: 'BuildingMaterialData'
})
export type BuildingMaterialData = Static<typeof buildingMaterialDataSchema>
export const buildingMaterialDataValidator = getValidator(buildingMaterialDataSchema, dataValidator)
export const buildingMaterialDataResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for updating existing entries
export const buildingMaterialPatchSchema = Type.Partial(buildingMaterialSchema, {
  $id: 'BuildingMaterialPatch'
})
export type BuildingMaterialPatch = Static<typeof buildingMaterialPatchSchema>
export const buildingMaterialPatchValidator = getValidator(buildingMaterialPatchSchema, dataValidator)
export const buildingMaterialPatchResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for allowed query properties
export const buildingMaterialQueryProperties = Type.Pick(buildingMaterialSchema, ['id', 'text'])
export const buildingMaterialQuerySchema = Type.Intersect(
  [
    querySyntax(buildingMaterialQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BuildingMaterialQuery = Static<typeof buildingMaterialQuerySchema>
export const buildingMaterialQueryValidator = getValidator(buildingMaterialQuerySchema, queryValidator)
export const buildingMaterialQueryResolver = resolve<BuildingMaterialQuery, HookContext>({})
