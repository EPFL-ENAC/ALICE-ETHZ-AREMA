"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userClient = exports.userMethods = exports.userPath = void 0;
exports.userPath = 'users';
exports.userMethods = ['find', 'get', 'create', 'patch', 'remove'];
const userClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.userPath, connection.service(exports.userPath), {
        methods: exports.userMethods
    });
};
exports.userClient = userClient;
//# sourceMappingURL=users.shared.js.map