/**
 * https://next.vuetifyjs.com/en/api/v-select/
 */
export type SelectItem<V = string> = V | SelectItemObject<V>

export interface SelectItemObject<V = string> {
  title: string
  value: V
}
