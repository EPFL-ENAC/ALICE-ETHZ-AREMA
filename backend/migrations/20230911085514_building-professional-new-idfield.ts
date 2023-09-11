// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.increments('id', {primaryKey: false})
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.dropColumns('id');
  })
}
