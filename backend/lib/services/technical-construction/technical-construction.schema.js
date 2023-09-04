"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicalConstructionQueryResolver = exports.technicalConstructionQueryValidator = exports.technicalConstructionQuerySchema = exports.technicalConstructionQueryProperties = exports.technicalConstructionPatchResolver = exports.technicalConstructionPatchValidator = exports.technicalConstructionPatchSchema = exports.technicalConstructionDataResolver = exports.technicalConstructionDataValidator = exports.technicalConstructionDataSchema = exports.technicalConstructionExternalResolver = exports.technicalConstructionResolver = exports.technicalConstructionValidator = exports.technicalConstructionSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.technicalConstructionSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    text: typebox_1.Type.String()
}, { $id: 'TechnicalConstruction', additionalProperties: false });
exports.technicalConstructionValidator = (0, typebox_1.getValidator)(exports.technicalConstructionSchema, validators_1.dataValidator);
exports.technicalConstructionResolver = (0, schema_1.resolve)({});
exports.technicalConstructionExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.technicalConstructionDataSchema = typebox_1.Type.Pick(exports.technicalConstructionSchema, ['text'], {
    $id: 'TechnicalConstructionData'
});
exports.technicalConstructionDataValidator = (0, typebox_1.getValidator)(exports.technicalConstructionDataSchema, validators_1.dataValidator);
exports.technicalConstructionDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.technicalConstructionPatchSchema = typebox_1.Type.Partial(exports.technicalConstructionSchema, {
    $id: 'TechnicalConstructionPatch'
});
exports.technicalConstructionPatchValidator = (0, typebox_1.getValidator)(exports.technicalConstructionPatchSchema, validators_1.dataValidator);
exports.technicalConstructionPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.technicalConstructionQueryProperties = typebox_1.Type.Pick(exports.technicalConstructionSchema, ['id', 'text']);
exports.technicalConstructionQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.technicalConstructionQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.technicalConstructionQueryValidator = (0, typebox_1.getValidator)(exports.technicalConstructionQuerySchema, validators_1.queryValidator);
exports.technicalConstructionQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=technical-construction.schema.js.map