import { acceptHMRUpdate, defineStore } from 'pinia'
import type { TechnicalConstruction } from '~/definitions/regenerativeMaterials'
import {
  technicalConstruction,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useTechnicalConstructionStore = defineStore(technicalConstruction, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()
  regenerative_materials.init()
  const commons = useCommon<TechnicalConstruction>(
    regenerative_materials.couchdb,
    technicalConstruction,
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTechnicalConstructionStore, import.meta.hot),
  )
}
