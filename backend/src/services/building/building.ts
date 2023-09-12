// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingDataValidator,
  buildingPatchValidator,
  buildingQueryValidator,
  buildingResolver,
  buildingExternalResolver,
  buildingDataResolver,
  buildingPatchResolver,
  buildingQueryResolver,
  buildingDataSchema,
  buildingSchema,
  buildingPatchSchema,
  buildingQuerySchema,
  generateFake,
  buildingProfessionResolver
} from './building.schema'

import type { Application } from '../../declarations'
import { BuildingService, getOptions } from './building.class'
import { buildingPath, buildingMethods } from './building.shared'

import { createSwaggerServiceOptions } from 'feathers-swagger'
import { logger } from '../../logger'
import { HookContext } from '@feathersjs/feathers'
import { getRandomUser } from '../../helpers/getRandomUser'
import { userIterations } from '../users/users'

export * from './building.class'
export * from './building.schema'

export const buildingIterations = 3000
// A configure function that registers the service and its hooks via `app.configure`
export const building = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingPath, new BuildingService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        buildingSchema,
        buildingDataSchema,
        buildingPatchSchema,
        buildingQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['all']
      }
    }),

    createFake: async () => {
      const user = await getRandomUser(app, userIterations)
      const fakeData = await generateFake(user)

      logger.info(`fake building data generated: ${JSON.stringify(fakeData)}`)
      const fakeDataByService = await app.service(buildingPath).create(fakeData, {})
      logger.info(`fake building data generated by service: ${JSON.stringify(fakeDataByService)}`)
      return fakeDataByService
    },
    fakerOptions: {
      iterations: buildingIterations
    }
  })
  // Initialize hooks
  app.service(buildingPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(buildingExternalResolver),
        schemaHooks.resolveResult(buildingResolver, buildingProfessionResolver)
      ],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(buildingQueryValidator),
        schemaHooks.resolveQuery(buildingQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingDataValidator),
        schemaHooks.resolveData(buildingDataResolver)
      ],
      patch: [
        schemaHooks.validateData(buildingPatchValidator),
        schemaHooks.resolveData(buildingPatchResolver)
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
    [buildingPath]: BuildingService
  }
}