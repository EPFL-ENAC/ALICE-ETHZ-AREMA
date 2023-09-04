"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.BuildingElementService = void 0;
const knex_1 = require("@feathersjs/knex");
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class BuildingElementService extends knex_1.KnexService {
}
exports.BuildingElementService = BuildingElementService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('postgresqlClient'),
        name: 'building-element'
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=building-element.class.js.map