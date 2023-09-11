// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationBaseStrategy, AuthenticationResult, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { ServiceSwaggerOptions } from 'feathers-swagger'

import type { Application } from './declarations'
import { Params } from '@feathersjs/feathers'

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication: AuthenticationResult, params: Params) {
    return {
      anonymous: true
    }
  }
}


class AuthenticationServiceWithDocs extends AuthenticationService {
  docs: ServiceSwaggerOptions | undefined
}

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationServiceWithDocs(app)

  // /* disable eslint for this block */
  authentication.docs = {
    idNames: {
      remove: 'accessToken'
    },
    idType: 'string',
    securities: ['remove', 'removeMulti'],
    multi: ['remove'],
    schemas: {
      authRequest: {
        type: 'object',
        properties: {
          strategy: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      authResult: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          authentication: {
            type: 'object',
            properties: {
              strategy: { type: 'string' }
            }
          },
          payload: {
            type: 'object',
            properties: {} // TODO
          },
          user: { $ref: '#/components/schemas/User' }
        }
      }
    },
    refs: {
      createRequest: 'authRequest',
      createResponse: 'authResult',
      removeResponse: 'authResult',
      removeMultiResponse: 'authResult'
    },
    operations: {
      remove: {
        description: 'Logout the currently logged in user',
        'parameters[0].description': 'accessToken of the currently logged in user'
      },
      removeMulti: {
        description: 'Logout the currently logged in user',
        parameters: []
      }
    }
  }

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('anonymous', new AnonymousStrategy())
  app.use('authentication', authentication)
}
