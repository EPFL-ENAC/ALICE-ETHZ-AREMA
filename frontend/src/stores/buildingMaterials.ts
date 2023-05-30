import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BuildingMaterial } from '~/definitions/regenerativeMaterials'
import {
  buildingMaterial,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useBuildingMaterialStore = defineStore(buildingMaterial, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()

  const commons = useCommon<BuildingMaterial>(
    regenerative_materials.couchdb.localDB,
    buildingMaterial,
  )

  regenerative_materials.couchdb.onLocalChange(
    (_: any) => {
      commons.getAll()
    },
    {
      filter(doc: BuildingMaterial): boolean {
        const docRel = regenerative_materials.couchdb.localDB.rel.parseDocID(
          doc._id,
        )
        if (docRel.type === buildingMaterial) return true
        return false
      },
    },
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingMaterialStore, import.meta.hot),
  )
}
