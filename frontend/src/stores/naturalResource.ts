import { acceptHMRUpdate, defineStore } from 'pinia'
import type { NaturalResource } from '~/definitions/regenerativeMaterials'
import {
  naturalResource,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useNaturalResourceStore = defineStore(naturalResource, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()

  const commons = useCommon<NaturalResource>(
    regenerative_materials.couchdb.localDB,
    naturalResource,
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
          if (docRel.type === naturalResource) return doc
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
    acceptHMRUpdate(useNaturalResourceStore, import.meta.hot),
  )
}
