import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
export declare const naturalResourceSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<"date-time">>;
    createAt: import("@sinclair/typebox").TString<"date-time">;
    updatedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    updatedByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    createdById: import("@sinclair/typebox").TNumber;
    createdByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    name: import("@sinclair/typebox").TString<string>;
    zone: import("@sinclair/typebox").TString<string>;
    dimension: import("@sinclair/typebox").TString<string>;
    amount: import("@sinclair/typebox").TNumber;
    images: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TString<string>;
}>;
export type NaturalResource = Static<typeof naturalResourceSchema>;
export declare const naturalResourceValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const naturalResourceResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    updatedById?: number | undefined;
    id: number;
    name: string;
    text: string;
    createAt: string;
    updatedByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    createdById: number;
    createdByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    zone: string;
    dimension: string;
    amount: number;
    images: string[];
}, HookContext>;
export declare const naturalResourceExternalResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    updatedById?: number | undefined;
    id: number;
    name: string;
    text: string;
    createAt: string;
    updatedByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    createdById: number;
    createdByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    zone: string;
    dimension: string;
    amount: number;
    images: string[];
}, HookContext>;
export declare const naturalResourceDataSchema: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<"date-time">>;
    createAt: import("@sinclair/typebox").TString<"date-time">;
    updatedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    updatedByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    createdById: import("@sinclair/typebox").TNumber;
    createdByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    name: import("@sinclair/typebox").TString<string>;
    zone: import("@sinclair/typebox").TString<string>;
    dimension: import("@sinclair/typebox").TString<string>;
    amount: import("@sinclair/typebox").TNumber;
    images: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TString<string>;
}>, ["name", "zone", "dimension", "amount", "images", "text"]>;
export type NaturalResourceData = Static<typeof naturalResourceDataSchema>;
export declare const naturalResourceDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const naturalResourceDataResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    updatedById?: number | undefined;
    id: number;
    name: string;
    text: string;
    createAt: string;
    updatedByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    createdById: number;
    createdByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    zone: string;
    dimension: string;
    amount: number;
    images: string[];
}, HookContext>;
export declare const naturalResourcePatchSchema: import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<"date-time">>;
    createAt: import("@sinclair/typebox").TString<"date-time">;
    updatedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    updatedByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    createdById: import("@sinclair/typebox").TNumber;
    createdByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    name: import("@sinclair/typebox").TString<string>;
    zone: import("@sinclair/typebox").TString<string>;
    dimension: import("@sinclair/typebox").TString<string>;
    amount: import("@sinclair/typebox").TNumber;
    images: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TString<string>;
}>>;
export type NaturalResourcePatch = Static<typeof naturalResourcePatchSchema>;
export declare const naturalResourcePatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const naturalResourcePatchResolver: import("@feathersjs/schema").Resolver<{
    updatedAt?: string | undefined;
    updatedById?: number | undefined;
    id: number;
    name: string;
    text: string;
    createAt: string;
    updatedByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    createdById: number;
    createdByUser: {
        password?: string | undefined;
        id: number;
        email: string;
    };
    zone: string;
    dimension: string;
    amount: number;
    images: string[];
}, HookContext>;
export declare const naturalResourceQueryProperties: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<"date-time">>;
    createAt: import("@sinclair/typebox").TString<"date-time">;
    updatedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    updatedByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    createdById: import("@sinclair/typebox").TNumber;
    createdByUser: import("@sinclair/typebox").TRef<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TNumber;
        email: import("@sinclair/typebox").TString<string>;
        password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>>;
    name: import("@sinclair/typebox").TString<string>;
    zone: import("@sinclair/typebox").TString<string>;
    dimension: import("@sinclair/typebox").TString<string>;
    amount: import("@sinclair/typebox").TNumber;
    images: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TString<string>;
}>, ["id", "text"]>;
export declare const naturalResourceQuerySchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    $limit: import("@sinclair/typebox").TNumber;
    $skip: import("@sinclair/typebox").TNumber;
    $sort: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>;
    $select: import("@sinclair/typebox").TUnsafe<("id" | "text")[]>;
    $and: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TNumber;
            $gte: import("@sinclair/typebox").TNumber;
            $lt: import("@sinclair/typebox").TNumber;
            $lte: import("@sinclair/typebox").TNumber;
            $ne: import("@sinclair/typebox").TNumber;
            $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
            $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
        text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TString<string>;
            $gte: import("@sinclair/typebox").TString<string>;
            $lt: import("@sinclair/typebox").TString<string>;
            $lte: import("@sinclair/typebox").TString<string>;
            $ne: import("@sinclair/typebox").TString<string>;
            $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
            $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>, import("@sinclair/typebox").TObject<{
        $or: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
                $gt: import("@sinclair/typebox").TNumber;
                $gte: import("@sinclair/typebox").TNumber;
                $lt: import("@sinclair/typebox").TNumber;
                $lte: import("@sinclair/typebox").TNumber;
                $ne: import("@sinclair/typebox").TNumber;
                $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
                $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
            }>, import("@sinclair/typebox").TObject<{
                [key: string]: import("@sinclair/typebox").TSchema;
            } | undefined>]>>]>>;
            text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
                $gt: import("@sinclair/typebox").TString<string>;
                $gte: import("@sinclair/typebox").TString<string>;
                $lt: import("@sinclair/typebox").TString<string>;
                $lte: import("@sinclair/typebox").TString<string>;
                $ne: import("@sinclair/typebox").TString<string>;
                $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
                $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
            }>, import("@sinclair/typebox").TObject<{
                [key: string]: import("@sinclair/typebox").TSchema;
            } | undefined>]>>]>>;
        }>>>;
    }>]>>;
    $or: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TNumber;
            $gte: import("@sinclair/typebox").TNumber;
            $lt: import("@sinclair/typebox").TNumber;
            $lte: import("@sinclair/typebox").TNumber;
            $ne: import("@sinclair/typebox").TNumber;
            $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
            $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
        text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TString<string>;
            $gte: import("@sinclair/typebox").TString<string>;
            $lt: import("@sinclair/typebox").TString<string>;
            $lte: import("@sinclair/typebox").TString<string>;
            $ne: import("@sinclair/typebox").TString<string>;
            $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
            $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>>;
}>>, import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TNumber;
        $gte: import("@sinclair/typebox").TNumber;
        $lt: import("@sinclair/typebox").TNumber;
        $lte: import("@sinclair/typebox").TNumber;
        $ne: import("@sinclair/typebox").TNumber;
        $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
        $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    } | undefined>]>>]>>;
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    } | undefined>]>>]>>;
}>>]>, import("@sinclair/typebox").TObject<{}>]>;
export type NaturalResourceQuery = Static<typeof naturalResourceQuerySchema>;
export declare const naturalResourceQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const naturalResourceQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        id?: number | undefined;
        text?: number | undefined;
    };
    $select: ("id" | "text")[];
    $and: ({
        id?: number | Partial<{
            $gt: number;
            $gte: number;
            $lt: number;
            $lte: number;
            $ne: number;
            $in: number[];
            $nin: number[];
        } & {}> | undefined;
        text?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string[];
            $nin: string[];
        } & {}> | undefined;
    } | {
        $or: {
            id?: number | Partial<{
                $gt: number;
                $gte: number;
                $lt: number;
                $lte: number;
                $ne: number;
                $in: number[];
                $nin: number[];
            } & {}> | undefined;
            text?: string | Partial<{
                $gt: string;
                $gte: string;
                $lt: string;
                $lte: string;
                $ne: string;
                $in: string[];
                $nin: string[];
            } & {}> | undefined;
        }[];
    })[];
    $or: {
        id?: number | Partial<{
            $gt: number;
            $gte: number;
            $lt: number;
            $lte: number;
            $ne: number;
            $in: number[];
            $nin: number[];
        } & {}> | undefined;
        text?: string | Partial<{
            $gt: string;
            $gte: string;
            $lt: string;
            $lte: string;
            $ne: string;
            $in: string[];
            $nin: string[];
        } & {}> | undefined;
    }[];
}> & {
    id?: number | Partial<{
        $gt: number;
        $gte: number;
        $lt: number;
        $lte: number;
        $ne: number;
        $in: number[];
        $nin: number[];
    } & {}> | undefined;
    text?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string[];
        $nin: string[];
    } & {}> | undefined;
} & {}, HookContext>;
