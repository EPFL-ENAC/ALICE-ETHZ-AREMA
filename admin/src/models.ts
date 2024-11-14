export interface FileRef {
  name: string;
  path: string;
  size: number;
  alt_name?: string;
  alt_path?: string;
  alt_size?: number;
}

interface Entity {
  id?: number;
  name: string;
  description?: string;

  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

interface PhysicalEntity extends Entity {
  density?: number;
  compressive_strength?: number;
  tensile_strength?: number;
  youngs_modulus?: number;
  shrinkage?: number;
  settlement?: number;
  thermal_conductivity?: number;
  thermal_capacity?: number;
  vapor_diffusion_resistance?: number;
  moisture_buffering?: number;
  u?: number;
  effusivity?: number;
  diffusivity?: number;
  absorption_coefficient?: number;
  sound_reduction_index?: number;
  reaction_to_fire?: number;
  building_material_class?: number;
  fire_resistance_class?: number;
  air_tightness?: number;

  density_low?: number;
  compressive_strength_low?: number;
  tensile_strength_low?: number;
  youngs_modulus_low?: number;
  shrinkage_low?: number;
  settlement_low?: number;
  thermal_conductivity_low?: number;
  thermal_capacity_low?: number;
  vapor_diffusion_resistance_low?: number;
  moisture_buffering_low?: number;
  u_low?: number;
  effusivity_low?: number;
  diffusivity_low?: number;
  absorption_coefficient_low?: number;
  sound_reduction_index_low?: number;
  reaction_to_fire_low?: number;
  building_material_class_low?: number;
  fire_resistance_class_low?: number;
  air_tightness_low?: number;

  density_high?: number;
  compressive_strength_high?: number;
  tensile_strength_high?: number;
  youngs_modulus_high?: number;
  shrinkage_high?: number;
  settlement_high?: number;
  thermal_conductivity_high?: number;
  thermal_capacity_high?: number;
  vapor_diffusion_resistance_high?: number;
  moisture_buffering_high?: number;
  u_high?: number;
  effusivity_high?: number;
  diffusivity_high?: number;
  absorption_coefficient_high?: number;
  sound_reduction_index_high?: number;
  reaction_to_fire_high?: number;
  building_material_class_high?: number;
  fire_resistance_class_high?: number;
  air_tightness_high?: number;
}

export interface NaturalResource extends PhysicalEntity {
  files?: FileRef[];
  building_materials?: BuildingMaterial[];
}

export interface BuildingMaterial extends PhysicalEntity {
  files?: FileRef[];
  natural_resources?: NaturalResource[];
  technical_constructions?: TechnicalConstruction[];
  buildings?: Building[];
  professionals?: Professional[];
}

export interface TechnicalConstruction extends PhysicalEntity {
  files?: FileRef[];
  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  buildings?: Building[];
}

export interface Building extends PhysicalEntity {
  address?: string;
  long?: number;
  lat?: number;
  geom?: any;
  files?: FileRef[];

  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  technical_constructions?: TechnicalConstruction[];
}

export interface Professional extends Entity {
  type?: string;
  address?: string;
  web?: string;
  tel?: string;
  email?: string;
  long?: number;
  lat?: number;
  geom?: any;
  files?: FileRef[];

  buildings?: Building[];
  building_materials?: BuildingMaterial[];
  technical_constructions?: TechnicalConstruction[];
}

export interface ProfessionalType {
  id: string;
  text: string;
}
