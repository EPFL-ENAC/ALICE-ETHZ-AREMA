import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building', (table) => {
    table.jsonb('coordinates').nullable()
    table.geometry('geom').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building', (table) => {
    table.dropColumns('coordinates', 'geom')
  })
}

