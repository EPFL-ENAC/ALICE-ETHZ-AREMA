import type { RegenerativeMaterialHeader } from '~/definitions/regenerativeMaterials'
import { get as _get } from "lodash";

export interface SelectCustom<V> {
  text: string
  _id: V
}

export function ensureHeaders(item: any): RegenerativeMaterialHeader {
  // todo: implement typescript for item
  const [category, key] = item.path.split('.')
  const isInput = item?.isInput ?? category === 'input'
  return {
    align: 'start',
    name: item.text,
    sortable: false,
    hideFooterContent: item?.hideFooterContent ?? true,
    hideContentInTable: item?.hideContentInTable ?? false,
    hideInput: item.hideInput ?? false,
    label: item.text, // for form-item-component
    key, // for form-item-component
    isInput,
    category, // input or computed,
    title: item.text,
    placeholder: item.symbol ?? '',
    cols: item?.cols ?? '12',
    sm: item?.sm ?? '6',
    md: item?.md ?? '4',
    formatter: (value: unknown) => value,
    classFormatter: () => '',
    options: (() => {
      if (item.options)
        return item.options

      const items = item?.items
      if (typeof items === 'string') {
        // items should not be string.
        return []
      }
      return (
        items?.map((item: string | SelectCustom<string>) => {
          if (typeof item === 'string')
            return { text: item, value: item }

          return {
            text: item?.text,
            value: item?._id,
          }
        }) ?? undefined
      )
    })(),
    ...item,
  } as RegenerativeMaterialHeader
}
