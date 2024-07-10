// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { ObjectPropertyKeys, Static } from '@feathersjs/typebox'
import { User } from '../users/users.schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { faker } from '@faker-js/faker'
import { logger } from '../../logger'
import { allPhysicalProperties, allPhysicalPropertiesSchema } from '../../helpers/physical-properties'

// Main data model schema
export const naturalResourceSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    images: Type.Array(Type.String()), // url
    description: Type.String(),

    ...allPhysicalPropertiesSchema,

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
    id: 0, // ????
    name: faker.lorem.words(3),
    images: [],
    description: faker.lorem.paragraph(),

    density:                    faker.number.float({ min: 20, max: 80 }),
    compressive_strength:       faker.number.float({ min: 20, max: 80 }),
    tensile_strength:           faker.number.float({ min: 20, max: 80 }),
    youngs_modulus:             faker.number.float({ min: 20, max: 80 }),
    shrinkage:                  faker.number.float({ min: 20, max: 80 }),
    settlement:                 faker.number.float({ min: 20, max: 80 }),
    thermal_conductivity:       faker.number.float({ min: 20, max: 80 }),
    thermal_capacity:           faker.number.float({ min: 20, max: 80 }),
    vapor_diffusion_resistance: faker.number.float({ min: 20, max: 80 }),
    moisture_buffering:         faker.number.float({ min: 20, max: 80 }),
    u:                          faker.number.float({ min: 20, max: 80 }),
    effusivity:                 faker.number.float({ min: 20, max: 80 }),
    diffusivity:                faker.number.float({ min: 20, max: 80 }),
    absorption_coefficient:     faker.number.float({ min: 20, max: 80 }),
    sound_reduction_index:      faker.number.float({ min: 20, max: 80 }),
    reaction_to_fire:           faker.number.float({ min: 20, max: 80 }),
    building_material_class:    faker.number.float({ min: 20, max: 80 }),
    fire_resistance_class:      faker.number.float({ min: 20, max: 80 }),
    air_tightness:              faker.number.float({ min: 20, max: 80 }),

    density_low:                    faker.number.float({ min: 1, max: 10 }),
    compressive_strength_low:       faker.number.float({ min: 1, max: 10 }),
    tensile_strength_low:           faker.number.float({ min: 1, max: 10 }),
    youngs_modulus_low:             faker.number.float({ min: 1, max: 10 }),
    shrinkage_low:                  faker.number.float({ min: 1, max: 10 }),
    settlement_low:                 faker.number.float({ min: 1, max: 10 }),
    thermal_conductivity_low:       faker.number.float({ min: 1, max: 10 }),
    thermal_capacity_low:           faker.number.float({ min: 1, max: 10 }),
    vapor_diffusion_resistance_low: faker.number.float({ min: 1, max: 10 }),
    moisture_buffering_low:         faker.number.float({ min: 1, max: 10 }),
    u_low:                          faker.number.float({ min: 1, max: 10 }),
    effusivity_low:                 faker.number.float({ min: 1, max: 10 }),
    diffusivity_low:                faker.number.float({ min: 1, max: 10 }),
    absorption_coefficient_low:     faker.number.float({ min: 1, max: 10 }),
    sound_reduction_index_low:      faker.number.float({ min: 1, max: 10 }),
    reaction_to_fire_low:           faker.number.float({ min: 1, max: 10 }),
    building_material_class_low:    faker.number.float({ min: 1, max: 10 }),
    fire_resistance_class_low:      faker.number.float({ min: 1, max: 10 }),
    air_tightness_low:              faker.number.float({ min: 1, max: 10 }),

    density_high:                    faker.number.float({ min: 90, max: 100 }),
    compressive_strength_high:       faker.number.float({ min: 90, max: 100 }),
    tensile_strength_high:           faker.number.float({ min: 90, max: 100 }),
    youngs_modulus_high:             faker.number.float({ min: 90, max: 100 }),
    shrinkage_high:                  faker.number.float({ min: 90, max: 100 }),
    settlement_high:                 faker.number.float({ min: 90, max: 100 }),
    thermal_conductivity_high:       faker.number.float({ min: 90, max: 100 }),
    thermal_capacity_high:           faker.number.float({ min: 90, max: 100 }),
    vapor_diffusion_resistance_high: faker.number.float({ min: 90, max: 100 }),
    moisture_buffering_high:         faker.number.float({ min: 90, max: 100 }),
    u_high:                          faker.number.float({ min: 90, max: 100 }),
    effusivity_high:                 faker.number.float({ min: 90, max: 100 }),
    diffusivity_high:                faker.number.float({ min: 90, max: 100 }),
    absorption_coefficient_high:     faker.number.float({ min: 90, max: 100 }),
    sound_reduction_index_high:      faker.number.float({ min: 90, max: 100 }),
    reaction_to_fire_high:           faker.number.float({ min: 90, max: 100 }),
    building_material_class_high:    faker.number.float({ min: 90, max: 100 }),
    fire_resistance_class_high:      faker.number.float({ min: 90, max: 100 }),
    air_tightness_high:              faker.number.float({ min: 90, max: 100 }),
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
  ['name', 'images', 'description', ...allPhysicalProperties as ObjectPropertyKeys<typeof naturalResourceSchema>[]],
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
export const naturalResourceQueryProperties = Type.Pick(
  naturalResourceSchema, 
  ['id', 'name', 'description', ...allPhysicalProperties as ObjectPropertyKeys<typeof naturalResourceSchema>[]])
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
