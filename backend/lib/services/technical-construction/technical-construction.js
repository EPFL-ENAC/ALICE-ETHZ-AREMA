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
exports.technicalConstruction = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const technical_construction_schema_1 = require("./technical-construction.schema");
const technical_construction_class_1 = require("./technical-construction.class");
const technical_construction_shared_1 = require("./technical-construction.shared");
__exportStar(require("./technical-construction.class"), exports);
__exportStar(require("./technical-construction.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const technicalConstruction = (app) => {
    // Register our service on the Feathers application
    app.use(technical_construction_shared_1.technicalConstructionPath, new technical_construction_class_1.TechnicalConstructionService((0, technical_construction_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: technical_construction_shared_1.technicalConstructionMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(technical_construction_shared_1.technicalConstructionPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(technical_construction_schema_1.technicalConstructionExternalResolver),
                schema_1.hooks.resolveResult(technical_construction_schema_1.technicalConstructionResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(technical_construction_schema_1.technicalConstructionQueryValidator),
                schema_1.hooks.resolveQuery(technical_construction_schema_1.technicalConstructionQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(technical_construction_schema_1.technicalConstructionDataValidator),
                schema_1.hooks.resolveData(technical_construction_schema_1.technicalConstructionDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(technical_construction_schema_1.technicalConstructionPatchValidator),
                schema_1.hooks.resolveData(technical_construction_schema_1.technicalConstructionPatchResolver)
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
exports.technicalConstruction = technicalConstruction;
//# sourceMappingURL=technical-construction.js.map