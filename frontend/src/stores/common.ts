import { ref } from 'vue'
import type {
  RegenerativeMaterial,
  RegenerativeMaterialType,
} from './regenerativeMaterials'
import { cloneDeep } from "lodash"

export const MSG_DB_DOES_NOT_EXIST = 'Please, init your database'

export function useCommon<T extends RegenerativeMaterial>(
  localDB: PouchDB.Database<T>,
  typeStringLiteral: RegenerativeMaterialType,
) {
  const _db = ref<PouchDB.Database<T>>(localDB)
  const loading = ref(false)
  const list = ref([])
  const item = ref(getNew())
  const hashObjects = ref({})

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

  function resolveFun(a, b) {
    // cannot merge: return nothing
    if (!a?.data?.updated_at && !b?.data?.updated_at) return
    if (!a?.data?.updated_at && b.data.updated_at) return b
    if (!b?.data?.updated_at && a.data.updated_at) return a
    // return one of the docs
    if (a.data.updated_at > b.data.updated_at) return a
    else return b

    // // return changed doc
    // a.foo = 'bar'
    // return a
  }

  async function save(payload: T, maxtime = 1) {
    loading.value = true
    let response
    if (!localDB) throw new Error(MSG_DB_DOES_NOT_EXIST)

    payload.updated_at = new Date().toISOString()
    payload.updated_by = 'admin'
    payload.created_at = payload.created_at ?? new Date().toISOString()
    payload.created_by = payload.created_by ?? 'admin'
    try {
      response = await _db.value.rel.save(typeStringLiteral, payload)
    } catch (error) {
      if (error?.status === 409 && error?.name === 'conflict') {
        // Query doc with `conflicts: true`
        const _id = _db.value.rel.makeDocID({
          type: typeStringLiteral,
          id: payload.id,
        })

        const mydoc = await _db.value.get(_id, { conflicts: true })
        if (mydoc._conflicts) {
          // conflicts in the datbaase
          // try {

          response = await _db.value.resolveConflicts(mydoc, resolveFun)
          // } catch (error) {
          //   console.log("error")
          //  could not resolve conflicts
          // }
        } else {
          // else it means the frontend was not uptodate.. just change the _rev and retry
          // resolveFun(payload, mydoc)
          payload.rev = mydoc._rev
          // maybe use resolve function here. (with popup and appropriate message)
          // potential infinite loop,
          if (maxtime > 0) {
            // TODO: improve with a debounce of 300ms
            response = await save(payload, maxtime - 1)
          }
        }
      }
    }
    loading.value = false
    return response
  }

  async function remove(payload: T) {
    loading.value = true

    if (!_db.value) throw new Error(MSG_DB_DOES_NOT_EXIST)

    const response = await _db.value.rel.del(typeStringLiteral, payload)
    loading.value = false
    if (!response.deleted)
      throw new Error(`couchdb remove failed ${typeStringLiteral}`, payload)
  }

  async function getAll({ limit = 100, skip = 0 } = {}) {
    // debugger;
    if (!_db.value) throw new Error(MSG_DB_DOES_NOT_EXIST)
    const response = await _db.value.rel.find(typeStringLiteral, {
      limit,
      skip,
    })

    /*
      - 1) transform every object in hash version.
      - 2) create other keys by removing from the set the typeStringLiteral
      - 3) for the main object transform other keys in object list and rename other key in otherKey_ids
      - 4) that'll be good enough.
    */

    const keys = Object.keys(response)
    // keys.reduce((acc1,key) => {acc1[key] = a[key].reduce((acc, el) => {acc[el.id] = el; return acc}, {}); return acc1}, {})
    hashObjects.value = keys.reduce((acc1, key) => {
      acc1[key] = response[key].reduce((acc2, el) => {
        acc2[el.id] = el
        return acc2
      }, {})
      return acc1
    }, {})

    // step 2
    const keySet = new Set(keys)
    keySet.delete(`${typeStringLiteral}s`)
    const otherKeys = Array.from(keySet)
    // step 3
    // const transformedMain = []
    const transformedMain = response[`${typeStringLiteral}s`].map((item) => {
      otherKeys.forEach((key) => {
        item[`${key}_ids`] = item[key]
        item[key] = item[key].map((otherKey) => hashObjects.value[key][otherKey])
      })
      return item
    })
    // step 4
    list.value = cloneDeep(transformedMain)
    return response
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
