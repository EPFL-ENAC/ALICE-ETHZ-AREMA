import { acceptHMRUpdate, defineStore } from 'pinia'
import { SyncDatabase } from '~/utils/couchdb'
import type { RegenerativeMaterial } from '~/definitions/regenerativeMaterials'

const DB_NAME = 'regenerative_materials'

export const naturalResource = 'natural_resource'
export const buildingMaterial = 'building_material'
export const professional = 'professional'
export const professionalType = 'professional_type'

export const useRegenerativeMaterialsStore = defineStore(
  'regenerative_materials',
  () => {
    const couchdb = ref(new SyncDatabase<RegenerativeMaterial>(DB_NAME))

    couchdb.value.localDB.setSchema([
      {
        singular: naturalResource,
        plural: `${naturalResource}s`,
        relations: {
          building_material: { belongsTo: buildingMaterial },
        },
      },
      {
        singular: buildingMaterial,
        plural: `${buildingMaterial}s`,
        relations: {
          natural_resources: {
            hasMany: { type: naturalResource, options: { async: false } },
          },
        },
      },
      {
        singular: professional,
        plural: `${professional}s`,
        relations: {
          natural_resources: {
            hasMany: { type: naturalResource, options: { async: false } },
          },
          building_materials: {
            hasMany: { type: buildingMaterial, options: { async: false } },
          },
        },
      },
      {
        singular: professionalType,
        plural: `${professionalType}s`,
        relations: {
          professionals: {
            hasMany: { type: professional, options: { async: false } },
          },
        },
      },
    ])
    return {
      couchdb,
    }
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRegenerativeMaterialsStore, import.meta.hot),
  )
}
