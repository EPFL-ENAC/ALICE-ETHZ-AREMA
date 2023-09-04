import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery, ProfessionalTypeService } from './professional-type.class';
export type { ProfessionalType, ProfessionalTypeData, ProfessionalTypePatch, ProfessionalTypeQuery };
export type ProfessionalTypeClientService = Pick<ProfessionalTypeService<Params<ProfessionalTypeQuery>>, (typeof professionalTypeMethods)[number]>;
export declare const professionalTypePath = "professional-type";
export declare const professionalTypeMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const professionalTypeClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [professionalTypePath]: ProfessionalTypeClientService;
    }
}
