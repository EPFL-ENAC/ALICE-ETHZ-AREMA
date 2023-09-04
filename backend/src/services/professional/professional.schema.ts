// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const professionalSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Professional', additionalProperties: false }
)
export type Professional = Static<typeof professionalSchema>
export const professionalValidator = getValidator(professionalSchema, dataValidator)
export const professionalResolver = resolve<Professional, HookContext>({})

export const professionalExternalResolver = resolve<Professional, HookContext>({})

// Schema for creating new entries
export const professionalDataSchema = Type.Pick(professionalSchema, ['text'], {
  $id: 'ProfessionalData'
})
export type ProfessionalData = Static<typeof professionalDataSchema>
export const professionalDataValidator = getValidator(professionalDataSchema, dataValidator)
export const professionalDataResolver = resolve<Professional, HookContext>({})

// Schema for updating existing entries
export const professionalPatchSchema = Type.Partial(professionalSchema, {
  $id: 'ProfessionalPatch'
})
export type ProfessionalPatch = Static<typeof professionalPatchSchema>
export const professionalPatchValidator = getValidator(professionalPatchSchema, dataValidator)
export const professionalPatchResolver = resolve<Professional, HookContext>({})

// Schema for allowed query properties
export const professionalQueryProperties = Type.Pick(professionalSchema, ['id', 'text'])
export const professionalQuerySchema = Type.Intersect(
  [
    querySyntax(professionalQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProfessionalQuery = Static<typeof professionalQuerySchema>
export const professionalQueryValidator = getValidator(professionalQuerySchema, queryValidator)
export const professionalQueryResolver = resolve<ProfessionalQuery, HookContext>({})
