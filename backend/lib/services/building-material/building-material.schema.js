"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingMaterialQueryResolver = exports.buildingMaterialQueryValidator = exports.buildingMaterialQuerySchema = exports.buildingMaterialQueryProperties = exports.buildingMaterialPatchResolver = exports.buildingMaterialPatchValidator = exports.buildingMaterialPatchSchema = exports.buildingMaterialDataResolver = exports.buildingMaterialDataValidator = exports.buildingMaterialDataSchema = exports.buildingMaterialExternalResolver = exports.buildingMaterialResolver = exports.buildingMaterialValidator = exports.buildingMaterialSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.buildingMaterialSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    text: typebox_1.Type.String()
}, { $id: 'BuildingMaterial', additionalProperties: false });
exports.buildingMaterialValidator = (0, typebox_1.getValidator)(exports.buildingMaterialSchema, validators_1.dataValidator);
exports.buildingMaterialResolver = (0, schema_1.resolve)({});
exports.buildingMaterialExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.buildingMaterialDataSchema = typebox_1.Type.Pick(exports.buildingMaterialSchema, ['text'], {
    $id: 'BuildingMaterialData'
});
exports.buildingMaterialDataValidator = (0, typebox_1.getValidator)(exports.buildingMaterialDataSchema, validators_1.dataValidator);
exports.buildingMaterialDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.buildingMaterialPatchSchema = typebox_1.Type.Partial(exports.buildingMaterialSchema, {
    $id: 'BuildingMaterialPatch'
});
exports.buildingMaterialPatchValidator = (0, typebox_1.getValidator)(exports.buildingMaterialPatchSchema, validators_1.dataValidator);
exports.buildingMaterialPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.buildingMaterialQueryProperties = typebox_1.Type.Pick(exports.buildingMaterialSchema, ['id', 'text']);
exports.buildingMaterialQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.buildingMaterialQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.buildingMaterialQueryValidator = (0, typebox_1.getValidator)(exports.buildingMaterialQuerySchema, validators_1.queryValidator);
exports.buildingMaterialQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=building-material.schema.js.map