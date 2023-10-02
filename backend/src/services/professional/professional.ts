// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  professionalDataSchema,
  professionalPatchSchema,
  professionalQuerySchema,
  professionalSchema,
  professionalDataValidator,
  professionalPatchValidator,
  professionalQueryValidator,
  professionalResolver,
  professionalExternalResolver,
  professionalDataResolver,
  professionalPatchResolver,
  professionalQueryResolver,
  generateFake
} from './professional.schema'

import type { Application, HookContext } from '../../declarations'
import { ProfessionalService, getOptions } from './professional.class'
import { professionalPath, professionalMethods } from './professional.shared'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { logger } from '../../logger'
import { getRandomUser } from '../../helpers/getRandomUser'
import { getRandomProfessionalType } from '../../helpers/getRandomProfessionalType'
import { userIterations } from '../users/users'
import { professionalTypeIterations } from '../professional-type/professional-type'
import { entityCreated } from '../../hooks/entity-created'
import { timestampsStripping } from '../../hooks/timestamps-stripping'
import { allowAnonymous }  from '../../hooks/allow-anonymous'

export * from './professional.class'
export * from './professional.schema'

export const professionalIterations = 6000
// A configure function that registers the service and its hooks via `app.configure`
export const professional = (app: Application) => {
  // Register our service on the Feathers application
  app.use(professionalPath, new ProfessionalService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: professionalMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        professionalDataSchema,
        professionalPatchSchema,
        professionalQuerySchema,
        professionalSchema
      },
      docs: {
        // any options for service.docs can be added here
        securities: ['all']
      }
    }),
    createFake: async () => {
      const user = await getRandomUser(app, userIterations)
      const professionalType = await getRandomProfessionalType(app, professionalTypeIterations)
      const fakeData = await generateFake(user, professionalType)

      logger.info(`fake professional data generated: ${JSON.stringify(fakeData)}`)
      const fakeDataCreatedByService = await app.service(professionalPath).create(fakeData, {})
      logger.info(`professional data generated by service: ${JSON.stringify(fakeDataCreatedByService)}`)
      return fakeDataCreatedByService
    },
    fakerOptions: {
      iterations: professionalIterations
    }
  })
  // Initialize hooks
  app.service(professionalPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(professionalExternalResolver),
        schemaHooks.resolveResult(professionalResolver)
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
        schemaHooks.validateQuery(professionalQueryValidator),
        schemaHooks.resolveQuery(professionalQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(professionalDataValidator),
        entityCreated,
        schemaHooks.resolveData(professionalDataResolver)
      ],
      patch: [
        timestampsStripping,
        schemaHooks.validateData(professionalPatchValidator),
        schemaHooks.resolveData(professionalPatchResolver),
        async (context: HookContext) => {
          context.data = {
            ...context.data,
            updatedAt: new Date().toISOString(),
            updatedById: context?.params?.user?.id // it is not passed from client cli
          }
        }
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
