import { Knex } from "knex";

const physicalProperties = ['density', 'compressive_strength', 'tensile_strength', 'youngs_modulus', 'shrinkage', 'settlement', 'thermal_conductivity', 'thermal_capacity', 'vapor_diffusion_resistance', 'moisture_buffering', 'u', 'effusivity', 'diffusivity', 'absorption_coefficient', 'sound_reduction_index']

const additionalProperties = ['reaction_to_fire', 'building_material_class', 'fire_resistance_class', 'air_tightness']

export async function up(knex: Knex): Promise<void> {

  function addColumns(table: Knex.CreateTableBuilder, columns: string[]) {
    columns.forEach(column => {
      table.float(column).nullable()
    })
  }

  function addLowHighColumns(table: Knex.CreateTableBuilder, columns: string[]) {
    columns.forEach(column => {
      table.float(`${column}_low`).nullable()
      table.float(`${column}_high`).nullable()
    })
  }

  function alterColumns(table: Knex.CreateTableBuilder, columns: string[]) {
    columns.forEach(column => {
      table.float(column).alter()
    })
  }

  await knex.schema.alterTable('natural-resource', (table) => {
    table.dropColumns('fire_resistance')
    alterColumns(table, physicalProperties)
    addColumns(table, additionalProperties)
    addLowHighColumns(table, [...physicalProperties, ...additionalProperties])
  })
  await knex.schema.alterTable('building-material', (table) => {
    table.dropColumns('fire_resistance')
    alterColumns(table, physicalProperties)
    addColumns(table, additionalProperties)
    addLowHighColumns(table, [...physicalProperties, ...additionalProperties])
  })
  await knex.schema.alterTable('technical-construction', (table) => {
    table.dropColumns('fire_resistance')
    alterColumns(table, physicalProperties)
    addColumns(table, additionalProperties)
    addLowHighColumns(table, [...physicalProperties, ...additionalProperties])
  })
}

export async function down(knex: Knex): Promise<void> {
  const allProps = [...physicalProperties, ...additionalProperties]
  const lowProps = allProps.map((p) => `${p}_low`)
  const highProps = allProps.map((p) => `${p}_high`)
  
  await knex.schema.alterTable('natural-resource', (table) => {
    table.dropColumns(...additionalProperties)
    table.dropColumns(...lowProps)
    table.dropColumns(...highProps)
  })
  await knex.schema.alterTable('building-material', (table) => {
    table.dropColumns(...additionalProperties)
    table.dropColumns(...lowProps)
    table.dropColumns(...highProps)
  })
  await knex.schema.alterTable('technical-construction', (table) => {
    table.dropColumns(...additionalProperties)
    table.dropColumns(...lowProps)
    table.dropColumns(...highProps)
  })
}

