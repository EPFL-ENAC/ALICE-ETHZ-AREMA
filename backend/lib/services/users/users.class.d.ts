import type { Params } from '@feathersjs/feathers';
import { KnexService } from '@feathersjs/knex';
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex';
import type { Application } from '../../declarations';
import type { User, UserData, UserPatch, UserQuery } from './users.schema';
export type { User, UserData, UserPatch, UserQuery };
export interface UserParams extends KnexAdapterParams<UserQuery> {
}
export declare class UserService<ServiceParams extends Params = UserParams> extends KnexService<User, UserData, UserParams, UserPatch> {
}
export declare const getOptions: (app: Application) => KnexAdapterOptions;
