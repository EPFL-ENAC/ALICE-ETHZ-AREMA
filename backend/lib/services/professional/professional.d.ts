import type { Application } from '../../declarations';
import { ProfessionalService } from './professional.class';
import { professionalPath } from './professional.shared';
export * from './professional.class';
export * from './professional.schema';
export declare const professional: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [professionalPath]: ProfessionalService;
    }
}
