// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const professionalTypeSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'ProfessionalType', additionalProperties: false }
)
export type ProfessionalType = Static<typeof professionalTypeSchema>
export const professionalTypeValidator = getValidator(professionalTypeSchema, dataValidator)
export const professionalTypeResolver = resolve<ProfessionalType, HookContext>({})

export const professionalTypeExternalResolver = resolve<ProfessionalType, HookContext>({})

// Schema for creating new entries
export const professionalTypeDataSchema = Type.Pick(professionalTypeSchema, ['text'], {
  $id: 'ProfessionalTypeData'
})
export type ProfessionalTypeData = Static<typeof professionalTypeDataSchema>
export const professionalTypeDataValidator = getValidator(professionalTypeDataSchema, dataValidator)
export const professionalTypeDataResolver = resolve<ProfessionalType, HookContext>({})

// Schema for updating existing entries
export const professionalTypePatchSchema = Type.Partial(professionalTypeSchema, {
  $id: 'ProfessionalTypePatch'
})
export type ProfessionalTypePatch = Static<typeof professionalTypePatchSchema>
export const professionalTypePatchValidator = getValidator(professionalTypePatchSchema, dataValidator)
export const professionalTypePatchResolver = resolve<ProfessionalType, HookContext>({})

// Schema for allowed query properties
export const professionalTypeQueryProperties = Type.Pick(professionalTypeSchema, ['id', 'text'])
export const professionalTypeQuerySchema = Type.Intersect(
  [
    querySyntax(professionalTypeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProfessionalTypeQuery = Static<typeof professionalTypeQuerySchema>
export const professionalTypeQueryValidator = getValidator(professionalTypeQuerySchema, queryValidator)
export const professionalTypeQueryResolver = resolve<ProfessionalTypeQuery, HookContext>({})
