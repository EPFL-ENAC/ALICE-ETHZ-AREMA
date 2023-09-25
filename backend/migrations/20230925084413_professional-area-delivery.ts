import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('professional', (table) => {
    table.jsonb('areaDelivery').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('professional', (table) => {
    table.dropColumns('areaDelivery')
  })
}

