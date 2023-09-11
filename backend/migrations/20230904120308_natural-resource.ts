// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('natural-resource', (table) => {
    table.increments('id')

    table.string('description').nullable()
    table.string('updatedAt').nullable() //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createdAt').nullable() //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').nullable().references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').nullable().references('id').inTable('users') //: Type.Number(),
    table.string('name').nullable() //: Type.String(),
    table.string('zone').nullable() //: Type.String(), // "wsg84",
    table.string('dimension').nullable() //: Type.String(),
    table.integer('amount').nullable() //: Type.Number(),
    table.specificType('images', 'text[]').nullable() //: Type.Array(Type.String()), // url
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('natural-resource')
}
