// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  professionalTypeDataSchema,
  professionalTypePatchSchema,
  professionalTypeQuerySchema,
  professionalTypeSchema,
  professionalTypeDataValidator,
  professionalTypePatchValidator,
  professionalTypeQueryValidator,
  professionalTypeResolver,
  professionalTypeExternalResolver,
  professionalTypeDataResolver,
  professionalTypePatchResolver,
  professionalTypeQueryResolver,
  generateFake,
  defaultProfessionalTypes
} from './professional-type.schema'

import type { Application } from '../../declarations'
import { ProfessionalTypeService, getOptions } from './professional-type.class'
import { professionalTypePath, professionalTypeMethods } from './professional-type.shared'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { logger } from '../../logger'
import { getRandomUser } from '../../helpers/getRandomUser'
import { userIterations } from '../users/users'
import { entityCreated } from '../../hooks/entity-created'

export * from './professional-type.class'
export * from './professional-type.schema'

export const professionalTypeIterations = defaultProfessionalTypes.length
// A configure function that registers the service and its hooks via `app.configure`
export const professionalType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(professionalTypePath, new ProfessionalTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: professionalTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        professionalTypeDataSchema,
        professionalTypePatchSchema,
        professionalTypeQuerySchema,
        professionalTypeSchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['all']
      }
    }),
    createFake: async () => {
      const user = await getRandomUser(app, userIterations)
      const fakeData = await generateFake(user)

      logger.info(`fake professional-type data generated: ${JSON.stringify(fakeData)}`)
      const fakeDataCreatedByService = await app.service(professionalTypePath).create(fakeData, {})
      logger.info(`professional-type data generated by service: ${JSON.stringify(fakeDataCreatedByService)}`)
      return fakeDataCreatedByService
    }
  })
  // Initialize hooks
  app.service(professionalTypePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(professionalTypeExternalResolver),
        schemaHooks.resolveResult(professionalTypeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(professionalTypeQueryValidator),
        schemaHooks.resolveQuery(professionalTypeQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(professionalTypeDataValidator),
        entityCreated,
        schemaHooks.resolveData(professionalTypeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(professionalTypePatchValidator),
        schemaHooks.resolveData(professionalTypePatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [professionalTypePath]: ProfessionalTypeService
  }
}
