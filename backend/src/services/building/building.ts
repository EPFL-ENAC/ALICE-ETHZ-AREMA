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
  buildingQuerySchema
} from './building.schema'

import type { Application } from '../../declarations'
import { BuildingService, getOptions } from './building.class'
import { buildingPath, buildingMethods } from './building.shared'

import { createSwaggerServiceOptions } from 'feathers-swagger'

export * from './building.class'
export * from './building.schema'

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
        buildingDataSchema,
        buildingSchema,
        buildingPatchSchema,
        buildingQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['all']
      }
    })
  })
  // Initialize hooks
  app.service(buildingPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(buildingExternalResolver),
        schemaHooks.resolveResult(buildingResolver)
      ]
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
