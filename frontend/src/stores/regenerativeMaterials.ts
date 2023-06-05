import { acceptHMRUpdate, defineStore } from 'pinia'
import { SyncDatabase } from '~/utils/couchdb'
import type { RegenerativeMaterial } from '~/definitions/regenerativeMaterials'

const DB_NAME = 'regenerative_materials'

export const naturalResource = 'naturalResource'
export const buildingMaterial = 'buildingMaterial'
export const professional = 'professional'
export const professionalType = 'professionalType'
export const buildingElement = 'buildingElement'

export const useRegenerativeMaterialsStore = defineStore(
  'regenerative_materials',
  () => {
    const couchdb = ref(new SyncDatabase<RegenerativeMaterial>(DB_NAME))

    couchdb.value.localDB.setSchema([
      {
        singular: naturalResource,
        plural: `${naturalResource}s`,
        relations: {
          [buildingMaterial]: { belongsTo: buildingMaterial },
        },
      },
      {
        singular: buildingElement,
        plural: `${buildingElement}s`,
      },
      {
        singular: buildingMaterial,
        plural: `${buildingMaterial}s`,
        relations: {
          [`${naturalResource}s`]: {
            hasMany: { type: naturalResource, options: { async: false } },
          },
          [`${buildingElement}s`]: {
            hasMany: { type: buildingElement, options: { async: false } },
          },
        },
      },
      {
        singular: professional,
        plural: `${professional}s`,
        relations: {
          [`${naturalResource}s`]: {
            hasMany: { type: naturalResource, options: { async: false } },
          },
          [`${buildingMaterial}s`]: {
            hasMany: { type: buildingMaterial, options: { async: false } },
          },
        },
      },
      {
        singular: professionalType,
        plural: `${professionalType}s`,
        relations: {
          [`${professional}s`]: {
            hasMany: { type: professional, options: { async: false } },
          },
        },
      },
    ])
    const building_elements = [
      'foundation',
      'floor load-bearing',
      'floor non-load-bearing',
      'wall exterior load-bearing',
      'wall exterior non-load-bearing',
      'wall interior load-bearing',
      'wall interior non-load-bearing',
      'windows',
      'doors',
      'structural',
      'roof',
      'insulation exterior',
      'insulation interior',
      'cladding interior',
      'cladding exterior',
    ]
    building_elements.forEach((value, index) => {
      // get and create if it does not exist.
      // couchdb.value.localDB.rel.save(buildingElement, {name: value, id: `BE${index + 1}`})
    })
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
