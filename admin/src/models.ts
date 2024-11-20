export interface FileRef {
  name: string;
  path: string;
  size: number;
  mime_type: string;
  alt_name?: string;
  alt_path?: string;
  alt_size?: number;
  alt_mime_type?: string;
}

export interface FileItem {
  ref: FileRef;
  legend?: string;
}

export interface Geometry {
  point?: [number, number];
}

export interface TaxonomyLabel {
  locale: string;
  label: string;
}

export interface TaxonomyNode {
  id: string;
  name: TaxonomyLabel[];
  description?: TaxonomyLabel[];
  children?: TaxonomyNode[];
}

export interface Taxonomy {
  taxonomy: TaxonomyNode[];
}

export interface Entity {
  id?: number;
  name: string;
  description?: string;
  article_top?: string;
  article_bottom?: string;
  side_note?: string;
  external_links?: string;

  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface PhysicalEntity extends Entity {
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
  files?: FileItem[];
  building_materials?: BuildingMaterial[];
}

export interface BuildingMaterial extends PhysicalEntity {
  files?: FileItem[];
  natural_resources?: NaturalResource[];
  technical_constructions?: TechnicalConstruction[];
  buildings?: Building[];
  professionals?: Professional[];

  // draft
  natural_resource_ids?: number[];
}

export interface TechnicalConstruction extends PhysicalEntity {
  files?: FileItem[];
  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  buildings?: Building[];

  // draft
  building_material_ids?: number[];
}

export interface Building extends Entity {
  address?: string;
  long?: number;
  lat?: number;
  radius?: number;
  geom?: Geometry;
  files?: FileItem[];

  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  technical_constructions?: TechnicalConstruction[];

  // draft
  building_material_ids?: number[];
  technical_construction_ids?: number[];
  professional_ids?: number[];
}

export interface Professional extends Entity {
  types?: string[];
  address?: string;
  web?: string;
  tel?: string;
  email?: string;
  long?: number;
  lat?: number;
  radius?: number;
  geom?: Geometry;
  files?: FileItem[];

  buildings?: Building[];
  building_materials?: BuildingMaterial[];
  technical_constructions?: TechnicalConstruction[];

  // draft
  building_material_ids?: number[];
  technical_construction_ids?: number[];
}
