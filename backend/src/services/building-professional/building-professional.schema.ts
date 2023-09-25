// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { User } from '../users/users.schema'
import { logger } from '../../logger'
import { Building } from '../building/building.schema'
import { Professional } from '../professional/professional.schema'

// Main data model schema
export const buildingProfessionalSchema = Type.Object(
  {
    buildingId: Type.Number(),
    professionalId: Type.Optional(Type.Number()),

    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedById: Type.Optional(Type.Number()),
    createdById: Type.Optional(Type.Number())
  },
  { $id: 'BuildingProfessional', additionalProperties: false }
)
export type BuildingProfessional = Static<typeof buildingProfessionalSchema>

// generate fake data
export async function generateFake(user: User, building: Building, professional: Professional) {
  const result = {
    buildingId: building.id,
    professionalId: professional.id,
    createdById: user.id
  }
  logger.info(`fake data building professional generated: ${JSON.stringify(result)}`)
  return result
}

export const buildingProfessionalValidator = getValidator(buildingProfessionalSchema, dataValidator)
export const buildingProfessionalResolver = resolve<BuildingProfessional, HookContext>({})

export const buildingProfessionalExternalResolver = resolve<BuildingProfessional, HookContext>({})

// Schema for creating new entries
export const buildingProfessionalDataSchema = Type.Pick(
  buildingProfessionalSchema,
  ['buildingId', 'professionalId', 'createdById'],
  {
    $id: 'BuildingProfessionalData'
  }
)
export type BuildingProfessionalData = Static<typeof buildingProfessionalDataSchema>
export const buildingProfessionalDataValidator = getValidator(buildingProfessionalDataSchema, dataValidator)
export const buildingProfessionalDataResolver = resolve<BuildingProfessional, HookContext>({
  createdAt: async () => {
    // Return the current date
    return new Date().toISOString()
  },
  createdById: async (value, message, context) => {
    // Associate the currently authenticated user
    return context.params?.user?.id ?? message?.createdById
  }
})

// Schema for updating existing entries
export const buildingProfessionalPatchSchema = Type.Partial(buildingProfessionalSchema, {
  $id: 'BuildingProfessionalPatch'
})
export type BuildingProfessionalPatch = Static<typeof buildingProfessionalPatchSchema>
export const buildingProfessionalPatchValidator = getValidator(buildingProfessionalPatchSchema, dataValidator)
export const buildingProfessionalPatchResolver = resolve<BuildingProfessional, HookContext>({
  updatedAt: async () => {
    // Return the current date
    return new Date().toISOString()
  },
  updatedById: async (value, message, context) => {
    // Associate the currently authenticated user
    return context.params?.user?.id ?? message?.updatedById
  }
})

// Schema for allowed query properties
export const buildingProfessionalQueryProperties = Type.Pick(buildingProfessionalSchema, [
  'buildingId',
  'professionalId',
  'createdById'
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
