// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { userSchema } from '../users/users.schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const naturalResourceSchema = Type.Object(
  {
    id: Type.Number(),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createAt: Type.String({ format: 'date-time' }),
    updatedById: Type.Optional(Type.Number()),
    updatedByUser: Type.Ref(userSchema),
    createdById: Type.Number(),
    createdByUser: Type.Ref(userSchema),
    name: Type.String(),
    zone: Type.String(), // "wsg84",
    dimension: Type.String(),
    amount: Type.Number(),
    images: Type.Array(Type.String()), // url
    description: Type.String()
  },
  { $id: 'NaturalResource', additionalProperties: false }
)
export type NaturalResource = Static<typeof naturalResourceSchema>
export const naturalResourceValidator = getValidator(naturalResourceSchema, dataValidator)
export const naturalResourceResolver = resolve<NaturalResource, HookContext>({})

export const naturalResourceExternalResolver = resolve<NaturalResource, HookContext>({})

// Schema for creating new entries
export const naturalResourceDataSchema = Type.Pick(
  naturalResourceSchema,
  ['name', 'zone', 'dimension', 'amount', 'images', 'description'],
  {
    $id: 'NaturalResourceData'
  }
)
export type NaturalResourceData = Static<typeof naturalResourceDataSchema>
export const naturalResourceDataValidator = getValidator(naturalResourceDataSchema, dataValidator)
export const naturalResourceDataResolver = resolve<NaturalResource, HookContext>({
  createdByUser: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(message.createdById)
  }),
  updatedByUser: virtual(async (message, context) => {
    // Associate the user that sent the message
    if (message.updatedById) {
      return context.app.service('users').get(message.updatedById)
    }
  })
})

// Schema for updating existing entries
export const naturalResourcePatchSchema = Type.Partial(naturalResourceSchema, {
  $id: 'NaturalResourcePatch'
})
export type NaturalResourcePatch = Static<typeof naturalResourcePatchSchema>
export const naturalResourcePatchValidator = getValidator(naturalResourcePatchSchema, dataValidator)
export const naturalResourcePatchResolver = resolve<NaturalResource, HookContext>({})

// Schema for allowed query properties
export const naturalResourceQueryProperties = Type.Pick(naturalResourceSchema, ['id', 'description'])
export const naturalResourceQuerySchema = Type.Intersect(
  [
    querySyntax(naturalResourceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type NaturalResourceQuery = Static<typeof naturalResourceQuerySchema>
export const naturalResourceQueryValidator = getValidator(naturalResourceQuerySchema, queryValidator)
export const naturalResourceQueryResolver = resolve<NaturalResourceQuery, HookContext>({})
