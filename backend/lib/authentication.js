"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
const authentication_1 = require("@feathersjs/authentication");
const authentication_local_1 = require("@feathersjs/authentication-local");
class AuthenticationServiceWithDocs extends authentication_1.AuthenticationService {
}
const authentication = (app) => {
    const authentication = new AuthenticationServiceWithDocs(app);
    // /* disable eslint for this block */
    authentication.docs = {
        idNames: {
            remove: 'accessToken',
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
                    password: { type: 'string' },
                },
            },
            authResult: {
                type: 'object',
                properties: {
                    accessToken: { type: 'string' },
                    authentication: {
                        type: 'object',
                        properties: {
                            strategy: { type: 'string' },
                        },
                    },
                    payload: {
                        type: 'object',
                        properties: {}, // TODO
                    },
                    user: { $ref: '#/components/schemas/User' },
                },
            },
        },
        refs: {
            createRequest: 'authRequest',
            createResponse: 'authResult',
            removeResponse: 'authResult',
            removeMultiResponse: 'authResult',
        },
        operations: {
            remove: {
                description: 'Logout the currently logged in user',
                'parameters[0].description': 'accessToken of the currently logged in user',
            },
            removeMulti: {
                description: 'Logout the currently logged in user',
                parameters: [],
            },
        },
    };
    authentication.register('jwt', new authentication_1.JWTStrategy());
    authentication.register('local', new authentication_local_1.LocalStrategy());
    app.use('authentication', authentication);
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map