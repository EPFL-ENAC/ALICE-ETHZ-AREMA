import { Application } from "@feathersjs/koa";
import { User, userPath } from "../services/users/users.shared";

export async function getRandomUser(app: Application, iterations: number = 1): Promise<User> {
  const users = await app.service(userPath).find({query: {
    $limit: 1,
    $skip: Math.floor(Math.random() * iterations),
    $sort: {
      "id": -1 // random order
    }
  }});
  return  users.data[0]
}