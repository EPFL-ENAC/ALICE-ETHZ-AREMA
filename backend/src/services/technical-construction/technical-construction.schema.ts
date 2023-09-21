// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const technicalConstructionSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'TechnicalConstruction', additionalProperties: false }
)
export type TechnicalConstruction = Static<typeof technicalConstructionSchema>
export const technicalConstructionValidator = getValidator(technicalConstructionSchema, dataValidator)
export const technicalConstructionResolver = resolve<TechnicalConstruction, HookContext>({})

export const technicalConstructionExternalResolver = resolve<TechnicalConstruction, HookContext>({})

// Schema for creating new entries
export const technicalConstructionDataSchema = Type.Pick(technicalConstructionSchema, ['text'], {
  $id: 'TechnicalConstructionData'
})
export type TechnicalConstructionData = Static<typeof technicalConstructionDataSchema>
export const technicalConstructionDataValidator = getValidator(technicalConstructionDataSchema, dataValidator)
export const technicalConstructionDataResolver = resolve<TechnicalConstruction, HookContext>({})

// Schema for updating existing entries
export const technicalConstructionPatchSchema = Type.Partial(technicalConstructionSchema, {
  $id: 'TechnicalConstructionPatch'
})
export type TechnicalConstructionPatch = Static<typeof technicalConstructionPatchSchema>
export const technicalConstructionPatchValidator = getValidator(
  technicalConstructionPatchSchema,
  dataValidator
)
export const technicalConstructionPatchResolver = resolve<TechnicalConstruction, HookContext>({})

// Schema for allowed query properties
export const technicalConstructionQueryProperties = Type.Pick(technicalConstructionSchema, ['id', 'text'])
export const technicalConstructionQuerySchema = Type.Intersect(
  [
    querySyntax(technicalConstructionQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TechnicalConstructionQuery = Static<typeof technicalConstructionQuerySchema>
export const technicalConstructionQueryValidator = getValidator(
  technicalConstructionQuerySchema,
  queryValidator
)
export const technicalConstructionQueryResolver = resolve<TechnicalConstructionQuery, HookContext>({})
