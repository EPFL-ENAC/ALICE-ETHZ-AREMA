// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const tcBmRelation = async (context: HookContext) => {
  if (context.method === 'remove' && context.id !== undefined) {
    const service = context.app.service('technical-construction-building-material')
    let query = null
    // TODO case of remove an array of items
    if (context.path === 'building-material') {
      query = { buildingMaterialId: parseInt(context.id.toString()) }
    } else if (context.path === 'technical-construction') {
      query = { technicalConstructionId: parseInt(context.id.toString()) }
    }
    if (query) {
      await service.remove(null, { query })
    }
  }
}
