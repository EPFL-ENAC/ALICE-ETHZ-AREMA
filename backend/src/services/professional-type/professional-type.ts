// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  professionalTypeDataValidator,
  professionalTypePatchValidator,
  professionalTypeQueryValidator,
  professionalTypeResolver,
  professionalTypeExternalResolver,
  professionalTypeDataResolver,
  professionalTypePatchResolver,
  professionalTypeQueryResolver
} from './professional-type.schema'

import type { Application } from '../../declarations'
import { ProfessionalTypeService, getOptions } from './professional-type.class'
import { professionalTypePath, professionalTypeMethods } from './professional-type.shared'

export * from './professional-type.class'
export * from './professional-type.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const professionalType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(professionalTypePath, new ProfessionalTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: professionalTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
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
