import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BuildingElement } from '~/definitions/regenerativeMaterials'
import {
  buildingElement,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'

import { useCommon } from '~/stores/common'

export const useBuildingElementStore = defineStore(buildingElement, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()

  const commons = useCommon<BuildingElement>(
    regenerative_materials.couchdb,
    buildingElement,
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingElementStore, import.meta.hot),
  )
}
