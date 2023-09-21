import type { FnSwaggerUiGetInitializerScript } from 'feathers-swagger'

export const getSwaggerInitializerScript: FnSwaggerUiGetInitializerScript = ({ docsJsonPath, ctx }) => {
  const headers = ctx && ctx.headers
  const basePath = headers!['x-forwarded-prefix'] ?? ''

  // language=JavaScript
  return `
  var UrlMutatorPlugin = (system) => ({
    rootInjects: {
      setServer: (server) => {
        var jsonSpec = system.getState().toJSON().spec.json;
        var servers = [{url: server}];
        var newJsonSpec = Object.assign({}, jsonSpec, { servers });
        return system.specActions.updateJsonSpec(newJsonSpec);
      }
    }
  });

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
            SwaggerUIBundle.plugins.DownloadUrl,
            UrlMutatorPlugin,
          ],
          // if we want to set the server after the page is loaded, which we don't right now
          // onComplete: () => {
          //   window.ui.setServer("/api")
          // },
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
                      url: '${basePath}/authentication', // we dynamically set basePath on docker container start
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
  `
}
