import type { Knex } from 'knex';
import type { Application } from './declarations';
declare module './declarations' {
    interface Configuration {
        postgresqlClient: Knex;
    }
}
export declare const postgresql: (app: Application) => void;
