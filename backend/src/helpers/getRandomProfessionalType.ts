import { Application } from '@feathersjs/koa'
import { professionalTypePath, ProfessionalType } from '../services/professional-type/professional-type.shared'

export async function getRandomProfessionalType(app: Application, iterations: number = 1): Promise<ProfessionalType> {
  const result = await app.service(professionalTypePath).find({
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
