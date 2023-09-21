// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('building-professional', (table) => {
    table.bigInteger('buildingId').notNullable()
    table.bigInteger('professionalId').notNullable()

    table.primary(['buildingId', 'professionalId'])

    table.foreign('buildingId').references('id').inTable('building')

    table.foreign('professionalId').references('id').inTable('professional')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('building-professional')
}
