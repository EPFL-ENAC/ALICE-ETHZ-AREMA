import type { Application } from '../../declarations';
import { UserService } from './users.class';
import { userPath } from './users.shared';
export * from './users.class';
export * from './users.schema';
export declare const user: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [userPath]: UserService;
    }
}
