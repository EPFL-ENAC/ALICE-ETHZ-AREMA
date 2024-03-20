import { Knex } from 'knex'
import { app } from '../src/app'
import { getServiceOptions } from '@feathersjs/feathers'
import { defaultIterations, runAsync } from '../helpers/helper-seed'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('building-element').del()
  // building-element
  const serviceOptions = getServiceOptions(app.service('building-element'))
  await runAsync(
    serviceOptions?.createFake,
    app.service('users')
  )(serviceOptions?.fakerOptions?.iterations ?? defaultIterations)
}
