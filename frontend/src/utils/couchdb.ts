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
          if (delay === 27000 || delay === 0) return 1000
          return delay * 3
        },
      },
      (error: any, result: any) => {
        if (error)
          console.error(error)
        else
          console.log('sync', result)
      },
    )
    this.localDB = localDB
    this.remoteDB = remoteDB
  }

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

  cancel(): void {
    this.sync.cancel()
    this.onChangeListener?.cancel()
  }
}
