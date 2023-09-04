"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalQueryResolver = exports.professionalQueryValidator = exports.professionalQuerySchema = exports.professionalQueryProperties = exports.professionalPatchResolver = exports.professionalPatchValidator = exports.professionalPatchSchema = exports.professionalDataResolver = exports.professionalDataValidator = exports.professionalDataSchema = exports.professionalExternalResolver = exports.professionalResolver = exports.professionalValidator = exports.professionalSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.professionalSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    text: typebox_1.Type.String()
}, { $id: 'Professional', additionalProperties: false });
exports.professionalValidator = (0, typebox_1.getValidator)(exports.professionalSchema, validators_1.dataValidator);
exports.professionalResolver = (0, schema_1.resolve)({});
exports.professionalExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.professionalDataSchema = typebox_1.Type.Pick(exports.professionalSchema, ['text'], {
    $id: 'ProfessionalData'
});
exports.professionalDataValidator = (0, typebox_1.getValidator)(exports.professionalDataSchema, validators_1.dataValidator);
exports.professionalDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.professionalPatchSchema = typebox_1.Type.Partial(exports.professionalSchema, {
    $id: 'ProfessionalPatch'
});
exports.professionalPatchValidator = (0, typebox_1.getValidator)(exports.professionalPatchSchema, validators_1.dataValidator);
exports.professionalPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.professionalQueryProperties = typebox_1.Type.Pick(exports.professionalSchema, ['id', 'text']);
exports.professionalQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.professionalQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.professionalQueryValidator = (0, typebox_1.getValidator)(exports.professionalQuerySchema, validators_1.queryValidator);
exports.professionalQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=professional.schema.js.map