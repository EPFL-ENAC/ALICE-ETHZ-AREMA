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
  },
  { $id: 'TechnicalConstruction', additionalProperties: false }
)
export type TechnicalConstruction = Static<typeof technicalConstructionSchema>
export const technicalConstructionValidator = getValidator(technicalConstructionSchema, dataValidator)
export const technicalConstructionResolver = resolve<TechnicalConstruction, HookContext>({})

export const technicalConstructionExternalResolver = resolve<TechnicalConstruction, HookContext>({})

// Schema for creating new entries
export const technicalConstructionDataSchema = Type.Pick(technicalConstructionSchema, ['name', 'images', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'], {
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
export const technicalConstructionQueryProperties = Type.Pick(technicalConstructionSchema, ['id', 'name', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'])
export const technicalConstructionQuerySchema = Type.Intersect(
  [
    querySyntax(technicalConstructionQueryProperties, {
      name: {
        $ilike: Type.String()
      },
      description: {
        $ilike: Type.String()
      }
    }),
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
