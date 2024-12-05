import { TaxonomyNode } from 'src/models';

export interface Filter {
  [key: string]: any;
}

export interface Query {
  $skip?: number;
  $limit?: number;
  $sort?: [string, boolean]; // [field, descending]
  $select?: string[];
  filter?: Filter;
}

export interface FileObject extends Blob {
  readonly size: number;
  readonly name: string;
  readonly path: string;
  readonly type: string;
}

export interface Option {
  value: string;
  label: string;
  level?: number;
}

export interface TaxonomyNodeOption {
  value: string;
  label: string;
  taxonomy: TaxonomyNode;
  vocabulary: TaxonomyNode;
  term?: TaxonomyNode;
  urn: string;
}
