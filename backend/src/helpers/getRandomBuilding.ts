import { Application } from '@feathersjs/koa'
import { buildingPath, Building } from '../services/building/building.shared'

export async function getRandomBuilding(app: Application, iterations: number = 1): Promise<Building> {
  const result = await app.service(buildingPath).find({
    query: {
      $limit: 1,
      $skip: Math.floor(Math.random() * iterations),
      $sort: {
        id: -1 // random order
      }
    }
  })
  return result.data[0]
}
