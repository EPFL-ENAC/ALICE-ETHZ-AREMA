"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingMaterialClient = exports.buildingMaterialMethods = exports.buildingMaterialPath = void 0;
exports.buildingMaterialPath = 'building-material';
exports.buildingMaterialMethods = ['find', 'get', 'create', 'patch', 'remove'];
const buildingMaterialClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.buildingMaterialPath, connection.service(exports.buildingMaterialPath), {
        methods: exports.buildingMaterialMethods
    });
};
exports.buildingMaterialClient = buildingMaterialClient;
//# sourceMappingURL=building-material.shared.js.map