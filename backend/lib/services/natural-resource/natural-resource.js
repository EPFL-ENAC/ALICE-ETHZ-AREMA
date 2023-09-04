"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalResource = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const natural_resource_schema_1 = require("./natural-resource.schema");
const natural_resource_class_1 = require("./natural-resource.class");
const natural_resource_shared_1 = require("./natural-resource.shared");
const feathers_swagger_1 = require("feathers-swagger");
__exportStar(require("./natural-resource.class"), exports);
__exportStar(require("./natural-resource.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const naturalResource = (app) => {
    // Register our service on the Feathers application
    app.use(natural_resource_shared_1.naturalResourcePath, new natural_resource_class_1.NaturalResourceService((0, natural_resource_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: natural_resource_shared_1.naturalResourceMethods,
        // You can add additional custom events to be sent to clients here
        events: [],
        docs: (0, feathers_swagger_1.createSwaggerServiceOptions)({
            schemas: { naturalResourceDataSchema: natural_resource_schema_1.naturalResourceDataSchema,
                naturalResourceSchema: natural_resource_schema_1.naturalResourceSchema,
                naturalResourcePatchSchema: natural_resource_schema_1.naturalResourcePatchSchema,
                naturalResourceQuerySchema: natural_resource_schema_1.naturalResourceQuerySchema },
            docs: {
                // any options for service.docs can be added here
                securities: ['find', 'get', 'patch', 'remove'],
            }
        }),
    });
    // Initialize hooks
    app.service(natural_resource_shared_1.naturalResourcePath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(natural_resource_schema_1.naturalResourceExternalResolver),
                schema_1.hooks.resolveResult(natural_resource_schema_1.naturalResourceResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(natural_resource_schema_1.naturalResourceQueryValidator),
                schema_1.hooks.resolveQuery(natural_resource_schema_1.naturalResourceQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(natural_resource_schema_1.naturalResourceDataValidator),
                schema_1.hooks.resolveData(natural_resource_schema_1.naturalResourceDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(natural_resource_schema_1.naturalResourcePatchValidator),
                schema_1.hooks.resolveData(natural_resource_schema_1.naturalResourcePatchResolver)
            ],
            remove: []
        },
        after: {
            all: []
        },
        error: {
            all: []
        }
    });
};
exports.naturalResource = naturalResource;
//# sourceMappingURL=natural-resource.js.map