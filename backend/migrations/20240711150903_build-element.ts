import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.dropColumns('buildingElementId', 'updatedAt', 'createdAt', 'updatedById', 'createdById')
  })
  await knex.schema.dropTable('building-element')
}


export async function down(knex: Knex): Promise<void> {
}

