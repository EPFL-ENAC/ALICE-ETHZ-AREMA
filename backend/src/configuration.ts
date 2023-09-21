import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    clusterCount: Type.Number(),
    host: Type.String(),
    port: Type.Number(),
    basePath: Type.String(), // we use basePath only for docs right now (for dev/prod platform)
    public: Type.String(),
    administratorEmail: Type.String(),
    administratorPassword: Type.String()
  })
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)
