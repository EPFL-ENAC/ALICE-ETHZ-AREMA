// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { User, userSchema } from '../users/users.schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { faker } from '@faker-js/faker'
import { logger } from '../../logger'

// Main data model schema
export const naturalResourceSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    images: Type.Array(Type.String()), // url
    description: Type.String(),

    // TODO min/max variations
    density: Type.Optional(Type.Number()),
    compressive_strength: Type.Optional(Type.Number()),
    tensile_strength: Type.Optional(Type.Number()),
    youngs_modulus: Type.Optional(Type.Number()),
    shrinkage: Type.Optional(Type.Number()),
    settlement: Type.Optional(Type.Number()),
    thermal_conductivity: Type.Optional(Type.Number()),
    thermal_capacity: Type.Optional(Type.Number()),
    vapor_diffusion_resistance: Type.Optional(Type.Number()),
    moisture_buffering: Type.Optional(Type.Number()),
    u: Type.Optional(Type.Number()),
    effusivity: Type.Optional(Type.Number()),
    diffusivity: Type.Optional(Type.Number()),
    absorption_coefficient: Type.Optional(Type.Number()),
    sound_reduction_index: Type.Optional(Type.Number()),
    fire_resistance: Type.Optional(Type.Number()),

    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedById: Type.Optional(Type.Number()),
    createdById: Type.Optional(Type.Number())
  },
  { $id: 'NaturalResource', additionalProperties: false }
)

export type NaturalResource = Static<typeof naturalResourceSchema>

// generate fake data
export function generateFake(user: User) {
  const result = {
    name: faker.lorem.words(3),
    images: [],
    description: faker.lorem.paragraph(),
    density: faker.number.int({ min: 1, max: 100 }),
    compressive_strength: faker.number.int({ min: 1, max: 100 }),
    tensile_strength: faker.number.int({ min: 1, max: 100 }),
    youngs_modulus: faker.number.int({ min: 1, max: 100 }),
    shrinkage: faker.number.int({ min: 1, max: 100 }),
    settlement: faker.number.int({ min: 1, max: 100 }),
    thermal_conductivity: faker.number.int({ min: 1, max: 100 }),
    thermal_capacity: faker.number.int({ min: 1, max: 100 }),
    vapor_diffusion_resistance: faker.number.int({ min: 1, max: 100 }),
    moisture_buffering: faker.number.int({ min: 1, max: 100 }),
    u: faker.number.int({ min: 1, max: 100 }),
    effusivity: faker.number.int({ min: 1, max: 100 }),
    diffusivity: faker.number.int({ min: 1, max: 100 }),
    absorption_coefficient: faker.number.int({ min: 1, max: 100 }),
    sound_reduction_index: faker.number.int({ min: 1, max: 100 }),
    fire_resistance: faker.number.int({ min: 1, max: 100 })
  }
  logger.debug(`fake data natural resource generated: ${JSON.stringify(result)}`)
  return result
}

export const naturalResourceValidator = getValidator(naturalResourceSchema, dataValidator)
export const naturalResourceResolver = resolve<NaturalResource, HookContext>({})

export const naturalResourceExternalResolver = resolve<NaturalResource, HookContext>({})

// Schema for creating new entries
export const naturalResourceDataSchema = Type.Pick(
  naturalResourceSchema,
  ['name', 'images', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'],
  {
    $id: 'NaturalResourceData'
  }
)
export type NaturalResourceData = Static<typeof naturalResourceDataSchema>
export const naturalResourceDataValidator = getValidator(naturalResourceDataSchema, dataValidator)
export const naturalResourceDataResolver = resolve<NaturalResource, HookContext>({
  createdAt: virtual(async () => {
    return new Date().toISOString()
  }),
  createdById: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context?.params?.user?.id
  })
})

// Schema for updating existing entries
export const naturalResourcePatchSchema = Type.Partial(naturalResourceSchema, {
  $id: 'NaturalResourcePatch'
})
export type NaturalResourcePatch = Static<typeof naturalResourcePatchSchema>
export const naturalResourcePatchValidator = getValidator(naturalResourcePatchSchema, dataValidator)
export const naturalResourcePatchResolver = resolve<NaturalResource, HookContext>({
  updatedAt: virtual(async () => {
    return new Date().toISOString()
  }),
  updatedById: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context?.params?.user?.id
  })
})

// Schema for allowed query properties
export const naturalResourceQueryProperties = Type.Pick(naturalResourceSchema, ['id', 'name', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'])
export const naturalResourceQuerySchema = Type.Intersect(
  [
    querySyntax(naturalResourceQueryProperties, {
      name: {
        $ilike: Type.String()
      },
      description: {
        $ilike: Type.String()
      }
    }),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: true })
  ],
  { additionalProperties: true }
)
export type NaturalResourceQuery = Static<typeof naturalResourceQuerySchema>
export const naturalResourceQueryValidator = getValidator(naturalResourceQuerySchema, queryValidator)
export const naturalResourceQueryResolver = resolve<NaturalResourceQuery, HookContext>({})
