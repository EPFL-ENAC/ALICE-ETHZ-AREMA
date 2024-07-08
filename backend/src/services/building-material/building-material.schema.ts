// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const buildingMaterialSchema = Type.Object(
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
  { $id: 'BuildingMaterial', additionalProperties: false }
)
export type BuildingMaterial = Static<typeof buildingMaterialSchema>
export const buildingMaterialValidator = getValidator(buildingMaterialSchema, dataValidator)
export const buildingMaterialResolver = resolve<BuildingMaterial, HookContext>({})

export const buildingMaterialExternalResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for creating new entries
export const buildingMaterialDataSchema = Type.Pick(buildingMaterialSchema, ['name', 'images', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'], {
  $id: 'BuildingMaterialData'
})
export type BuildingMaterialData = Static<typeof buildingMaterialDataSchema>
export const buildingMaterialDataValidator = getValidator(buildingMaterialDataSchema, dataValidator)
export const buildingMaterialDataResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for updating existing entries
export const buildingMaterialPatchSchema = Type.Partial(buildingMaterialSchema, {
  $id: 'BuildingMaterialPatch'
})
export type BuildingMaterialPatch = Static<typeof buildingMaterialPatchSchema>
export const buildingMaterialPatchValidator = getValidator(buildingMaterialPatchSchema, dataValidator)
export const buildingMaterialPatchResolver = resolve<BuildingMaterial, HookContext>({})

// Schema for allowed query properties
export const buildingMaterialQueryProperties = Type.Pick(buildingMaterialSchema, ['id', 'name', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance'])
export const buildingMaterialQuerySchema = Type.Intersect(
  [
    querySyntax(buildingMaterialQueryProperties, {
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
export type BuildingMaterialQuery = Static<typeof buildingMaterialQuerySchema>
export const buildingMaterialQueryValidator = getValidator(buildingMaterialQuerySchema, queryValidator)
export const buildingMaterialQueryResolver = resolve<BuildingMaterialQuery, HookContext>({})
