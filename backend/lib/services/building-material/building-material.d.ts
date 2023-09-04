import type { Application } from '../../declarations';
import { BuildingMaterialService } from './building-material.class';
import { buildingMaterialPath } from './building-material.shared';
export * from './building-material.class';
export * from './building-material.schema';
export declare const buildingMaterial: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [buildingMaterialPath]: BuildingMaterialService;
    }
}
