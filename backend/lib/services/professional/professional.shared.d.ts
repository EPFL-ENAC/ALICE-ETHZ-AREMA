import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery, ProfessionalService } from './professional.class';
export type { Professional, ProfessionalData, ProfessionalPatch, ProfessionalQuery };
export type ProfessionalClientService = Pick<ProfessionalService<Params<ProfessionalQuery>>, (typeof professionalMethods)[number]>;
export declare const professionalPath = "professional";
export declare const professionalMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const professionalClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [professionalPath]: ProfessionalClientService;
    }
}
