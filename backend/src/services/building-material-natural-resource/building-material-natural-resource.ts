// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingMaterialNaturalResourceDataSchema,
  buildingMaterialNaturalResourceSchema,
  buildingMaterialNaturalResourcePatchSchema,
  buildingMaterialNaturalResourceQuerySchema,
  buildingMaterialNaturalResourceDataValidator,
  buildingMaterialNaturalResourcePatchValidator,
  buildingMaterialNaturalResourceQueryValidator,
  buildingMaterialNaturalResourceResolver,
  buildingMaterialNaturalResourceExternalResolver,
  buildingMaterialNaturalResourceDataResolver,
  buildingMaterialNaturalResourcePatchResolver,
  buildingMaterialNaturalResourceQueryResolver
} from './building-material-natural-resource.schema'

import type { Application } from '../../declarations'
import {
  BuildingMaterialNaturalResourceService,
  getOptions
} from './building-material-natural-resource.class'
import {
  buildingMaterialNaturalResourcePath,
  buildingMaterialNaturalResourceMethods
} from './building-material-natural-resource.shared'

import { createSwaggerServiceOptions } from 'feathers-swagger'
import { allowAnonymous }  from '../../hooks/allow-anonymous'

export * from './building-material-natural-resource.class'
export * from './building-material-natural-resource.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const buildingMaterialNaturalResource = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingMaterialNaturalResourcePath, new BuildingMaterialNaturalResourceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingMaterialNaturalResourceMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        buildingMaterialNaturalResourceDataSchema,
        buildingMaterialNaturalResourceSchema,
        buildingMaterialNaturalResourcePatchSchema,
        buildingMaterialNaturalResourceQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['find', 'get', 'patch', 'remove', 'create']
      }
    }),
  })
  // Initialize hooks
  app.service(buildingMaterialNaturalResourcePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(buildingMaterialNaturalResourceExternalResolver),
        schemaHooks.resolveResult(buildingMaterialNaturalResourceResolver)
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
        schemaHooks.validateQuery(buildingMaterialNaturalResourceQueryValidator),
        schemaHooks.resolveQuery(buildingMaterialNaturalResourceQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingMaterialNaturalResourceDataValidator),
        schemaHooks.resolveData(buildingMaterialNaturalResourceDataResolver)
      ],
      patch: [
        schemaHooks.validateData(buildingMaterialNaturalResourcePatchValidator),
        schemaHooks.resolveData(buildingMaterialNaturalResourcePatchResolver)
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
    [buildingMaterialNaturalResourcePath]: BuildingMaterialNaturalResourceService
  }
}
