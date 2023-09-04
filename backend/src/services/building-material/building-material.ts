// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingMaterialDataValidator,
  buildingMaterialPatchValidator,
  buildingMaterialQueryValidator,
  buildingMaterialResolver,
  buildingMaterialExternalResolver,
  buildingMaterialDataResolver,
  buildingMaterialPatchResolver,
  buildingMaterialQueryResolver
} from './building-material.schema'

import type { Application } from '../../declarations'
import { BuildingMaterialService, getOptions } from './building-material.class'
import { buildingMaterialPath, buildingMaterialMethods } from './building-material.shared'

export * from './building-material.class'
export * from './building-material.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const buildingMaterial = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingMaterialPath, new BuildingMaterialService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingMaterialMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(buildingMaterialPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(buildingMaterialExternalResolver),
        schemaHooks.resolveResult(buildingMaterialResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(buildingMaterialQueryValidator),
        schemaHooks.resolveQuery(buildingMaterialQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingMaterialDataValidator),
        schemaHooks.resolveData(buildingMaterialDataResolver)
      ],
      patch: [
        schemaHooks.validateData(buildingMaterialPatchValidator),
        schemaHooks.resolveData(buildingMaterialPatchResolver)
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
    [buildingMaterialPath]: BuildingMaterialService
  }
}
