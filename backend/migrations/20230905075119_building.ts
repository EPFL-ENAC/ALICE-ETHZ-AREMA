// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('building', (table) => {
    table.increments('id')
    table.string('updatedAt') //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createAt') //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').references('id').inTable('users') //: Type.Number(),

    table.string('name') //: Type.String(),
    table.string('description')
    table.string('address') //: Type.String(), // "wsg84",

    table.specificType('images', 'text[]') //: Type.Array(Type.String()), // url
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('building')
}
