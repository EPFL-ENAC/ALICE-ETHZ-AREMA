// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.bigInteger('buildingElementId').notNullable()
 
    table.dropPrimary()
    table.primary(['buildingId', 'professionalId', 'buildingElementId'])

    table.foreign('buildingElementId').references('id').inTable('building-element')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('building-professional')
}
