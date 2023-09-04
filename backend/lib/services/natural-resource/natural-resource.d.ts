import type { Application } from '../../declarations';
import { NaturalResourceService } from './natural-resource.class';
import { naturalResourcePath } from './natural-resource.shared';
export * from './natural-resource.class';
export * from './natural-resource.schema';
export declare const naturalResource: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [naturalResourcePath]: NaturalResourceService;
    }
}
