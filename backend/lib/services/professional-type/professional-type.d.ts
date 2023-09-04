import type { Application } from '../../declarations';
import { ProfessionalTypeService } from './professional-type.class';
import { professionalTypePath } from './professional-type.shared';
export * from './professional-type.class';
export * from './professional-type.schema';
export declare const professionalType: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [professionalTypePath]: ProfessionalTypeService;
    }
}
