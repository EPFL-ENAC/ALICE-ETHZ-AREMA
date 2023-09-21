// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const buildingElementSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'BuildingElement', additionalProperties: false }
)
export type BuildingElement = Static<typeof buildingElementSchema>
export const buildingElementValidator = getValidator(buildingElementSchema, dataValidator)
export const buildingElementResolver = resolve<BuildingElement, HookContext>({})

export const buildingElementExternalResolver = resolve<BuildingElement, HookContext>({})

// Schema for creating new entries
export const buildingElementDataSchema = Type.Pick(buildingElementSchema, ['text'], {
  $id: 'BuildingElementData'
})
export type BuildingElementData = Static<typeof buildingElementDataSchema>
export const buildingElementDataValidator = getValidator(buildingElementDataSchema, dataValidator)
export const buildingElementDataResolver = resolve<BuildingElement, HookContext>({})

// Schema for updating existing entries
export const buildingElementPatchSchema = Type.Partial(buildingElementSchema, {
  $id: 'BuildingElementPatch'
})
export type BuildingElementPatch = Static<typeof buildingElementPatchSchema>
export const buildingElementPatchValidator = getValidator(buildingElementPatchSchema, dataValidator)
export const buildingElementPatchResolver = resolve<BuildingElement, HookContext>({})

// Schema for allowed query properties
export const buildingElementQueryProperties = Type.Pick(buildingElementSchema, ['id', 'text'])
export const buildingElementQuerySchema = Type.Intersect(
  [
    querySyntax(buildingElementQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BuildingElementQuery = Static<typeof buildingElementQuerySchema>
export const buildingElementQueryValidator = getValidator(buildingElementQuerySchema, queryValidator)
export const buildingElementQueryResolver = resolve<BuildingElementQuery, HookContext>({})
