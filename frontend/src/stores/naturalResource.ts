import { defineStore, acceptHMRUpdate } from 'pinia'
import type { NaturalResource } from '~/definitions/naturalResources';
import PouchDB from 'pouchdb-browser'
import { getUrl, SyncDatabase } from '~/utils/couchdb';

const DB_NAME = "regenerative_materials";
const MSG_DB_DOES_NOT_EXIST = "Please, init your database";


export const useNaturalResourceStore = defineStore('naturalResource', () => {

  // const remote = ref(new PouchDB(getUrl(DB_NAME)));

  // remote.onChange()
  // const remoteDB = remote.value
  const couchdb = ref(new SyncDatabase<NaturalResource>(DB_NAME))
  const remoteDB = couchdb.value.remoteDB;
  const loading = ref(false)
  const naturalResource = ref(getNewNaturalResource());
  const naturalResources = ref([]);

  function getNewNaturalResource(): NaturalResource {
    const date = new Date().toISOString();
    return ({
      name: '',
      zone: '',
      dimension: 'kg',
      amount: 0,
      type: "natural_resource",
      created_at: date,
      updated_at: date,
      updated_by: 'admin',
      created_by: 'admin',
    });
  }

  async function save(payload: NaturalResource) {
    loading.value = true;

    if (!remoteDB) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    payload.type = "natural_resource";
    payload.updated_at = new Date().toISOString();
    payload.updated_by = 'admin';
    // payload.type = "professional";
    // post if new
    if (payload._id) {
      const response = await remoteDB.put(payload);
      // update only rev
      naturalResource.value._rev = response.rev;
    } else {
      payload.created_at = new Date().toISOString();
      payload.created_by = 'admin';
      naturalResource.value = await remoteDB.post(payload);
    }
    loading.value = false;
  }


  async function remove(payload: NaturalResource) {
    loading.value = true;

    if (!remoteDB) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    // payload.type = "professional";
    await remoteDB.remove(payload);
    loading.value = false;
  }

  async function getNaturalResources({limit = 100, skip = 0} = {}) {
    if (!remoteDB) {
      throw new Error(MSG_DB_DOES_NOT_EXIST);
    }
    // shelters/_design/shelter/_view/countries?include_docs=false&group=true&reduce=true
    // /regenerative_materials/_design/natural_resources/_view/list?skip=0&limit=51&reduce=false
    return await remoteDB
      .query("natural_resources/list", {
        include_docs: true,
        reduce: false,
        group: false,
        limit: 100,
        skip: 0,
      })
      .then(function (result) {
        naturalResources.value = result.rows
        .filter((row) => row.key != "")
        .map((row) => row.doc as NaturalResource);
        return naturalResources.value;
      });
  }

  return { loading, naturalResource, naturalResources, save, remove, getNaturalResources, getNewNaturalResource }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNaturalResourceStore, import.meta.hot))
}
