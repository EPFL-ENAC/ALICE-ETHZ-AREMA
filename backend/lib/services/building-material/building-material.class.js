"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.BuildingMaterialService = void 0;
const knex_1 = require("@feathersjs/knex");
// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
class BuildingMaterialService extends knex_1.KnexService {
}
exports.BuildingMaterialService = BuildingMaterialService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('postgresqlClient'),
        name: 'building-material'
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=building-material.class.js.map