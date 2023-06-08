import type { Component } from 'vue'
import type { VDataTable } from 'vuetify/lib/labs/components'
import { Image } from '~/stores/common'

export type RegenerativeMaterialType = | 'naturalResource'
| 'buildingElement'
| 'buildingMaterial'
| 'professionalType'
| 'professional'
| 'building'
| 'technicalConstruction'

export interface RegenerativeMaterial {
  id?: string
  _id?: string
  rev?: string
  _rev?: string
  updated_at: string
  updated_by: string
  created_at: string
  created_by: string
  type: RegenerativeMaterialType
}

export interface Building extends RegenerativeMaterial {
  name: string
}

export interface BuildingElement extends RegenerativeMaterial {
  name: string
}
export interface BuildingMaterial extends RegenerativeMaterial {
  name: string
  zone: string // "wsg84",
  dimension: string
  amount: number
  natural_resources: string[]
}

export interface NaturalResource extends RegenerativeMaterial {
  name: string
  zone: string // "wsg84",
  dimension: string
  amount: number
  images: Image[]
}

export interface Professional extends RegenerativeMaterial {
  name: string
}

export interface ProfessionalType extends RegenerativeMaterial {
  name: string
}

export interface TechnicalConstruction extends RegenerativeMaterial {
  images: Image[]
  buildingElement: string
  buildingMaterial: string
}
// headers regarding NaturalREsources

type Headers = InstanceType<typeof VDataTable>['headers']

export type RegenerativeValue = string | number

export interface RegenerativeMaterialHeader extends Headers {
  text: string | ((v: RegenerativeMaterial) => string) // .e.g "Intervention" description or text to display for input or table header
  path: string // name of the field to use for table

  name: string // keyof NaturalResource
  // component: VTextField| VSelect, //
  component: Component
  label?: string
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

  options: any[], // SelectCustom<SelectValue>[]
  isInput: boolean
  tooltipInfo?: string
  category?: string // example increment
  classFormatter?: (
    v: unknown,
    tableHeader?: RegenerativeMaterialHeader,
    item?: RegenerativeMaterialHeader
  ) => string
  customEventInput?: (
    v: RegenerativeValue,
    localInput: RegenerativeMaterialHeader,
  ) => RegenerativeValue
  formatter?: (
    v: unknown,
    tableHeader?: RegenerativeMaterialHeader,
    item?: RegenerativeMaterialHeader,
    items?: RegenerativeMaterialHeader[]
  ) => string
  formatterTable?: (
    v: unknown,
    tableHeader?: RegenerativeMaterialHeader,
    item?: RegenerativeMaterialHeader
  ) => string
  formatterTableComponent?: (
    v: unknown,
    tableHeader?: RegenerativeMaterialHeader,
    item?: RegenerativeMaterialHeader
  ) => string
  conditional_type?: 'AND' | 'OR'
  conditional_value: RegenerativeValue // e.g "LITRES",
  conditional: string | string[] // based on other SurveyTableHeader field "US_UNI", needs to have conditional_value set
  endlineOnly?: boolean // show only for enldine table true,
  baselineOnly?: boolean
  hideContentInTable: boolean // default to true only for table
  hideFooterContent: boolean
  hideInput: boolean
  computeResults: boolean // false,
}
