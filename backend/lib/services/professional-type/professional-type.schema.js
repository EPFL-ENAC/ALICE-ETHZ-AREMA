"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalTypeQueryResolver = exports.professionalTypeQueryValidator = exports.professionalTypeQuerySchema = exports.professionalTypeQueryProperties = exports.professionalTypePatchResolver = exports.professionalTypePatchValidator = exports.professionalTypePatchSchema = exports.professionalTypeDataResolver = exports.professionalTypeDataValidator = exports.professionalTypeDataSchema = exports.professionalTypeExternalResolver = exports.professionalTypeResolver = exports.professionalTypeValidator = exports.professionalTypeSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.professionalTypeSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    text: typebox_1.Type.String()
}, { $id: 'ProfessionalType', additionalProperties: false });
exports.professionalTypeValidator = (0, typebox_1.getValidator)(exports.professionalTypeSchema, validators_1.dataValidator);
exports.professionalTypeResolver = (0, schema_1.resolve)({});
exports.professionalTypeExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.professionalTypeDataSchema = typebox_1.Type.Pick(exports.professionalTypeSchema, ['text'], {
    $id: 'ProfessionalTypeData'
});
exports.professionalTypeDataValidator = (0, typebox_1.getValidator)(exports.professionalTypeDataSchema, validators_1.dataValidator);
exports.professionalTypeDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.professionalTypePatchSchema = typebox_1.Type.Partial(exports.professionalTypeSchema, {
    $id: 'ProfessionalTypePatch'
});
exports.professionalTypePatchValidator = (0, typebox_1.getValidator)(exports.professionalTypePatchSchema, validators_1.dataValidator);
exports.professionalTypePatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.professionalTypeQueryProperties = typebox_1.Type.Pick(exports.professionalTypeSchema, ['id', 'text']);
exports.professionalTypeQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.professionalTypeQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.professionalTypeQueryValidator = (0, typebox_1.getValidator)(exports.professionalTypeQuerySchema, validators_1.queryValidator);
exports.professionalTypeQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=professional-type.schema.js.map