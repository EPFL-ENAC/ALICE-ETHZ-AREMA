import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Building } from '~/definitions/regenerativeMaterials'
import {
  building,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useBuildingStore = defineStore(building, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()
  
  const commons = useCommon<Building>(
    regenerative_materials.couchdb,
    building,
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingStore, import.meta.hot),
  )
}
