import type { Component } from 'vue'
import { VDataTable } from 'vuetify/lib/labs/components'

type Headers = InstanceType<typeof VDataTable>['headers']


export interface NaturalResourceHeader extends Headers {
  name: keyof NaturalResource,
  // component: VTextField| VSelect, //
  component: Component,
  label: string,
  cols: string|number;
  sm: string|number;
  md: string|number;
  suffix?: string;
  symbol?: string;
  min?: number;
  max?: number;
  items?: string[];
  type?: "string" | "number";
  required?: boolean;

  title: string;
align?: string;
sortable?: boolean;
  key: string;
}
export interface NaturalResource {
  _id?: string;
  _rev?: string;
  name: string;
  zone: string; // "wsg84",
  dimension: string;
  amount: number;
  type: "natural_resource" | "professional"

  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}
