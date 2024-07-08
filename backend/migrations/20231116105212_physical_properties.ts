import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  function addColumns(table: Knex.CreateTableBuilder, columns: string[]) {
    columns.forEach(column => {
      table.integer(column).nullable()
    })
  }

  const physicalProperties = ['density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance']

  await knex.schema.alterTable('natural-resource', (table) => {
    table.dropColumns('zone', 'dimension', 'amount')
    addColumns(table, physicalProperties)
  })
  await knex.schema.alterTable('building-material', (table) => {
    table.dropColumn('text')
    table.string('name').nullable()
    table.string('description').nullable()
    addColumns(table, physicalProperties)
  })
  await knex.schema.alterTable('technical-construction', (table) => {
    table.dropColumn('text')
    table.string('name').nullable()
    table.string('description').nullable()
    addColumns(table, physicalProperties)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('natural-resource', (table) => {
    table.dropColumns('density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance')
  })
  await knex.schema.alterTable('building-material', (table) => {
    table.dropColumns('name', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance')
  })
  await knex.schema.alterTable('technical-construction', (table) => {
    table.dropColumns('name', 'description', 'density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index', 'fire_resistance')
  })
}

