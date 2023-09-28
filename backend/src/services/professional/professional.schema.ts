// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { User } from '../users/users.schema'
import { ProfessionalType, professionalTypeSchema } from '../professional-type/professional-type.schema'
import { logger } from '../../logger'
import { faker } from '@faker-js/faker'

// Main data model schema
export const professionalSchema = Type.Object(
  {
    id: Type.Optional(Type.Number()),
    name: Type.String({ minLength: 1 }),
    description: Type.Optional(Type.String()),
    professionalTypeId: Type.Number(),
    professionalType: Type.Optional(Type.Ref(professionalTypeSchema)),
    address: Type.String({ minLength: 1 }),
    web: Type.Optional(Type.String()),
    tel: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email'})),
    images: Type.Array(Type.String()), // url
    links: Type.Array(Type.String()), // url
    areaDelivery: Type.Object({ coordinates: Type.Tuple([Type.Number(), Type.Number()]), radius: Type.Number() }),

    // generated by the resolver
    // updatedByUser: Type.Optional(Type.Ref(userSchema)),
    // createdByUser: Type.Ref(userSchema)
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedById: Type.Optional(Type.Number()),
    createdById: Type.Optional(Type.Number())
  },
  { $id: 'Professional', additionalProperties: false }
)
export type Professional = Static<typeof professionalSchema>

// generate fake data
export async function generateFake(user: User, professionalType: ProfessionalType) {
  // const findUser = app_.find()
  logger.info(`fake USER professional generated: ${JSON.stringify(user.id)}`)
  const result: Professional = {
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    professionalTypeId: professionalType.id as number,
    address: faker.location.streetAddress(),
    web: faker.internet.url(),
    tel: faker.phone.number(),
    email: faker.internet.email(),
    images: [],
    links: [],
    areaDelivery: {
      coordinates: [faker.location.longitude({ min: 5.9, max: 10.5 }), faker.location.latitude({ min: 45.8, max: 47.8 })]  as [number, number],
      radius: faker.number.int({ min: 1, max: 100 })
    }
  }
  // logger.info(`fake data building generated: ${JSON.stringify(result)}`)
  return result
}

export const professionalValidator = getValidator(professionalSchema, dataValidator)
export const professionalResolver = resolve<Professional, HookContext>({
  professionalType: virtual(async (message: Professional, context: HookContext) => {
    const response = await context.app.service('professional-type').find({
      query: {
        id: message?.professionalTypeId
      }
    })
    return response.total === 1 ? response.data[0] : undefined
  })
    // createdByUser: virtual(async (message, context) => {
    //   // Associate the user that sent the message
    //   if (message.createdById) {
    //     return context.app.service('users').get(message.createdById)
    //   }
    // }),
    // updatedByUser: virtual(async (message, context) => {
    //   // Associate the user that sent the message
    //   if (message.updatedById) {
    //     return context.app.service('users').get(context.data?.updatedById)
    //   }
    // })
})

export const professionalExternalResolver = resolve<Professional, HookContext>({})

// Schema for creating new entries
export const professionalDataSchema = Type.Pick(
  professionalSchema,
  ['name', 'description', 'professionalTypeId', 'address', 'web', 'tel', 'email', 'images', 'links', 'areaDelivery'],
  {
    $id: 'ProfessionalData'
  }
)
export type ProfessionalData = Static<typeof professionalDataSchema>
export const professionalDataValidator = getValidator(professionalDataSchema, dataValidator)
export const professionalDataResolver = resolve<Professional, HookContext>({})

// Schema for updating existing entries
export const professionalPatchSchema = Type.Partial(professionalSchema, {
  $id: 'ProfessionalPatch'
})
export type ProfessionalPatch = Static<typeof professionalPatchSchema>
export const professionalPatchValidator = getValidator(professionalPatchSchema, dataValidator)
export const professionalPatchResolver = resolve<Professional, HookContext>({
  createdAt: virtual(async () => {
    return new Date().toISOString()
  }),
  createdById: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context?.params?.user?.id
  })
})

// Schema for allowed query properties
export const professionalQueryProperties = Type.Pick(professionalSchema, [
  'id', 'name', 'description', 'professionalTypeId', 'address', 'web', 'tel', 'email', 'areaDelivery'
])
export const professionalQuerySchema = Type.Intersect(
  [
    querySyntax(professionalQueryProperties, {
      name: {
        $ilike: Type.String()
      },
      description: {
        $ilike: Type.String()
      },
      address: {
        $ilike: Type.String()
      }
    }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProfessionalQuery = Static<typeof professionalQuerySchema>
export const professionalQueryValidator = getValidator(professionalQuerySchema, queryValidator)
export const professionalQueryResolver = resolve<ProfessionalQuery, HookContext>({})
