// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { professionalSchema } from '../professional/professional.schema'
import { technicalConstructionSchema } from '../technical-construction/technical-construction'
import { User, UserData, userSchema } from '../users/users.schema'
import { faker } from '@faker-js/faker'
import { Application } from '@feathersjs/koa'
import { logger } from '../../logger'
import { Service } from '@feathersjs/feathers'

// Main data model schema
export const buildingSchema = Type.Object(
  {
    id: Type.Number(),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedById: Type.Optional(Type.Number()),
    createdById: Type.Number(),

    name: Type.String({ minLength: 1 }),
    description: Type.String(),
    address: Type.String({ minLength: 1 }),
    // professionalIds: Type.Array(Type.Number()),
    // technicalConstructionIds: Type.Array(Type.Number()),
    images: Type.Array(Type.String()), // url

    // generated by the resolver
    // professionals: Type.Array(Type.Ref(professionalSchema)),
    // technicalConstructions:  Type.Array(Type.Ref(technicalConstructionSchema)),
    updatedByUser: Type.Optional(Type.Ref(userSchema)),
    createdByUser: Type.Optional(Type.Ref(userSchema)),
    professionalIds: Type.Optional(Type.Array(Type.Number())),
    professionals: Type.Optional(Type.Array(Type.Ref(professionalSchema)))
  },
  { $id: 'Building', additionalProperties: true }
)
export type Building = Static<typeof buildingSchema>

// generate fake data
export async function generateFake(user: User) {
  const result = {
    createdById: user.id,
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    address: faker.location.streetAddress(),
    images: []
  }
  return result
}

export const buildingValidator = getValidator(buildingSchema, dataValidator)
export const buildingResolver = resolve<Building, HookContext>({
  professionalIds: virtual(async (message, context) => {
    const response = await context.app.service('building-professional').find({
      query: {
        buildingId: message.id
      }
    })
    return response.data.map((item: any) => item.professionalId)
  })
})

export const buildingProfessionResolver = resolve<Building, HookContext>({
  professionals: virtual(async (message: Building, context: HookContext) => {
    const response = await context.app.service('professional').find({
      query: {
        id: {
          $in: message?.professionalIds ?? []
        }
      }
    })
    return response.data
  })
})

export const buildingExternalResolver = resolve<Building, HookContext>({})

// Schema for creating new entries
export const buildingDataSchema = Type.Pick(buildingSchema, ['description'], {
  $id: 'BuildingData'
})
export type BuildingData = Static<typeof buildingDataSchema>
export const buildingDataValidator = getValidator(buildingDataSchema, dataValidator)
export const buildingDataResolver = resolve<Building, HookContext>({
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
export const buildingPatchSchema = Type.Partial(buildingSchema, {
  $id: 'BuildingPatch'
})
export type BuildingPatch = Static<typeof buildingPatchSchema>
export const buildingPatchValidator = getValidator(buildingPatchSchema, dataValidator)
export const buildingPatchResolver = resolve<Building, HookContext>({
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
export const buildingQueryProperties = Type.Pick(buildingSchema, ['id', 'description'])
export const buildingQuerySchema = Type.Intersect(
  [
    querySyntax(buildingQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BuildingQuery = Static<typeof buildingQuerySchema>
export const buildingQueryValidator = getValidator(buildingQuerySchema, queryValidator)
export const buildingQueryResolver = resolve<BuildingQuery, HookContext>({})