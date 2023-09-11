// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('building', (table) => {
    table.increments('id')
    table.string('updatedAt').nullable() //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createdAt') //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').nullable().references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').references('id').inTable('users') //: Type.Number(),

    table.string('name') //: Type.String(),
    table.string('description').nullable()
    table.string('address').nullable() //: Type.String(), // "wsg84",

    table.specificType('images', 'text[]').nullable() //: Type.Array(Type.String()), // url
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('building')
}
