// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  professionalDataValidator,
  professionalPatchValidator,
  professionalQueryValidator,
  professionalResolver,
  professionalExternalResolver,
  professionalDataResolver,
  professionalPatchResolver,
  professionalQueryResolver
} from './professional.schema'

import type { Application } from '../../declarations'
import { ProfessionalService, getOptions } from './professional.class'
import { professionalPath, professionalMethods } from './professional.shared'

export * from './professional.class'
export * from './professional.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const professional = (app: Application) => {
  // Register our service on the Feathers application
  app.use(professionalPath, new ProfessionalService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: professionalMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(professionalPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(professionalExternalResolver),
        schemaHooks.resolveResult(professionalResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(professionalQueryValidator),
        schemaHooks.resolveQuery(professionalQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(professionalDataValidator),
        schemaHooks.resolveData(professionalDataResolver)
      ],
      patch: [
        schemaHooks.validateData(professionalPatchValidator),
        schemaHooks.resolveData(professionalPatchResolver)
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
    [professionalPath]: ProfessionalService
  }
}
