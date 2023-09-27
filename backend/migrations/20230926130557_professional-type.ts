import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('professional-type', (table) => {
    table.string('text').alter().unique().notNullable()
    table.string('updatedAt').nullable() //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createdAt').nullable() //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').nullable().references('id').inTable('users') //: Type.Optional(Type.Number()),
    table.bigint('createdById').references('id').inTable('users') //: Type.Number(),
  })
  await knex.schema.alterTable('professional', (table) => {
    table.bigint('professionalTypeId').references('id').inTable('professional-type') //: Type.Number(),
    table.string('web').nullable()
    table.string('tel').nullable()
    table.string('email').nullable()
    table.specificType('links', 'text[]').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('professional-type', (table) => {
    table.dropColumns('updatedAt', 'createdAt', 'updatedById', 'createdById')
  })
  await knex.schema.alterTable('professional', (table) => {
    table.dropColumns('professionalTypeId', 'web', 'tel', 'email')
  })
}

