// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.string('updatedAt').nullable() //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createdAt').nullable() //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').nullable().references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').references('id').inTable('users') //: Type.Number(),
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('building-professional', (table) => {
    table.dropColumns('updatedAt', 'createdAt', 'updatedById', 'createdById');
  })
}
