"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingElementQueryResolver = exports.buildingElementQueryValidator = exports.buildingElementQuerySchema = exports.buildingElementQueryProperties = exports.buildingElementPatchResolver = exports.buildingElementPatchValidator = exports.buildingElementPatchSchema = exports.buildingElementDataResolver = exports.buildingElementDataValidator = exports.buildingElementDataSchema = exports.buildingElementExternalResolver = exports.buildingElementResolver = exports.buildingElementValidator = exports.buildingElementSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.buildingElementSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    text: typebox_1.Type.String()
}, { $id: 'BuildingElement', additionalProperties: false });
exports.buildingElementValidator = (0, typebox_1.getValidator)(exports.buildingElementSchema, validators_1.dataValidator);
exports.buildingElementResolver = (0, schema_1.resolve)({});
exports.buildingElementExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.buildingElementDataSchema = typebox_1.Type.Pick(exports.buildingElementSchema, ['text'], {
    $id: 'BuildingElementData'
});
exports.buildingElementDataValidator = (0, typebox_1.getValidator)(exports.buildingElementDataSchema, validators_1.dataValidator);
exports.buildingElementDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.buildingElementPatchSchema = typebox_1.Type.Partial(exports.buildingElementSchema, {
    $id: 'BuildingElementPatch'
});
exports.buildingElementPatchValidator = (0, typebox_1.getValidator)(exports.buildingElementPatchSchema, validators_1.dataValidator);
exports.buildingElementPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.buildingElementQueryProperties = typebox_1.Type.Pick(exports.buildingElementSchema, ['id', 'text']);
exports.buildingElementQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.buildingElementQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.buildingElementQueryValidator = (0, typebox_1.getValidator)(exports.buildingElementQuerySchema, validators_1.queryValidator);
exports.buildingElementQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=building-element.schema.js.map