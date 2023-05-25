import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BuildingMaterial } from '~/definitions/regenerativeMaterials'
import {
  buildingMaterial,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useBuildingMaterialStore = defineStore(buildingMaterial, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()

  return {
    ...useCommon<BuildingMaterial>(
      regenerative_materials.couchdb.localDB,
      buildingMaterial,
    ),
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingMaterialStore, import.meta.hot),
  )
}
