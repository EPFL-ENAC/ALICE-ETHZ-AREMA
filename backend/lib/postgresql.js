"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresql = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
const knex_1 = __importDefault(require("knex"));
const postgresql = (app) => {
    const config = app.get('postgresql');
    const db = (0, knex_1.default)(config);
    app.set('postgresqlClient', db);
};
exports.postgresql = postgresql;
//# sourceMappingURL=postgresql.js.map