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
exports.buildingElement = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const building_element_schema_1 = require("./building-element.schema");
const building_element_class_1 = require("./building-element.class");
const building_element_shared_1 = require("./building-element.shared");
__exportStar(require("./building-element.class"), exports);
__exportStar(require("./building-element.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const buildingElement = (app) => {
    // Register our service on the Feathers application
    app.use(building_element_shared_1.buildingElementPath, new building_element_class_1.BuildingElementService((0, building_element_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: building_element_shared_1.buildingElementMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(building_element_shared_1.buildingElementPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(building_element_schema_1.buildingElementExternalResolver),
                schema_1.hooks.resolveResult(building_element_schema_1.buildingElementResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(building_element_schema_1.buildingElementQueryValidator),
                schema_1.hooks.resolveQuery(building_element_schema_1.buildingElementQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(building_element_schema_1.buildingElementDataValidator),
                schema_1.hooks.resolveData(building_element_schema_1.buildingElementDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(building_element_schema_1.buildingElementPatchValidator),
                schema_1.hooks.resolveData(building_element_schema_1.buildingElementPatchResolver)
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
exports.buildingElement = buildingElement;
//# sourceMappingURL=building-element.js.map