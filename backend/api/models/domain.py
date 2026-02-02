from typing import List, Dict, Optional
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import JSONB as JSON
from sqlalchemy import TIMESTAMP
from datetime import datetime
from pydantic import BaseModel
from enacit4r_files.models.files import FileRef

# Base classes


class SubjectProfileBase(SQLModel):
    identifier: str = Field(index=True)
    type: str = Field(index=True)
    name: str = Field(index=True)  # Display name
    affiliation: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    web: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    updated_at: datetime = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    published_at: Optional[datetime] = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)


class SubjectProfile(SubjectProfileBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )


class FileItem(BaseModel):
    ref: Optional[FileRef] = Field(default=None)
    url: Optional[str] = Field(default=None)
    legend: Optional[str] = Field(default=None)


class Entity(SQLModel):
    name: str
    description: Optional[str] = Field(default=None)
    article_top: Optional[str] = Field(default=None)
    article_bottom: Optional[str] = Field(default=None)
    side_note: Optional[str] = Field(default=None)
    external_links: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    updated_at: datetime = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    published_at: Optional[datetime] = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    assigned_at: Optional[datetime] = Field(
        sa_column=TIMESTAMP(timezone=True), default=None)
    created_by: Optional[str] = Field(default=None)
    updated_by: Optional[str] = Field(default=None)
    published_by: Optional[str] = Field(default=None)
    assigned_to: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default="draft")


class PhysicalEntity(Entity):
    density: Optional[float] = Field(default=None)
    compressive_strength: Optional[float] = Field(default=None)
    tensile_strength: Optional[float] = Field(default=None)
    youngs_modulus: Optional[float] = Field(default=None)
    shrinkage: Optional[float] = Field(default=None)
    settlement: Optional[float] = Field(default=None)
    thermal_conductivity: Optional[float] = Field(default=None)
    thermal_capacity: Optional[float] = Field(default=None)
    vapor_diffusion_resistance: Optional[float] = Field(default=None)
    moisture_buffering: Optional[float] = Field(default=None)
    porosity: Optional[float] = Field(default=None)
    water_content: Optional[float] = Field(default=None)
    free_saturation: Optional[float] = Field(default=None)
    liquid_transfer_coefficient: Optional[float] = Field(default=None)
    u: Optional[float] = Field(default=None)
    effusivity: Optional[float] = Field(default=None)
    diffusivity: Optional[float] = Field(default=None)
    absorption_coefficient: Optional[float] = Field(default=None)
    sound_reduction_index: Optional[float] = Field(default=None)
    reaction_to_fire: Optional[str] = Field(default=None)
    fire_resistance_class: Optional[str] = Field(default=None)
    air_tightness: Optional[float] = Field(default=None)

    density_low: Optional[float] = Field(default=None)
    compressive_strength_low: Optional[float] = Field(default=None)
    tensile_strength_low: Optional[float] = Field(default=None)
    youngs_modulus_low: Optional[float] = Field(default=None)
    shrinkage_low: Optional[float] = Field(default=None)
    settlement_low: Optional[float] = Field(default=None)
    thermal_conductivity_low: Optional[float] = Field(default=None)
    thermal_capacity_low: Optional[float] = Field(default=None)
    vapor_diffusion_resistance_low: Optional[float] = Field(default=None)
    moisture_buffering_low: Optional[float] = Field(default=None)
    porosity_low: Optional[float] = Field(default=None)
    water_content_low: Optional[float] = Field(default=None)
    free_saturation_low: Optional[float] = Field(default=None)
    liquid_transfer_coefficient_low: Optional[float] = Field(default=None)
    u_low: Optional[float] = Field(default=None)
    effusivity_low: Optional[float] = Field(default=None)
    diffusivity_low: Optional[float] = Field(default=None)
    absorption_coefficient_low: Optional[float] = Field(default=None)
    sound_reduction_index_low: Optional[float] = Field(default=None)
    reaction_to_fire_low: Optional[str] = Field(default=None)
    fire_resistance_class_low: Optional[str] = Field(default=None)
    air_tightness_low: Optional[float] = Field(default=None)

    density_high: Optional[float] = Field(default=None)
    compressive_strength_high: Optional[float] = Field(default=None)
    tensile_strength_high: Optional[float] = Field(default=None)
    youngs_modulus_high: Optional[float] = Field(default=None)
    shrinkage_high: Optional[float] = Field(default=None)
    settlement_high: Optional[float] = Field(default=None)
    thermal_conductivity_high: Optional[float] = Field(default=None)
    thermal_capacity_high: Optional[float] = Field(default=None)
    vapor_diffusion_resistance_high: Optional[float] = Field(default=None)
    moisture_buffering_high: Optional[float] = Field(default=None)
    porosity_high: Optional[float] = Field(default=None)
    water_content_high: Optional[float] = Field(default=None)
    free_saturation_high: Optional[float] = Field(default=None)
    liquid_transfer_coefficient_high: Optional[float] = Field(default=None)
    u_high: Optional[float] = Field(default=None)
    effusivity_high: Optional[float] = Field(default=None)
    diffusivity_high: Optional[float] = Field(default=None)
    absorption_coefficient_high: Optional[float] = Field(default=None)
    sound_reduction_index_high: Optional[float] = Field(default=None)
    reaction_to_fire_high: Optional[str] = Field(default=None)
    fire_resistance_class_high: Optional[str] = Field(default=None)
    air_tightness_high: Optional[float] = Field(default=None)

# Association tables


class BuildingMaterialNaturalResource(SQLModel, table=True):
    building_material_id: Optional[int] = Field(
        default=None, foreign_key="buildingmaterial.id", primary_key=True)
    natural_resource_id: Optional[int] = Field(
        default=None, foreign_key="naturalresource.id", primary_key=True)


class TechnicalConstructionBuildingMaterial(SQLModel, table=True):
    technical_construction_id: Optional[int] = Field(
        default=None, foreign_key="technicalconstruction.id", primary_key=True)
    building_material_id: Optional[int] = Field(
        default=None, foreign_key="buildingmaterial.id", primary_key=True)


class BuildingBuildingMaterial(SQLModel, table=True):
    building_id: Optional[int] = Field(
        default=None, foreign_key="building.id", primary_key=True)
    building_material_id: Optional[int] = Field(
        default=None, foreign_key="buildingmaterial.id", primary_key=True)


class ProfessionalBuilding(SQLModel, table=True):
    professional_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)
    building_id: Optional[int] = Field(
        default=None, foreign_key="building.id", primary_key=True)


class ProfessionalProfessional(SQLModel, table=True):
    professional_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)
    related_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)


class ProfessionalBuildingMaterial(SQLModel, table=True):
    professional_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)
    building_material_id: Optional[int] = Field(
        default=None, foreign_key="buildingmaterial.id", primary_key=True)


class ProfessionalTechnicalConstruction(SQLModel, table=True):
    professional_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)
    technical_construction_id: Optional[int] = Field(
        default=None, foreign_key="technicalconstruction.id", primary_key=True)


class BuildingElementProfessional(SQLModel, table=True):
    building_element_id: Optional[int] = Field(
        default=None, foreign_key="buildingelement.id", primary_key=True)
    professional_id: Optional[int] = Field(
        default=None, foreign_key="professional.id", primary_key=True)


# Domain tables

# Natural resources


class NaturalResourceBase(PhysicalEntity):
    type: str
    files: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    authors: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class NaturalResource(NaturalResourceBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: List["BuildingMaterial"] = Relationship(
        back_populates="natural_resources", link_model=BuildingMaterialNaturalResource)

# Building materials


class BuildingMaterialBase(PhysicalEntity):
    types: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    materials: Optional[List[str]] = Field(
        default=None, sa_column=Column(JSON))
    files: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    authors: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class BuildingMaterial(BuildingMaterialBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    natural_resources: List["NaturalResource"] = Relationship(
        back_populates="building_materials", link_model=BuildingMaterialNaturalResource)
    technical_constructions: List["TechnicalConstruction"] = Relationship(
        back_populates="building_materials", link_model=TechnicalConstructionBuildingMaterial)
    buildings: List["Building"] = Relationship(
        back_populates="building_materials", link_model=BuildingBuildingMaterial)
    professionals: List["Professional"] = Relationship(
        back_populates="building_materials", link_model=ProfessionalBuildingMaterial)

# Technical constructions


class TechnicalConstructionBase(PhysicalEntity):
    types: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    materials: Optional[List[str]] = Field(
        default=None, sa_column=Column(JSON))
    files: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    authors: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class TechnicalConstruction(TechnicalConstructionBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: List["BuildingMaterial"] = Relationship(
        back_populates="technical_constructions", link_model=TechnicalConstructionBuildingMaterial)
    professionals: List["Professional"] = Relationship(
        back_populates="technical_constructions", link_model=ProfessionalTechnicalConstruction)
    building_elements: List["BuildingElement"] = Relationship(
        back_populates="technical_construction", cascade_delete=True)

# Building elements


class BuildingElementBase(SQLModel):
    building_id: Optional[int] = Field(
        default=None, foreign_key="building.id", ondelete="CASCADE")
    technical_construction_id: Optional[int] = Field(
        default=None, foreign_key="technicalconstruction.id", ondelete="CASCADE")


class BuildingElement(BuildingElementBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    technical_construction: Optional["TechnicalConstruction"] = Relationship(
        back_populates="building_elements")
    building: Optional["Building"] = Relationship(
        back_populates="building_elements")
    professionals: List["Professional"] = Relationship(
        back_populates="building_elements", link_model=BuildingElementProfessional)
    materials: List["BuildingElementMaterial"] = Relationship(
        back_populates="building_element", cascade_delete=True)


class BuildingElementMaterialBase(SQLModel):
    distance: Optional[float] = Field(default=None)
    weight: Optional[float] = Field(default=None)
    building_element_id: Optional[int] = Field(
        default=None, foreign_key="buildingelement.id", ondelete="CASCADE")
    building_material_id: Optional[int] = Field(
        default=None, foreign_key="buildingmaterial.id", ondelete="CASCADE")


class BuildingElementMaterial(BuildingElementMaterialBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_element: Optional["BuildingElement"] = Relationship(
        back_populates="materials")

# Buildings


class BuildingBase(Entity):
    type: str
    status: Optional[str] = Field(default=None)
    materials: Optional[List[str]] = Field(
        default=None, sa_column=Column(JSON))
    client: Optional[str] = Field(default=None)
    gross_internal_area: Optional[float] = Field(default=None)
    year: Optional[int] = Field(default=None)
    address: Optional[str] = Field(default=None)
    long: Optional[float] = Field(default=None)
    lat: Optional[float] = Field(default=None)
    geom: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
    files: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    authors: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class Building(BuildingBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: List["BuildingMaterial"] = Relationship(
        back_populates="buildings", link_model=BuildingBuildingMaterial)
    professionals: List["Professional"] = Relationship(
        back_populates="buildings", link_model=ProfessionalBuilding)
    building_elements: List["BuildingElement"] = Relationship(
        back_populates="building", cascade_delete=True)

# Professionals


class ProfessionalBase(Entity):
    types: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    materials: Optional[List[str]] = Field(
        default=None, sa_column=Column(JSON))
    address: Optional[str] = Field(default=None)
    addresses: Optional[List[str]] = Field(
        default=None, sa_column=Column(JSON))
    web: Optional[str] = Field(default=None)
    tel: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    long: Optional[float] = Field(default=None)
    lat: Optional[float] = Field(default=None)
    radius: Optional[int] = Field(default=None)
    geom: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
    files: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    authors: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class Professional(ProfessionalBase, table=True):
    id: Optional[int] = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    # Related professionals (e.g., partners, subsidiaries)
    professionals: List["Professional"] = Relationship(
        back_populates="parent_professionals",
        link_model=ProfessionalProfessional,
        sa_relationship_kwargs={
            "primaryjoin": "Professional.id==ProfessionalProfessional.professional_id",
            "secondaryjoin": "Professional.id==ProfessionalProfessional.related_id",
        }
    )
    # Reverse relationship (who links TO this professional)
    parent_professionals: List["Professional"] = Relationship(
        back_populates="professionals",
        link_model=ProfessionalProfessional,
        sa_relationship_kwargs={
            "primaryjoin": "Professional.id==ProfessionalProfessional.related_id",
            "secondaryjoin": "Professional.id==ProfessionalProfessional.professional_id",
        }
    )
    buildings: List["Building"] = Relationship(
        back_populates="professionals", link_model=ProfessionalBuilding)
    building_materials: List["BuildingMaterial"] = Relationship(
        back_populates="professionals", link_model=ProfessionalBuildingMaterial)
    technical_constructions: List["TechnicalConstruction"] = Relationship(
        back_populates="professionals", link_model=ProfessionalTechnicalConstruction)
    building_elements: List["BuildingElement"] = Relationship(
        back_populates="professionals", link_model=BuildingElementProfessional)
