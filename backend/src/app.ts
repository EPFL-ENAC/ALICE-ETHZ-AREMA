// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'

import swagger  from 'feathers-swagger';
import type { FnSwaggerUiGetInitializerScript } from 'feathers-swagger';

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
app.configure(swagger.customMethodsHandler)


const getSwaggerInitializerScript: FnSwaggerUiGetInitializerScript = ({ docsJsonPath, ctx }) => {
  const headers = ctx && ctx.headers;
  const basePath = headers!['x-forwarded-prefix'] ?? '';

  // language=JavaScript
  return `
    window.onload = function () {
      var script = document.createElement('script');
      script.onload = function () {
        window.ui = SwaggerUIBundle({
          url: "${basePath}${docsJsonPath}",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset,
            SwaggerUIApiKeyAuthFormPlugin,
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          configs: {
            apiKeyAuthFormPlugin: {
              forms: {
                BearerAuth: {
                  fields: {
                    email: {
                      type: 'text',
                      label: 'E-Mail-Address',
                    },
                    password: {
                      type: 'password',
                      label: 'Password',
                    },
                  },
                  authCallback(values, callback) {
                    window.ui.fn.fetch({
                      url: '/authentication',
                      method: 'post',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        strategy: 'local',
                        ...values,
                      }),
                    }).then(function (response) {
                      const json = JSON.parse(response.data);
                      if (json.accessToken) {
                        callback(null, json.accessToken);
                      } else {
                        callback('error while login');
                      }
                    }).catch(function (err) {
                      console.log(err, Object.entries(err));
                      callback('error while login');
                    });
                  },
                }
              },
              localStorage: {
                BearerAuth: {}
              }
            }
          }
        });
      };

      script.src = '//cdn.jsdelivr.net/npm/@mairu/swagger-ui-apikey-auth-form@1/dist/swagger-ui-apikey-auth-form.js';
      document.head.appendChild(script)
    };
  `;
};


app.configure(swagger({
  ui: swagger.swaggerUI({ getSwaggerInitializerScript }),
  specs: {
    info: {
      title: 'backend http rest api',
      description: ' swagger documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  
}))
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
//app.configure(channels)

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
  setup: [],
  teardown: []
})

export { app }
