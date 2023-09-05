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
  naturalResourceQuerySchema
} from './natural-resource.schema'

import type { Application } from '../../declarations'
import { NaturalResourceService, getOptions } from './natural-resource.class'
import { naturalResourcePath, naturalResourceMethods } from './natural-resource.shared'
import { createSwaggerServiceOptions } from 'feathers-swagger';

export * from './natural-resource.class'
export * from './natural-resource.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const naturalResource = (app: Application) => {
  // Register our service on the Feathers application
  app.use(naturalResourcePath, new NaturalResourceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: naturalResourceMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {   naturalResourceDataSchema,
        naturalResourceSchema,
        naturalResourcePatchSchema,
        naturalResourceQuerySchema },
      docs: {
          // any options for service.docs can be added here
          securities: ['all'],
      }
  }),
  })
  // Initialize hooks
  app.service(naturalResourcePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(naturalResourceExternalResolver),
        schemaHooks.resolveResult(naturalResourceResolver)
      ]
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
