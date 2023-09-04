import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('natural-resource', (table) => {
    table.string('avatar')

    table.string('updatedAt') ; //: Type.Optional(Type.String({ format: 'date-time' })),
    table.string('createAt') ; //: Type.String({ format: 'date-time' }),
    table.bigint('updatedById').references('id').inTable('users') ; //: Type.Optional(Type.Number()),
    table.bigint('createdById').references('id').inTable('users') ; //: Type.Number(),
    table.string('name') ; //: Type.String(),
    table.string('zone') ; //: Type.String(), // "wsg84",
    table.string('dimension') ; //: Type.String(),
    table.integer('amount') ; //: Type.Number(),
    table.specificType('images', 'text[]'); //: Type.Array(Type.String()), // url
  })

}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('natural-resource', (table) => {

table.dropColumn('updatedAt');
table.dropColumn('createAt');
table.dropColumn('updatedById');
table.dropColumn('createdById');
table.dropColumn('name');
table.dropColumn('zone');
table.dropColumn('dimension');
table.dropColumn('amount');
table.dropColumn('images');
  })
}

