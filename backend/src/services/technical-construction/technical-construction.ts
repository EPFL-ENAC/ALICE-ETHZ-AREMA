// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {

  technicalConstructionDataSchema,
  technicalConstructionSchema,
  technicalConstructionPatchSchema,
  technicalConstructionQuerySchema,
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
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { allowAnonymous }  from '../../hooks/allow-anonymous'
import { entityCreated } from '../../hooks/entity-created'
import { timestampsStripping } from '../../hooks/timestamps-stripping'
import { tcBmRelation } from '../../hooks/tc-bm-relation'

export * from './technical-construction.class'
export * from './technical-construction.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const technicalConstruction = (app: Application) => {
  // Register our service on the Feathers application
  app.use(technicalConstructionPath, new TechnicalConstructionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: technicalConstructionMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        technicalConstructionDataSchema,
        technicalConstructionSchema,
        technicalConstructionPatchSchema,
        technicalConstructionQuerySchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['find', 'get', 'patch', 'remove', 'create']
      }
    }),
  })
  // Initialize hooks
  app.service(technicalConstructionPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(technicalConstructionExternalResolver),
        schemaHooks.resolveResult(technicalConstructionResolver)
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
        schemaHooks.validateQuery(technicalConstructionQueryValidator),
        schemaHooks.resolveQuery(technicalConstructionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(technicalConstructionDataValidator),
        entityCreated,
        schemaHooks.resolveData(technicalConstructionDataResolver)
      ],
      patch: [
        timestampsStripping,
        schemaHooks.validateData(technicalConstructionPatchValidator),
        schemaHooks.resolveData(technicalConstructionPatchResolver)
      ],
      remove: [
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
    [technicalConstructionPath]: TechnicalConstructionService
  }
}
