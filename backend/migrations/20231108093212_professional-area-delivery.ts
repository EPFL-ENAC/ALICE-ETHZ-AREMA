import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS postgis')
  await knex.schema.alterTable('professional', (table) => {
    table.dropColumns('areaDelivery')
    table.integer('radius').nullable()
    table.jsonb('coordinates').nullable()
    table.geometry('geom').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('professional', (table) => {
    table.dropColumns('radius', 'coordinates', 'geom')
  })
}

