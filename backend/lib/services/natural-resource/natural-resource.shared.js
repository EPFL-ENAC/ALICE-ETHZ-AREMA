"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalResourceClient = exports.naturalResourceMethods = exports.naturalResourcePath = void 0;
exports.naturalResourcePath = 'natural-resource';
exports.naturalResourceMethods = ['find', 'get', 'create', 'patch', 'remove'];
const naturalResourceClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.naturalResourcePath, connection.service(exports.naturalResourcePath), {
        methods: exports.naturalResourceMethods
    });
};
exports.naturalResourceClient = naturalResourceClient;
//# sourceMappingURL=natural-resource.shared.js.map