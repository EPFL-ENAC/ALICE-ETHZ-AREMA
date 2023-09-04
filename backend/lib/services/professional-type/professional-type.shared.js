"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalTypeClient = exports.professionalTypeMethods = exports.professionalTypePath = void 0;
exports.professionalTypePath = 'professional-type';
exports.professionalTypeMethods = ['find', 'get', 'create', 'patch', 'remove'];
const professionalTypeClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.professionalTypePath, connection.service(exports.professionalTypePath), {
        methods: exports.professionalTypeMethods
    });
};
exports.professionalTypeClient = professionalTypeClient;
//# sourceMappingURL=professional-type.shared.js.map