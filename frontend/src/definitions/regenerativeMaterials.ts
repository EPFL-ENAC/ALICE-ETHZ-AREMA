import type { Component } from 'vue'
import { VDataTable } from 'vuetify/lib/labs/components'


export type RegenerativeMaterialType = 'natural_resource' | 'building_material' | 'professional' | 'professional_type'

export interface RegenerativeMaterial {
  id?: string
  rev?: string

  updated_at: string
  updated_by: string
  created_at: string
  created_by: string
  type: RegenerativeMaterialType
}


export interface NaturalResource extends RegenerativeMaterial {
  name: string
  zone: string // "wsg84",
  dimension: string
  amount: number
}

export interface BuildingMaterial extends RegenerativeMaterial {
  name: string
  zone: string // "wsg84",
  dimension: string
  amount: number
  natural_resources: string[]
}

// headers regarding NaturalREsources

type Headers = InstanceType<typeof VDataTable>['headers']

export interface RegenerativeMaterialHeader extends Headers {
  name: string // keyof NaturalResource
  // component: VTextField| VSelect, //
  component: Component
  label: string
  cols: string | number
  sm: string | number
  md: string | number
  suffix?: string
  symbol?: string
  min?: number
  max?: number
  items?: string[]
  type?: 'string' | 'number'
  required?: boolean

  title: string
  align?: string
  sortable?: boolean
  key: string
}