import { acceptHMRUpdate, defineStore } from 'pinia'
import type { NaturalResource } from '~/definitions/regenerativeMaterials'
import {
  naturalResource,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useNaturalResourceStore = defineStore(naturalResource, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()

  return {
    ...useCommon<NaturalResource>(
      regenerative_materials.couchdb.localDB,
      naturalResource,
    ),
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useNaturalResourceStore, import.meta.hot),
  )
}
