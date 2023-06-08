import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ProfessionalType } from '~/definitions/regenerativeMaterials'
import {
  professionalType,
  useRegenerativeMaterialsStore,
} from '~/stores/regenerativeMaterials'
import { useCommon } from '~/stores/common'

export const useProfessionalTypeStore = defineStore(professionalType, () => {
  const regenerative_materials = useRegenerativeMaterialsStore()
  regenerative_materials.init()
  const commons = useCommon<ProfessionalType>(
    regenerative_materials.couchdb,
    professionalType,
  )

  return {
    ...commons,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useProfessionalTypeStore, import.meta.hot),
  )
}
