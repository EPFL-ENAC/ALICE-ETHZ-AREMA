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
    // TODO: make english/german translation as key
    const building_elements = [
      { definition: 'structure', name: 'Foundation' },
      { definition: 'structure', name: 'Floor slab Ground Floor' },
      { definition: 'structure', name: 'Ext. Wall Above Ground' },
      { definition: 'structure', name: 'Ext Wall Under Ground' },
      { definition: 'structure', name: 'Balcony' },
      { definition: 'structure', name: 'Int Wall' },
      { definition: 'structure', name: 'Roof' },
      { definition: 'structure', name: 'Ceiling' },
      { definition: 'structure', name: 'Column' },
      { definition: 'structure', name: 'Stair' },
      { definition: 'envelope', name: 'Roof covering' },
      { definition: 'envelope', name: 'Ext Thermal Insul' },
      { definition: 'envelope', name: 'Int Thermal Insul' },
      { definition: 'envelope', name: 'Window & Door' },
      { definition: 'envelope', name: 'Ext. Wall finishing UG' },
      { definition: 'envelope', name: 'Ext. Wall finishing AG' },
      { definition: 'envelope', name: 'Sun & Weather Protection' },
      { definition: 'interior', name: 'Int Wall finishing' },
      { definition: 'interior', name: 'Int Door' },
      { definition: 'interior', name: 'Partition wall' },
      { definition: 'interior', name: 'Ceiling finishing' },
      { definition: 'interior', name: 'Floor covering' },
      { definition: 'tech equipement', name: 'Heat generation' },
      { definition: 'tech equipement', name: 'Heat distribution & delivery' },
      { definition: 'tech equipement', name: 'Vent equip' },
      { definition: 'tech equipement', name: 'Water equipement' },
    ]
    building_elements.forEach(async (value, index) => {
      // get and create if it does not exist.
      value.id = `BE${index + 1}`
      const existingsBE = await couchdb.value.localDB.rel.find(buildingElement)
      // TODO: find a better way to generate BE
      const existingIds = existingsBE?.buildingElements?.map(be => be.id) ?? []
      if (!existingIds.includes(value.id))
        couchdb.value.localDB.rel.save(buildingElement, value)
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
