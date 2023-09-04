import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery, NaturalResourceService } from './natural-resource.class';
export type { NaturalResource, NaturalResourceData, NaturalResourcePatch, NaturalResourceQuery };
export type NaturalResourceClientService = Pick<NaturalResourceService<Params<NaturalResourceQuery>>, (typeof naturalResourceMethods)[number]>;
export declare const naturalResourcePath = "natural-resource";
export declare const naturalResourceMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const naturalResourceClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [naturalResourcePath]: NaturalResourceClientService;
    }
}
