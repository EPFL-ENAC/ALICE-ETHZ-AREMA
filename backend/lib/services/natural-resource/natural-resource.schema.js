"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalResourceQueryResolver = exports.naturalResourceQueryValidator = exports.naturalResourceQuerySchema = exports.naturalResourceQueryProperties = exports.naturalResourcePatchResolver = exports.naturalResourcePatchValidator = exports.naturalResourcePatchSchema = exports.naturalResourceDataResolver = exports.naturalResourceDataValidator = exports.naturalResourceDataSchema = exports.naturalResourceExternalResolver = exports.naturalResourceResolver = exports.naturalResourceValidator = exports.naturalResourceSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const users_schema_1 = require("../users/users.schema");
const validators_1 = require("../../validators");
// Main data model schema
exports.naturalResourceSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    createAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedById: typebox_1.Type.Optional(typebox_1.Type.Number()),
    updatedByUser: typebox_1.Type.Ref(users_schema_1.userSchema),
    createdById: typebox_1.Type.Number(),
    createdByUser: typebox_1.Type.Ref(users_schema_1.userSchema),
    name: typebox_1.Type.String(),
    zone: typebox_1.Type.String(),
    dimension: typebox_1.Type.String(),
    amount: typebox_1.Type.Number(),
    images: typebox_1.Type.Array(typebox_1.Type.String()),
    text: typebox_1.Type.String(),
}, { $id: 'NaturalResource', additionalProperties: false });
exports.naturalResourceValidator = (0, typebox_1.getValidator)(exports.naturalResourceSchema, validators_1.dataValidator);
exports.naturalResourceResolver = (0, schema_1.resolve)({});
exports.naturalResourceExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.naturalResourceDataSchema = typebox_1.Type.Pick(exports.naturalResourceSchema, ['name', 'zone', 'dimension', 'amount', 'images', 'text'], {
    $id: 'NaturalResourceData'
});
exports.naturalResourceDataValidator = (0, typebox_1.getValidator)(exports.naturalResourceDataSchema, validators_1.dataValidator);
exports.naturalResourceDataResolver = (0, schema_1.resolve)({
    createdByUser: (0, schema_1.virtual)(async (message, context) => {
        // Associate the user that sent the message
        return context.app.service('users').get(message.createdById);
    }),
    updatedByUser: (0, schema_1.virtual)(async (message, context) => {
        // Associate the user that sent the message
        if (message.updatedById) {
            return context.app.service('users').get(message.updatedById);
        }
    })
});
// Schema for updating existing entries
exports.naturalResourcePatchSchema = typebox_1.Type.Partial(exports.naturalResourceSchema, {
    $id: 'NaturalResourcePatch'
});
exports.naturalResourcePatchValidator = (0, typebox_1.getValidator)(exports.naturalResourcePatchSchema, validators_1.dataValidator);
exports.naturalResourcePatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.naturalResourceQueryProperties = typebox_1.Type.Pick(exports.naturalResourceSchema, ['id', 'text']);
exports.naturalResourceQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.naturalResourceQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.naturalResourceQueryValidator = (0, typebox_1.getValidator)(exports.naturalResourceQuerySchema, validators_1.queryValidator);
exports.naturalResourceQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=natural-resource.schema.js.map