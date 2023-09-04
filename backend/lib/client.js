"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
const feathers_1 = require("@feathersjs/feathers");
const authentication_client_1 = __importDefault(require("@feathersjs/authentication-client"));
const technical_construction_shared_1 = require("./services/technical-construction/technical-construction.shared");
const professional_type_shared_1 = require("./services/professional-type/professional-type.shared");
const professional_shared_1 = require("./services/professional/professional.shared");
const building_material_shared_1 = require("./services/building-material/building-material.shared");
const building_element_shared_1 = require("./services/building-element/building-element.shared");
const natural_resource_shared_1 = require("./services/natural-resource/natural-resource.shared");
const users_shared_1 = require("./services/users/users.shared");
/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
const createClient = (connection, authenticationOptions = {}) => {
    const client = (0, feathers_1.feathers)();
    client.configure(connection);
    client.configure((0, authentication_client_1.default)(authenticationOptions));
    client.set('connection', connection);
    client.configure(users_shared_1.userClient);
    client.configure(natural_resource_shared_1.naturalResourceClient);
    client.configure(building_element_shared_1.buildingElementClient);
    client.configure(building_material_shared_1.buildingMaterialClient);
    client.configure(professional_shared_1.professionalClient);
    client.configure(professional_type_shared_1.professionalTypeClient);
    client.configure(technical_construction_shared_1.technicalConstructionClient);
    return client;
};
exports.createClient = createClient;
//# sourceMappingURL=client.js.map