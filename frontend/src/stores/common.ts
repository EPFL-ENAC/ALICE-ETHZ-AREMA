import { ref } from 'vue'
import type { RegenerativeMaterial, RegenerativeMaterialType } from './regenerativeMaterials'

export const MSG_DB_DOES_NOT_EXIST = 'Please, init your database'

export function useCommon<T extends RegenerativeMaterial>(localDB: PouchDB.Database<T>, typeStringLiteral: RegenerativeMaterialType) {
  const _db = ref<PouchDB.Database<T>>(localDB)
  const loading = ref(false)
  const list = ref([])
  const item = ref(getNew())

  function getNew(): RegenerativeMaterial {
    const date = new Date().toISOString()
    return {
      created_at: date,
      updated_at: date,
      type: typeStringLiteral,
      updated_by: 'admin',
      created_by: 'admin',
    }
  }

  async function save(payload: T) {
    loading.value = true

    if (!localDB)
      throw new Error(MSG_DB_DOES_NOT_EXIST)

    payload.updated_at = new Date().toISOString()
    payload.updated_by = 'admin'
    payload.created_at = payload.created_at ?? new Date().toISOString()
    payload.created_by = payload.created_by ?? 'admin'
    await _db.value.rel.save(typeStringLiteral, payload)
    loading.value = false
  }

  async function remove(payload: T) {
    loading.value = true

    if (!_db.value)
      throw new Error(MSG_DB_DOES_NOT_EXIST)

    await _db.value.rel.del(typeStringLiteral, payload)

    // remoteDB.rel.find('natural_resource', payload)
    loading.value = false
  }

  async function getAll({ limit = 100, skip = 0 } = {}) {
    if (!_db.value)
      throw new Error(MSG_DB_DOES_NOT_EXIST)
    const response = await _db.value.rel.find(typeStringLiteral, { limit, skip })
    return (list.value = response[`${typeStringLiteral}s`])
  }

  return {
    save,
    remove,
    getAll,
    loading,
    list,
    item,
    getNew,
  }
}
