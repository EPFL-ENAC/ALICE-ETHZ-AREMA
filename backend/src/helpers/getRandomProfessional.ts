import { Application } from '@feathersjs/koa'
import { professionalPath, Professional } from '../services/professional/professional.shared'

export async function getRandomProfessional(app: Application, iterations: number = 1): Promise<Professional> {
  const result = await app.service(professionalPath).find({
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
