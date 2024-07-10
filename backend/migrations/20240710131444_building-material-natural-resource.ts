// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('building-material-natural-resource', (table) => {
    table.increments('id')
    table.bigInteger('buildingMaterialId').notNullable()
    table.bigInteger('naturalResourceId').notNullable()
    table.foreign('buildingMaterialId').references('id').inTable('building-material')
    table.foreign('naturalResourceId').references('id').inTable('natural-resource')
    table.primary(['buildingMaterialId', 'naturalResourceId'])
    
    table.string('updatedAt').nullable() //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createdAt').nullable() //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').nullable().references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').nullable().references('id').inTable('users') //: Type.Number(),
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('building-material-natural-resource')
}
