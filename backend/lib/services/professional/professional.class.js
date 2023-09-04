"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ProfessionalService = void 0;
const knex_1 = require("@feathersjs/knex");
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class ProfessionalService extends knex_1.KnexService {
}
exports.ProfessionalService = ProfessionalService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('postgresqlClient'),
        name: 'professional'
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=professional.class.js.map