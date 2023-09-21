// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  technicalConstructionDataValidator,
  technicalConstructionPatchValidator,
  technicalConstructionQueryValidator,
  technicalConstructionResolver,
  technicalConstructionExternalResolver,
  technicalConstructionDataResolver,
  technicalConstructionPatchResolver,
  technicalConstructionQueryResolver
} from './technical-construction.schema'

import type { Application } from '../../declarations'
import { TechnicalConstructionService, getOptions } from './technical-construction.class'
import { technicalConstructionPath, technicalConstructionMethods } from './technical-construction.shared'

export * from './technical-construction.class'
export * from './technical-construction.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const technicalConstruction = (app: Application) => {
  // Register our service on the Feathers application
  app.use(technicalConstructionPath, new TechnicalConstructionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: technicalConstructionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(technicalConstructionPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(technicalConstructionExternalResolver),
        schemaHooks.resolveResult(technicalConstructionResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(technicalConstructionQueryValidator),
        schemaHooks.resolveQuery(technicalConstructionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(technicalConstructionDataValidator),
        schemaHooks.resolveData(technicalConstructionDataResolver)
      ],
      patch: [
        schemaHooks.validateData(technicalConstructionPatchValidator),
        schemaHooks.resolveData(technicalConstructionPatchResolver)
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
    [technicalConstructionPath]: TechnicalConstructionService
  }
}
