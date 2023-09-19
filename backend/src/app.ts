// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers, getServiceOptions } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { adminSetup } from './hooks/admin-setup'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import swagger from 'feathers-swagger'
import { channels } from './channels'

import { getSwaggerInitializerScript } from './plugins/swaggerInit'
const app: Application = koa(feathers())
// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(socketio({
  cors: {
    origin: app.get('origins')
  }
}))
app.configure(swagger.customMethodsHandler)
app.configure(
  swagger({
    ui: swagger.swaggerUI({ getSwaggerInitializerScript }),
    specs: {
      info: { 
        title: 'backend http rest api',
        description: ' swagger documentation',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      },
      security: [{ BearerAuth: [] }]
    }
  })
)
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [adminSetup],
  teardown: []
})

export { app }
