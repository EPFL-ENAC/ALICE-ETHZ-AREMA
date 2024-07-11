// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  technicalConstructionBuildingMaterialDataSchema,
  technicalConstructionBuildingMaterialSchema,
  technicalConstructionBuildingMaterialPatchSchema,
  technicalConstructionBuildingMaterialQuerySchema,
  technicalConstructionBuildingMaterialDataValidator,
  technicalConstructionBuildingMaterialPatchValidator,
  technicalConstructionBuildingMaterialQueryValidator,
  technicalConstructionBuildingMaterialResolver,
  technicalConstructionBuildingMaterialExternalResolver,
  technicalConstructionBuildingMaterialDataResolver,
  technicalConstructionBuildingMaterialPatchResolver,
  technicalConstructionBuildingMaterialQueryResolver
} from './technical-construction-building-material.schema'

import type { Application } from '../../declarations'
import {
  TechnicalConstructionBuildingMaterialService,
  getOptions
} from './technical-construction-building-material.class'
import {
  technicalConstructionBuildingMaterialPath,
  technicalConstructionBuildingMaterialMethods
} from './technical-construction-building-material.shared'

import { createSwaggerServiceOptions } from 'feathers-swagger'
import { allowAnonymous }  from '../../hooks/allow-anonymous'

export * from './technical-construction-building-material.class'
export * from './technical-construction-building-material.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const technicalConstructionBuildingMaterial = (app: Application) => {
  // Register our service on the Feathers application
  app.use(
    technicalConstructionBuildingMaterialPath,
    new TechnicalConstructionBuildingMaterialService(getOptions(app)),
    {
      // A list of all methods this service exposes externally
      methods: technicalConstructionBuildingMaterialMethods,
      // You can add additional custom events to be sent to clients here
      events: [],
      docs: createSwaggerServiceOptions({
        schemas: {
          technicalConstructionBuildingMaterialDataSchema,
          technicalConstructionBuildingMaterialSchema,
          technicalConstructionBuildingMaterialPatchSchema,
          technicalConstructionBuildingMaterialQuerySchema
        },
        docs: {
          // any options for service.docs can be added here
          securities: ['find', 'get', 'patch', 'remove', 'create']
        }
      }),
    }
  )
  // Initialize hooks
  app.service(technicalConstructionBuildingMaterialPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(technicalConstructionBuildingMaterialExternalResolver),
        schemaHooks.resolveResult(technicalConstructionBuildingMaterialResolver)
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
        schemaHooks.validateQuery(technicalConstructionBuildingMaterialQueryValidator),
        schemaHooks.resolveQuery(technicalConstructionBuildingMaterialQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(technicalConstructionBuildingMaterialDataValidator),
        schemaHooks.resolveData(technicalConstructionBuildingMaterialDataResolver)
      ],
      patch: [
        schemaHooks.validateData(technicalConstructionBuildingMaterialPatchValidator),
        schemaHooks.resolveData(technicalConstructionBuildingMaterialPatchResolver)
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
    [technicalConstructionBuildingMaterialPath]: TechnicalConstructionBuildingMaterialService
  }
}
