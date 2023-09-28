import { Knex } from 'knex'
import { app } from '../src/app'
import { getServiceOptions } from '@feathersjs/feathers'
import { defaultIterations, runAsync } from '../helpers/helper-seed'

export async function seed(knex: Knex): Promise<void> {
  await knex('building-professional').del()
  await knex('professional').del()
  await knex('professional-type').del()
  let serviceOptions
  // Building
  // Deletes ALL existing entries
  serviceOptions = getServiceOptions(app.service('professional-type'))
  await runAsync(
    serviceOptions?.createFake,
    app.service('users')
  )(serviceOptions?.fakerOptions?.iterations ?? defaultIterations)
}
