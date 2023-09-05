// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const buildingProfessionalSchema = Type.Object(
  {
    buildingId: Type.Number(),
    professionalId: Type.Number()
  },
  { $id: 'BuildingProfessional', additionalProperties: false }
)
export type BuildingProfessional = Static<typeof buildingProfessionalSchema>
export const buildingProfessionalValidator = getValidator(buildingProfessionalSchema, dataValidator)
export const buildingProfessionalResolver = resolve<BuildingProfessional, HookContext>({})

export const buildingProfessionalExternalResolver = resolve<BuildingProfessional, HookContext>({})

// Schema for creating new entries
export const buildingProfessionalDataSchema = Type.Pick(
  buildingProfessionalSchema,
  ['buildingId', 'professionalId'],
  {
    $id: 'BuildingProfessionalData'
  }
)
export type BuildingProfessionalData = Static<typeof buildingProfessionalDataSchema>
export const buildingProfessionalDataValidator = getValidator(buildingProfessionalDataSchema, dataValidator)
export const buildingProfessionalDataResolver = resolve<BuildingProfessional, HookContext>({})

// Schema for updating existing entries
export const buildingProfessionalPatchSchema = Type.Partial(buildingProfessionalSchema, {
  $id: 'BuildingProfessionalPatch'
})
export type BuildingProfessionalPatch = Static<typeof buildingProfessionalPatchSchema>
export const buildingProfessionalPatchValidator = getValidator(buildingProfessionalPatchSchema, dataValidator)
export const buildingProfessionalPatchResolver = resolve<BuildingProfessional, HookContext>({})

// Schema for allowed query properties
export const buildingProfessionalQueryProperties = Type.Pick(buildingProfessionalSchema, [
  'buildingId',
  'professionalId'
])
export const buildingProfessionalQuerySchema = Type.Intersect(
  [
    querySyntax(buildingProfessionalQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BuildingProfessionalQuery = Static<typeof buildingProfessionalQuerySchema>
export const buildingProfessionalQueryValidator = getValidator(
  buildingProfessionalQuerySchema,
  queryValidator
)
export const buildingProfessionalQueryResolver = resolve<BuildingProfessionalQuery, HookContext>({})
