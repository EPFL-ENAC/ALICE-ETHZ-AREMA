import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Professional } from '~/definitions/regenerativeMaterials'
import {
  professional,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useProfessionalStore = defineStore(professional, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()
  
  const commons = useCommon<Professional>(
    regenerative_materials.couchdb,
    professional,
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useProfessionalStore, import.meta.hot),
  )
}
