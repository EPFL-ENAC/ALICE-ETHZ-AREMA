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

  function init() {
    regenerative_materials.couchdb.onLocalChange(
      (_: any) => {
        commons.getAll()
      },
      {
        // filter: '_selector', /// here an example of how to make it custom
        // query_params: {_deleted: true },
        filter: function (doc) {
          const docRel = regenerative_materials.couchdb.localDB.rel.parseDocID(
            doc._id,
          )
          if (docRel.type === buildingMaterial) return doc
        },
      },
    )
  }

  function close() {
    regenerative_materials.couchdb.closeLocalChanges()
  }

  return {
    init,
    close,
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingMaterialStore, import.meta.hot),
  )
}
