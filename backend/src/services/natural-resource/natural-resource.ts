// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  naturalResourceDataValidator,
  naturalResourcePatchValidator,
  naturalResourceQueryValidator,
  naturalResourceResolver,
  naturalResourceExternalResolver,
  naturalResourceDataResolver,
  naturalResourcePatchResolver,
  naturalResourceQueryResolver,
  naturalResourceDataSchema,
  naturalResourceSchema,
  naturalResourcePatchSchema,
  naturalResourceQuerySchema,
  generateFake
} from './natural-resource.schema'

import type { Application, HookContext } from '../../declarations'
import { NaturalResourceService, getOptions } from './natural-resource.class'
import { naturalResourcePath, naturalResourceMethods } from './natural-resource.shared'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { logger } from '../../logger'
import { getRandomUser } from '../../helpers/getRandomUser'
import { userIterations } from '../users/users'
import { allowAnonymous }  from '../../hooks/allow-anonymous'
import { entityCreated } from '../../hooks/entity-created'

export * from './natural-resource.class'
export * from './natural-resource.schema'

export const naturalResourceIterations = 3000
// A configure function that registers the service and its hooks via `app.configure`
export const naturalResource = (app: Application) => {
  // Register our service on the Feathers application
  app.use(naturalResourcePath, new NaturalResourceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: naturalResourceMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        naturalResourceDataSchema,
        naturalResourceSchema,
        naturalResourcePatchSchema,
        naturalResourceQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['find', 'get', 'patch', 'remove', 'create']
      }
    }),
    createFake: async () => {
      const user = await getRandomUser(app, userIterations)
      const fakeData = await generateFake(user)

      logger.info(`fake data generated natural-resource: ${JSON.stringify(fakeData)}`)
      const fakeDataCreatedByService = await app.service(naturalResourcePath).create(fakeData, {})
      logger.info(`data generated by service natural-resource: ${JSON.stringify(fakeDataCreatedByService)}`)
      return fakeDataCreatedByService
    },
    fakerOptions: {
      iterations: naturalResourceIterations
    }
  })
  // Initialize hooks
  app.service(naturalResourcePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(naturalResourceExternalResolver),
        schemaHooks.resolveResult(naturalResourceResolver)
      ],
      find: [allowAnonymous, authenticate('jwt', 'anonymous')],
      get: [allowAnonymous, authenticate('jwt', 'anonymous')],
      create: [authenticate('jwt'),],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(naturalResourceQueryValidator),
        schemaHooks.resolveQuery(naturalResourceQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(naturalResourceDataValidator),
        entityCreated,
        schemaHooks.resolveData(naturalResourceDataResolver)
      ],
      patch: [
        schemaHooks.validateData(naturalResourcePatchValidator),
        schemaHooks.resolveData(naturalResourcePatchResolver)
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
    [naturalResourcePath]: NaturalResourceService
  }
}
