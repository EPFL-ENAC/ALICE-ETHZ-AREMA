import PouchDB from 'pouchdb-browser'
import find from 'pouchdb-find'
import rel from 'relational-pouch'
import resolveConflicts from 'pouch-resolve-conflicts'

PouchDB.plugin(find)
PouchDB.plugin(rel)
PouchDB.plugin(resolveConflicts)
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

interface ExtendedChangeOptions {
  batch_size?: number
  timeout?: number
  since?: string
  live?: boolean
  include_docs?: boolean
  filter?: string | ((doc: any) => boolean)
  view?: string
}

export class SyncDatabase<T extends {}> {
  public localDB: PouchDB.Database<T>
  public remoteDB: PouchDB.Database<T>
  private sync: PouchDB.Replication.Sync<T>
  private onChangeListeners: (PouchDB.Core.Changes<T> | undefined)[]

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
    this.onChangeListeners = []
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
        if (error) console.error(error)
        else console.log('sync', result)
      },
    )
    this.localDB = localDB
    this.remoteDB = remoteDB
  }

  defaultOptions: ExtendedChangeOptions = {
    batch_size: 5,
    timeout: 30000,
    since: 'now',
    live: true,
    include_docs: false,
    // filter: '_view', /// here an example of how to make it custom
    // view: 'natural_resources/list',
    // view: 'professional/list',
  }

  onLocalChange(
    action: (value: PouchDB.Core.ChangesResponseChange<T>) => unknown,
    { ...options } = this.defaultOptions,
  ): PouchDB.Core.Changes<T> {
    const finalOptions = {
      ...this.defaultOptions,
      ...options,
    }

    const changeListener = this.localDB.changes(finalOptions)
    this.onChangeListeners.push(changeListener)

    changeListener.on('change', action)
    return changeListener
  }

  closeLocalChanges(): void {
    this.onChangeListeners?.forEach(changeListener => changeListener?.cancel())
    this.onChangeListeners = []
  }

  cancel(): void {
    this.sync.cancel()
    this.closeLocalChanges()
  }
}
