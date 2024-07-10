// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { ObjectPropertyKeys, Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { allPhysicalProperties, allPhysicalPropertiesSchema } from '../../helpers/physical-properties'

// Main data model schema
export const technicalConstructionSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    images: Type.Array(Type.String()), // url
    description: Type.String(),

    ...allPhysicalPropertiesSchema
  },
  { $id: 'TechnicalConstruction', additionalProperties: false }
)
export type TechnicalConstruction = Static<typeof technicalConstructionSchema>
export const technicalConstructionValidator = getValidator(technicalConstructionSchema, dataValidator)
export const technicalConstructionResolver = resolve<TechnicalConstruction, HookContext>({})

export const technicalConstructionExternalResolver = resolve<TechnicalConstruction, HookContext>({})

// Schema for creating new entries
export const technicalConstructionDataSchema = Type.Pick(
  technicalConstructionSchema, 
  ['name', 'images', 'description', ...allPhysicalProperties as ObjectPropertyKeys<typeof technicalConstructionSchema>[]], 
  {
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
export const technicalConstructionQueryProperties = Type.Pick(
  technicalConstructionSchema, 
  ['id', 'name', 'description', ...allPhysicalProperties as ObjectPropertyKeys<typeof technicalConstructionSchema>[]])
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
