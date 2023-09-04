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
exports.buildingMaterial = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const building_material_schema_1 = require("./building-material.schema");
const building_material_class_1 = require("./building-material.class");
const building_material_shared_1 = require("./building-material.shared");
__exportStar(require("./building-material.class"), exports);
__exportStar(require("./building-material.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const buildingMaterial = (app) => {
    // Register our service on the Feathers application
    app.use(building_material_shared_1.buildingMaterialPath, new building_material_class_1.BuildingMaterialService((0, building_material_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: building_material_shared_1.buildingMaterialMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(building_material_shared_1.buildingMaterialPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(building_material_schema_1.buildingMaterialExternalResolver),
                schema_1.hooks.resolveResult(building_material_schema_1.buildingMaterialResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(building_material_schema_1.buildingMaterialQueryValidator),
                schema_1.hooks.resolveQuery(building_material_schema_1.buildingMaterialQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(building_material_schema_1.buildingMaterialDataValidator),
                schema_1.hooks.resolveData(building_material_schema_1.buildingMaterialDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(building_material_schema_1.buildingMaterialPatchValidator),
                schema_1.hooks.resolveData(building_material_schema_1.buildingMaterialPatchResolver)
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
exports.buildingMaterial = buildingMaterial;
//# sourceMappingURL=building-material.js.map