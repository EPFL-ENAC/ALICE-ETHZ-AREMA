// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

/**
 * A hook that expects the data model to have a coordinates and a geom properties. The geom property
 * is an internal field that is used to store the coordinates in a PostGIS compatible format. 
 * @param context 
 */
export const geometries = async (context: HookContext) => {
  
  function getGeomText (coordinates: any) : string | null {
    if (coordinates) {
      if (coordinates.point) {
        return `Point(${coordinates.point[0]} ${coordinates.point[1]})`
      } else if (coordinates.line) {
        return `LineString(${coordinates.line.map((c: any) => `${c[0]} ${c[1]}`).join(',')})`
      } else if (coordinates.polygon) {
        return `Polygon((${coordinates.polygon.map((c: any) => `${c[0]} ${c[1]}`).join(',')})`
      }
    }
    return null
  }

  function applyGeom (data: any) {
    if (data && data.coordinates !== undefined) {
      const text = getGeomText(data.coordinates)
      if (text) {
        const db = context.app.get('postgresqlClient')
        // @ts-ignore
        data.geom = db.postgis.geomFromText(text, 4326)
      } else {
        data.geom = null
      }
    }
  }

  // update 
  if (context.method === 'create' || context.method === 'patch') {
    if (Array.isArray(context.data)) {
      context.data.forEach(applyGeom)
    } else {
      applyGeom(context.data)
    }
  }
}
