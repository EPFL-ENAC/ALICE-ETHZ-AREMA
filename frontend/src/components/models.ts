import type { TaxonomyNode } from 'src/models';

export interface Filter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  children?: Option[];
}

export interface TaxonomyNodeOption {
  value: string;
  label: string;
  children?: TaxonomyNodeOption[];
}

export interface VocabularyOption {
  value: string;
  label: string;
  urn: string;
  taxonomy: TaxonomyNode;
  vocabulary: TaxonomyNode;
}

export interface TermOption {
  value: string;
  label: string;
  urn: string;
  children?: TermOption[];
}
