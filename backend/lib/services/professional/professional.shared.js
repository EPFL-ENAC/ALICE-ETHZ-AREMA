"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalClient = exports.professionalMethods = exports.professionalPath = void 0;
exports.professionalPath = 'professional';
exports.professionalMethods = ['find', 'get', 'create', 'patch', 'remove'];
const professionalClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.professionalPath, connection.service(exports.professionalPath), {
        methods: exports.professionalMethods
    });
};
exports.professionalClient = professionalClient;
//# sourceMappingURL=professional.shared.js.map