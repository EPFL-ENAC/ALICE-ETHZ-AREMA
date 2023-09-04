"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicalConstructionClient = exports.technicalConstructionMethods = exports.technicalConstructionPath = void 0;
exports.technicalConstructionPath = 'technical-construction';
exports.technicalConstructionMethods = ['find', 'get', 'create', 'patch', 'remove'];
const technicalConstructionClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.technicalConstructionPath, connection.service(exports.technicalConstructionPath), {
        methods: exports.technicalConstructionMethods
    });
};
exports.technicalConstructionClient = technicalConstructionClient;
//# sourceMappingURL=technical-construction.shared.js.map