// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  buildingMaterialDataSchema,
  buildingMaterialSchema,
  buildingMaterialPatchSchema,
  buildingMaterialQuerySchema,
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
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { allowAnonymous }  from '../../hooks/allow-anonymous'
import { entityCreated } from '../../hooks/entity-created'
import { timestampsStripping } from '../../hooks/timestamps-stripping'
import { bmNrRelation } from '../../hooks/bm-nr-relation'
import { tcBmRelation } from '../../hooks/tc-bm-relation'

export * from './building-material.class'
export * from './building-material.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const buildingMaterial = (app: Application) => {
  // Register our service on the Feathers application
  app.use(buildingMaterialPath, new BuildingMaterialService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: buildingMaterialMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        buildingMaterialDataSchema,
        buildingMaterialSchema,
        buildingMaterialPatchSchema,
        buildingMaterialQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['find', 'get', 'patch', 'remove', 'create']
      }
    }),
  })
  // Initialize hooks
  app.service(buildingMaterialPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(buildingMaterialExternalResolver),
        schemaHooks.resolveResult(buildingMaterialResolver)
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
        schemaHooks.validateQuery(buildingMaterialQueryValidator),
        schemaHooks.resolveQuery(buildingMaterialQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(buildingMaterialDataValidator),
        entityCreated,
        schemaHooks.resolveData(buildingMaterialDataResolver)
      ],
      patch: [
        timestampsStripping,
        schemaHooks.validateData(buildingMaterialPatchValidator),
        schemaHooks.resolveData(buildingMaterialPatchResolver)
      ],
      remove: [
        bmNrRelation,
        tcBmRelation
      ]
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
