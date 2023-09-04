import type { Application } from '../../declarations';
import { TechnicalConstructionService } from './technical-construction.class';
import { technicalConstructionPath } from './technical-construction.shared';
export * from './technical-construction.class';
export * from './technical-construction.schema';
export declare const technicalConstruction: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [technicalConstructionPath]: TechnicalConstructionService;
    }
}
