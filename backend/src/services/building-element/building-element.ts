// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingElementDataValidator,
  buildingElementPatchValidator,
  buildingElementQueryValidator,
  buildingElementResolver,
  buildingElementExternalResolver,
  buildingElementDataResolver,
  buildingElementPatchResolver,
  buildingElementQueryResolver
} from './building-element.schema'

import type { Application } from '../../declarations'
import { BuildingElementService, getOptions } from './building-element.class'
import { buildingElementPath, buildingElementMethods } from './building-element.shared'

export * from './building-element.class'
export * from './building-element.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const buildingElement = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingElementPath, new BuildingElementService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingElementMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(buildingElementPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(buildingElementExternalResolver),
        schemaHooks.resolveResult(buildingElementResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(buildingElementQueryValidator),
        schemaHooks.resolveQuery(buildingElementQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingElementDataValidator),
        schemaHooks.resolveData(buildingElementDataResolver)
      ],
      patch: [
        schemaHooks.validateData(buildingElementPatchValidator),
        schemaHooks.resolveData(buildingElementPatchResolver)
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
    [buildingElementPath]: BuildingElementService
  }
}
