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
exports.professionalType = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const professional_type_schema_1 = require("./professional-type.schema");
const professional_type_class_1 = require("./professional-type.class");
const professional_type_shared_1 = require("./professional-type.shared");
__exportStar(require("./professional-type.class"), exports);
__exportStar(require("./professional-type.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const professionalType = (app) => {
    // Register our service on the Feathers application
    app.use(professional_type_shared_1.professionalTypePath, new professional_type_class_1.ProfessionalTypeService((0, professional_type_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: professional_type_shared_1.professionalTypeMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(professional_type_shared_1.professionalTypePath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(professional_type_schema_1.professionalTypeExternalResolver),
                schema_1.hooks.resolveResult(professional_type_schema_1.professionalTypeResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(professional_type_schema_1.professionalTypeQueryValidator),
                schema_1.hooks.resolveQuery(professional_type_schema_1.professionalTypeQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(professional_type_schema_1.professionalTypeDataValidator),
                schema_1.hooks.resolveData(professional_type_schema_1.professionalTypeDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(professional_type_schema_1.professionalTypePatchValidator),
                schema_1.hooks.resolveData(professional_type_schema_1.professionalTypePatchResolver)
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
exports.professionalType = professionalType;
//# sourceMappingURL=professional-type.js.map