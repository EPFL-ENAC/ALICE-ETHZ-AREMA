export interface Filter {
  [key: string]: any;
}

export interface Query {
  $skip?: number;
  $limit?: number;
  filter?: Filter;
}
