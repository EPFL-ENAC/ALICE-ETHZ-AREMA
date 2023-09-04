import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery, BuildingElementService } from './building-element.class';
export type { BuildingElement, BuildingElementData, BuildingElementPatch, BuildingElementQuery };
export type BuildingElementClientService = Pick<BuildingElementService<Params<BuildingElementQuery>>, (typeof buildingElementMethods)[number]>;
export declare const buildingElementPath = "building-element";
export declare const buildingElementMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const buildingElementClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [buildingElementPath]: BuildingElementClientService;
    }
}
