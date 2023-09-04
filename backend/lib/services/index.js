"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const technical_construction_1 = require("./technical-construction/technical-construction");
const professional_type_1 = require("./professional-type/professional-type");
const professional_1 = require("./professional/professional");
const building_material_1 = require("./building-material/building-material");
const building_element_1 = require("./building-element/building-element");
const natural_resource_1 = require("./natural-resource/natural-resource");
const users_1 = require("./users/users");
const services = (app) => {
    app.configure(technical_construction_1.technicalConstruction);
    app.configure(professional_type_1.professionalType);
    app.configure(professional_1.professional);
    app.configure(building_material_1.buildingMaterial);
    app.configure(building_element_1.buildingElement);
    app.configure(natural_resource_1.naturalResource);
    app.configure(users_1.user);
    // All services will be registered here
};
exports.services = services;
//# sourceMappingURL=index.js.map