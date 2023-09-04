import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionPatch, TechnicalConstructionQuery, TechnicalConstructionService } from './technical-construction.class';
export type { TechnicalConstruction, TechnicalConstructionData, TechnicalConstructionPatch, TechnicalConstructionQuery };
export type TechnicalConstructionClientService = Pick<TechnicalConstructionService<Params<TechnicalConstructionQuery>>, (typeof technicalConstructionMethods)[number]>;
export declare const technicalConstructionPath = "technical-construction";
export declare const technicalConstructionMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const technicalConstructionClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [technicalConstructionPath]: TechnicalConstructionClientService;
    }
}
