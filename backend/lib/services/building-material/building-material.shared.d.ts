import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery, BuildingMaterialService } from './building-material.class';
export type { BuildingMaterial, BuildingMaterialData, BuildingMaterialPatch, BuildingMaterialQuery };
export type BuildingMaterialClientService = Pick<BuildingMaterialService<Params<BuildingMaterialQuery>>, (typeof buildingMaterialMethods)[number]>;
export declare const buildingMaterialPath = "building-material";
export declare const buildingMaterialMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const buildingMaterialClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [buildingMaterialPath]: BuildingMaterialClientService;
    }
}
