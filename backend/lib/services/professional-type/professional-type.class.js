"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ProfessionalTypeService = void 0;
const knex_1 = require("@feathersjs/knex");
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class ProfessionalTypeService extends knex_1.KnexService {
}
exports.ProfessionalTypeService = ProfessionalTypeService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('postgresqlClient'),
        name: 'professional-type'
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=professional-type.class.js.map