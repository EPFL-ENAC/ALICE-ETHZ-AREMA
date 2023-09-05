"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
const feathers_1 = require("@feathersjs/feathers");
const configuration_1 = __importDefault(require("@feathersjs/configuration"));
const koa_1 = require("@feathersjs/koa");
const configuration_2 = require("./configuration");
const log_error_1 = require("./hooks/log-error");
const postgresql_1 = require("./postgresql");
const authentication_1 = require("./authentication");
const index_1 = require("./services/index");
const feathers_swagger_1 = __importDefault(require("feathers-swagger"));
const app = (0, koa_1.koa)((0, feathers_1.feathers)());
exports.app = app;
// Load our app configuration (see config/ folder)
app.configure((0, configuration_1.default)(configuration_2.configurationValidator));
// Set up Koa middleware
app.use((0, koa_1.cors)());
app.use((0, koa_1.serveStatic)(app.get('public')));
app.use((0, koa_1.errorHandler)());
app.use((0, koa_1.parseAuthentication)());
app.use((0, koa_1.bodyParser)());
// Configure services and transports
app.configure((0, koa_1.rest)());
app.configure(feathers_swagger_1.default.customMethodsHandler);
const getSwaggerInitializerScript = ({ docsJsonPath, ctx }) => {
    const headers = ctx && ctx.headers;
    const basePath = headers['x-forwarded-prefix'] ?? '';
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
app.configure((0, feathers_swagger_1.default)({
    ui: feathers_swagger_1.default.swaggerUI({ getSwaggerInitializerScript }),
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
}));
app.configure(postgresql_1.postgresql);
app.configure(authentication_1.authentication);
app.configure(index_1.services);
//app.configure(channels)
// Register hooks that run on all service methods
app.hooks({
    around: {
        all: [log_error_1.logError]
    },
    before: {},
    after: {},
    error: {}
});
// Register application setup and teardown hooks here
app.hooks({
    setup: [],
    teardown: []
});
//# sourceMappingURL=app.js.map