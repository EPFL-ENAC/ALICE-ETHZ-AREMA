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
exports.professional = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const professional_schema_1 = require("./professional.schema");
const professional_class_1 = require("./professional.class");
const professional_shared_1 = require("./professional.shared");
__exportStar(require("./professional.class"), exports);
__exportStar(require("./professional.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const professional = (app) => {
    // Register our service on the Feathers application
    app.use(professional_shared_1.professionalPath, new professional_class_1.ProfessionalService((0, professional_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: professional_shared_1.professionalMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(professional_shared_1.professionalPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(professional_schema_1.professionalExternalResolver),
                schema_1.hooks.resolveResult(professional_schema_1.professionalResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(professional_schema_1.professionalQueryValidator),
                schema_1.hooks.resolveQuery(professional_schema_1.professionalQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(professional_schema_1.professionalDataValidator),
                schema_1.hooks.resolveData(professional_schema_1.professionalDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(professional_schema_1.professionalPatchValidator),
                schema_1.hooks.resolveData(professional_schema_1.professionalPatchResolver)
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
exports.professional = professional;
//# sourceMappingURL=professional.js.map