import PouchDB from 'pouchdb-browser'
import find from 'pouchdb-find'
import rel from 'relational-pouch'

PouchDB.plugin(find)
PouchDB.plugin(rel)
// import qs from 'qs'

export type ExistingDocument<T extends {}> = PouchDB.Core.ExistingDocument<T>
export type PutDocument<T extends {}> = PouchDB.Core.PutDocument<T>

export enum SessionStorageKey {
  Token = 'alice-ethz-arema_id_token',
  Refresh = 'alice-ethz-arema_refresh_token',
  Access = 'alice-ethz-arema_access_token',
}

export const databaseUrl: string = url(import.meta.env.VITE_COUCHDB_URL)
export const designDocumentPrefix = '_design/'

function url(value = ''): string {
  try {
    return new URL(value).toString()
  } catch {
    const url = new URL(window.location.origin)

    url.pathname = value

    return url.toString()
  }
}

export function getUrl(path: string): string {
  console.log(import.meta.env)
  return `${databaseUrl}/${path}`
}

export class SyncDatabase<T extends {}> {
  public localDB: PouchDB.Database<T>
  public remoteDB: PouchDB.Database<T>
  private sync: PouchDB.Replication.Sync<T>
  private onChangeListener: PouchDB.Core.Changes<T> | undefined

  constructor(name: string) {
    const token = sessionStorage.getItem(SessionStorageKey.Token)
    const localDB = new PouchDB<T>(name)
    const remoteDB = new PouchDB<T>(getUrl(name), {
      fetch: token
        ? (url, opts) => {
            ;(opts?.headers as Headers | undefined)?.set(
              'Authorization',
              `Bearer ${token}`,
            )
            return PouchDB.fetch(url, opts)
          }
        : undefined,
    })

    remoteDB.setSchema([
      {
        singular: 'natural_resource',
        plural: 'natural_resources',
        relations: {
          building_material: { belongsTo: 'building_material' },
        },
      },
      {
        singular: 'building_material',
        plural: 'building_materials',
        relations: {
          natural_resources: {
            hasMany: { type: 'natural_resource', options: { async: false } },
          },
        },
      },
      {
        singular: 'professional',
        plural: 'professionals',
        relations: {
          natural_resources: {
            hasMany: { type: 'natural_resource', options: { async: false } },
          },
          building_materials: {
            hasMany: { type: 'building_material', options: { async: false } },
          },
        },
      },
      {
        singular: 'professional_type',
        plural: 'professional_types',
        relations: {
          professionals: {
            hasMany: { type: 'professional', options: { async: false } },
          },
        },
      },
    ])
    // remoteDB.rel.save('natural_resource', {
    //   name: 'Rails is Omakase',
    //   text: 'There are a lot of a-la-carte software...',
    // })
    // console.log('save natural_resource')

    this.sync = localDB.sync(
      remoteDB,
      {
        batch_size: 5,
        timeout: 30000,
        batches_limit: 2,
        since: 'now',
        live: true,
        retry: true,
        back_off_function(delay: number) {
          if (delay === 27000 || delay === 0) {
            return 1000
          }
          return delay * 3
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error(error)
        } else {
          console.debug('sync', result)
        }
      },
    )
    this.localDB = localDB
    this.remoteDB = remoteDB
  }
  //   /**
  //    * @deprecated use localDB
  //    */
  // get db(): PouchDB.Database<T> {
  //   return this.localDB
  // }

  onChange(
    listener: (value: PouchDB.Core.ChangesResponseChange<T>) => unknown,
  ): PouchDB.Core.Changes<T> {
    this.onChangeListener = this.localDB.changes({
      batch_size: 5,
      timeout: 30000,
      since: 'now',
      live: true,
    })

    this.onChangeListener.on('change', listener)
    return this.onChangeListener
  }

  // async getAllDocuments(): Promise<ExistingDocument<T>[]> {
  //   const result = await this.localDB.allDocs({
  //     include_docs: true,
  //   })
  //   return result.rows.map((row) => row.doc as ExistingDocument<T>)
  // }

  // async getDocuments(): Promise<ExistingDocument<T>[]> {
  //   return (await this.getAllDocuments()).filter(
  //     (doc) => !doc._id.startsWith(designDocumentPrefix),
  //   )
  // }

  cancel(): void {
    this.sync.cancel()
    this.onChangeListener?.cancel()
  }
}
