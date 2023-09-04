"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingElementClient = exports.buildingElementMethods = exports.buildingElementPath = void 0;
exports.buildingElementPath = 'building-element';
exports.buildingElementMethods = ['find', 'get', 'create', 'patch', 'remove'];
const buildingElementClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.buildingElementPath, connection.service(exports.buildingElementPath), {
        methods: exports.buildingElementMethods
    });
};
exports.buildingElementClient = buildingElementClient;
//# sourceMappingURL=building-element.shared.js.map