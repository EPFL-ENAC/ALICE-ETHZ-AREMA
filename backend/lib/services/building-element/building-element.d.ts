import type { Application } from '../../declarations';
import { BuildingElementService } from './building-element.class';
import { buildingElementPath } from './building-element.shared';
export * from './building-element.class';
export * from './building-element.schema';
export declare const buildingElement: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [buildingElementPath]: BuildingElementService;
    }
}
