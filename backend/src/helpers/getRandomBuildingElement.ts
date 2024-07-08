import { Application } from '@feathersjs/koa'
import { buildingElementPath, BuildingElement } from '../services/building-element/building-element.shared'

export async function getRandomBuildingElement(app: Application, iterations: number = 1): Promise<BuildingElement> {
  const result = await app.service(buildingElementPath).find({
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
