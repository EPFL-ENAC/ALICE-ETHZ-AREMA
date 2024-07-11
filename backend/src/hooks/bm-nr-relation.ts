// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

/**
 * A hook for cascading the removal of related items in the building-material-natural-resource service.
 * @param context 
 */
export const bmNrRelation = async (context: HookContext) => {
  if (context.method === 'remove' && context.id !== undefined) {
    const service = context.app.service('building-material-natural-resource')
    let query = null
    // TODO case of remove an array of items
    if (context.path === 'natural-resource') {
      query = { naturalResourceId: parseInt(context.id.toString()) }
    } else if (context.path === 'building-material') {
      query = { buildingMaterialId: parseInt(context.id.toString()) }
    }
    if (query) {
      await service.remove(null, { query })
    }
  }
}
