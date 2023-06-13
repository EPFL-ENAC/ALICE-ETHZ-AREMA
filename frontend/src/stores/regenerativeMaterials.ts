import { acceptHMRUpdate, defineStore } from 'pinia'
import { SyncDatabase } from '~/utils/couchdb'
import type { RegenerativeMaterial } from '~/definitions/regenerativeMaterials'
import { resolveFun } from '~/stores/common'

const DB_NAME = 'regenerative_materials'

export const naturalResource = 'naturalResource'
export const buildingElement = 'buildingElement'
export const buildingMaterial = 'buildingMaterial'
export const professionalType = 'professionalType'
export const professional = 'professional'
export const building = 'building'
export const technicalConstruction = 'technicalConstruction'

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
        relations: {
          [`${technicalConstruction}s`]: {
            hasMany: { type: technicalConstruction, options: { async: false } },
          },
        },
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
          [`${technicalConstruction}s`]: {
            hasMany: { type: technicalConstruction, options: { async: false } },
          },
        },
      },
      // technicalConstruction
      {
        singular: technicalConstruction,
        plural: `${technicalConstruction}s`,
        relations: {
          [`${buildingMaterial}`]: {
            belongsTo: { type: buildingMaterial, options: { async: false } },
          },
          [`${buildingElement}`]: {
            belongsTo: { type: buildingElement, options: { async: false } },
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
          [`${professionalType}`]: {
            belongsTo: { type: professionalType, options: { async: false } },
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
      // building
      {
        singular: building,
        plural: `${building}s`,
        relations: {
          [`${professional}s`]: {
            hasMany: { type: professional, options: { async: false } },
          },
          [`${technicalConstruction}s`]: {
            hasMany: { type: technicalConstruction, options: { async: false } },
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
