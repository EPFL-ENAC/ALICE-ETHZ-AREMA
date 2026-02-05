export interface Filter {
  [key: string]: unknown;
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
  selectable?: boolean;
  type?: string;
}
export interface OptionNumber {
  value: number;
  label: string;
}

export interface Suggestions {
  key: string;
  options: string[];
}

export type Alignment = 'left' | 'right' | 'center';
