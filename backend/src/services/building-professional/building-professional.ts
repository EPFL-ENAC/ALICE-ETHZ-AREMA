// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingProfessionalDataValidator,
  buildingProfessionalPatchValidator,
  buildingProfessionalQueryValidator,
  buildingProfessionalResolver,
  buildingProfessionalExternalResolver,
  buildingProfessionalDataResolver,
  buildingProfessionalPatchResolver,
  buildingProfessionalQueryResolver
} from './building-professional.schema'

import type { Application } from '../../declarations'
import { BuildingProfessionalService, getOptions } from './building-professional.class'
import { buildingProfessionalPath, buildingProfessionalMethods } from './building-professional.shared'

export * from './building-professional.class'
export * from './building-professional.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const buildingProfessional = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingProfessionalPath, new BuildingProfessionalService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingProfessionalMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(buildingProfessionalPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(buildingProfessionalExternalResolver),
        schemaHooks.resolveResult(buildingProfessionalResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(buildingProfessionalQueryValidator),
        schemaHooks.resolveQuery(buildingProfessionalQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingProfessionalDataValidator),
        schemaHooks.resolveData(buildingProfessionalDataResolver)
      ],
      patch: [
        schemaHooks.validateData(buildingProfessionalPatchValidator),
        schemaHooks.resolveData(buildingProfessionalPatchResolver)
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
    [buildingProfessionalPath]: BuildingProfessionalService
  }
}
