"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.TechnicalConstructionService = void 0;
const knex_1 = require("@feathersjs/knex");
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class TechnicalConstructionService extends knex_1.KnexService {
}
exports.TechnicalConstructionService = TechnicalConstructionService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('postgresqlClient'),
        name: 'technical-construction'
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=technical-construction.class.js.map