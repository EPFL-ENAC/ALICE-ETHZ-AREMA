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
  ref?: FileRef;
  url?: string;
  legend?: string;
}

export interface Geometry {
  point?: [number, number];
}

export interface TaxonomyNode {
  id: string;
  names: Record<string, string>;
  descriptions?: Record<string, string>;
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
  published_at?: string;
  assigned_at?: string;
  created_by?: string;
  updated_by?: string;
  published_by?: string;
  assigned_to?: string;

  state?: string;
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
  prosity?: number;
  liquid_transfer_coefficient?: number;
  u?: number;
  effusivity?: number;
  diffusivity?: number;
  absorption_coefficient?: number;
  sound_reduction_index?: number;
  reaction_to_fire?: string;
  fire_resistance_class?: string;
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
  prosity_low?: number;
  liquid_transfer_coefficient_low?: number;
  u_low?: number;
  effusivity_low?: number;
  diffusivity_low?: number;
  absorption_coefficient_low?: number;
  sound_reduction_index_low?: number;
  reaction_to_fire_low?: string;
  fire_resistance_class_low?: string;
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
  prosity_high?: number;
  liquid_transfer_coefficient_high?: number;
  u_high?: number;
  effusivity_high?: number;
  diffusivity_high?: number;
  absorption_coefficient_high?: number;
  sound_reduction_index_high?: number;
  reaction_to_fire_high?: string;
  fire_resistance_class_high?: string;
  air_tightness_high?: number;
}

export interface NaturalResource extends PhysicalEntity {
  type: string;
  files?: FileItem[];
  building_materials?: BuildingMaterial[];
}

export interface BuildingMaterial extends PhysicalEntity {
  types?: string[];
  materials?: string[];
  files?: FileItem[];
  natural_resources?: NaturalResource[];
  technical_constructions?: TechnicalConstruction[];
  buildings?: Building[];
  professionals?: Professional[];

  // draft
  natural_resource_ids?: number[];
}

export interface TechnicalConstruction extends PhysicalEntity {
  types?: string[];
  materials?: string[];
  files?: FileItem[];
  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  buildings?: Building[];

  // draft
  building_material_ids?: number[];
}

export interface BuildingElementMaterial {
  id?: number;
  distance?: number | undefined;
  weight?: number | undefined;

  // draft
  building_element_id?: number;
  building_material_id?: number;
}

export interface BuildingElement {
  id?: number;
  building?: Building;
  technical_construction?: TechnicalConstruction;
  professionals?: Professional[];
  materials?: BuildingElementMaterial[];

  // draft
  building_id?: number | undefined;
  technical_construction_id?: number | undefined;
  professional_ids?: number[];
}

export interface Building extends Entity {
  type?: string;
  status?: string;
  materials?: string[];
  client?: string;
  gross_internal_area?: number;
  year?: number;
  address?: string | undefined;
  long?: number | undefined;
  lat?: number | undefined;
  radius?: number | undefined;
  geom?: Geometry | undefined;
  files?: FileItem[];

  building_materials?: BuildingMaterial[];
  professionals?: Professional[];
  building_elements?: BuildingElement[];

  // draft
  building_material_ids?: number[];
  building_element_ids?: number[];
  professional_ids?: number[];
}

export interface Professional extends Entity {
  types?: string[];
  materials?: string[];
  address?: string | undefined;
  addresses?: string[];
  web?: string;
  tel?: string;
  email?: string;
  long?: number | undefined;
  lat?: number | undefined;
  radius?: number | undefined;
  geom?: Geometry | undefined;
  files?: FileItem[];

  professionals?: Professional[];
  buildings?: Building[];
  building_materials?: BuildingMaterial[];
  technical_constructions?: TechnicalConstruction[];

  // draft
  professional_ids?: number[];
  building_material_ids?: number[];
  technical_construction_ids?: number[];
}

export interface AppUser {
  id?: string;
  username: string;
  email: string;
  email_verified: boolean;
  first_name?: string;
  last_name?: string;
  enabled: boolean;
  totp: boolean;
  roles: string[];
  password?: string;
}

export interface GroupByCount {
  value: string | null;
  count: number;
}

export interface GroupByResult {
  field: string;
  counts: GroupByCount[];
}
