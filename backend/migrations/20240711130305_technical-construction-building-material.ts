// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('technical-construction-building-material', (table) => {
    table.increments('id')
    table.bigInteger('technicalConstructionId').notNullable()
    table.bigInteger('buildingMaterialId').notNullable()
    table.foreign('technicalConstructionId').references('id').inTable('technical-construction')
    table.foreign('buildingMaterialId').references('id').inTable('building-material')
    table.primary(['technicalConstructionId', 'buildingMaterialId'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('technical-construction-building-material')
}
