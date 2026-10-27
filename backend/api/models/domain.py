from datetime import datetime
from typing import Optional

from enacit4r_files.models.files import FileRef
from pydantic import BaseModel
from sqlalchemy import TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB as JSON
from sqlmodel import Column, Field, Relationship, SQLModel

# Base classes


class SubjectProfileBase(SQLModel):
    identifier: str = Field(index=True)
    type: str = Field(index=True)
    name: str = Field(index=True)  # Display name
    affiliation: str | None = Field(default=None)
    description: str | None = Field(default=None)
    email: str | None = Field(default=None)
    web: str | None = Field(default=None)
    created_at: datetime = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    updated_at: datetime = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    published_at: datetime | None = Field(sa_column=TIMESTAMP(timezone=True), default=None)


class SubjectProfile(SubjectProfileBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )


class FileItem(BaseModel):
    ref: FileRef | None = Field(default=None)
    url: str | None = Field(default=None)
    legend: str | None = Field(default=None)


class Entity(SQLModel):
    name: str
    description: str | None = Field(default=None)
    article_top: str | None = Field(default=None)
    article_bottom: str | None = Field(default=None)
    side_note: str | None = Field(default=None)
    external_links: str | None = Field(default=None)
    created_at: datetime = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    updated_at: datetime = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    published_at: datetime | None = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    assigned_at: datetime | None = Field(sa_column=TIMESTAMP(timezone=True), default=None)
    created_by: str | None = Field(default=None)
    updated_by: str | None = Field(default=None)
    published_by: str | None = Field(default=None)
    assigned_to: str | None = Field(default=None)
    state: str | None = Field(default="draft")
    source: str | None = Field(default=None)


class PhysicalEntity(Entity):
    density: float | None = Field(default=None)
    compressive_strength: float | None = Field(default=None)
    tensile_strength: float | None = Field(default=None)
    youngs_modulus: float | None = Field(default=None)
    shrinkage: float | None = Field(default=None)
    settlement: float | None = Field(default=None)
    thermal_conductivity: float | None = Field(default=None)
    thermal_capacity: float | None = Field(default=None)
    vapor_diffusion_resistance: float | None = Field(default=None)
    moisture_buffering: float | None = Field(default=None)
    porosity: float | None = Field(default=None)
    water_content: float | None = Field(default=None)
    free_saturation: float | None = Field(default=None)
    liquid_transfer_coefficient: float | None = Field(default=None)
    u: float | None = Field(default=None)
    effusivity: float | None = Field(default=None)
    diffusivity: float | None = Field(default=None)
    absorption_coefficient: float | None = Field(default=None)
    sound_reduction_index: float | None = Field(default=None)
    reaction_to_fire: str | None = Field(default=None)
    fire_resistance_class: str | None = Field(default=None)
    air_tightness: float | None = Field(default=None)

    density_low: float | None = Field(default=None)
    compressive_strength_low: float | None = Field(default=None)
    tensile_strength_low: float | None = Field(default=None)
    youngs_modulus_low: float | None = Field(default=None)
    shrinkage_low: float | None = Field(default=None)
    settlement_low: float | None = Field(default=None)
    thermal_conductivity_low: float | None = Field(default=None)
    thermal_capacity_low: float | None = Field(default=None)
    vapor_diffusion_resistance_low: float | None = Field(default=None)
    moisture_buffering_low: float | None = Field(default=None)
    porosity_low: float | None = Field(default=None)
    water_content_low: float | None = Field(default=None)
    free_saturation_low: float | None = Field(default=None)
    liquid_transfer_coefficient_low: float | None = Field(default=None)
    u_low: float | None = Field(default=None)
    effusivity_low: float | None = Field(default=None)
    diffusivity_low: float | None = Field(default=None)
    absorption_coefficient_low: float | None = Field(default=None)
    sound_reduction_index_low: float | None = Field(default=None)
    reaction_to_fire_low: str | None = Field(default=None)
    fire_resistance_class_low: str | None = Field(default=None)
    air_tightness_low: float | None = Field(default=None)

    density_high: float | None = Field(default=None)
    compressive_strength_high: float | None = Field(default=None)
    tensile_strength_high: float | None = Field(default=None)
    youngs_modulus_high: float | None = Field(default=None)
    shrinkage_high: float | None = Field(default=None)
    settlement_high: float | None = Field(default=None)
    thermal_conductivity_high: float | None = Field(default=None)
    thermal_capacity_high: float | None = Field(default=None)
    vapor_diffusion_resistance_high: float | None = Field(default=None)
    moisture_buffering_high: float | None = Field(default=None)
    porosity_high: float | None = Field(default=None)
    water_content_high: float | None = Field(default=None)
    free_saturation_high: float | None = Field(default=None)
    liquid_transfer_coefficient_high: float | None = Field(default=None)
    u_high: float | None = Field(default=None)
    effusivity_high: float | None = Field(default=None)
    diffusivity_high: float | None = Field(default=None)
    absorption_coefficient_high: float | None = Field(default=None)
    sound_reduction_index_high: float | None = Field(default=None)
    reaction_to_fire_high: str | None = Field(default=None)
    fire_resistance_class_high: str | None = Field(default=None)
    air_tightness_high: float | None = Field(default=None)


# Association tables


class BuildingMaterialNaturalResource(SQLModel, table=True):
    building_material_id: int | None = Field(default=None, foreign_key="buildingmaterial.id", primary_key=True)
    natural_resource_id: int | None = Field(default=None, foreign_key="naturalresource.id", primary_key=True)


class TechnicalConstructionBuildingMaterial(SQLModel, table=True):
    technical_construction_id: int | None = Field(
        default=None, foreign_key="technicalconstruction.id", primary_key=True
    )
    building_material_id: int | None = Field(default=None, foreign_key="buildingmaterial.id", primary_key=True)


class BuildingBuildingMaterial(SQLModel, table=True):
    building_id: int | None = Field(default=None, foreign_key="building.id", primary_key=True)
    building_material_id: int | None = Field(default=None, foreign_key="buildingmaterial.id", primary_key=True)


class ProfessionalBuilding(SQLModel, table=True):
    professional_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)
    building_id: int | None = Field(default=None, foreign_key="building.id", primary_key=True)


class ProfessionalProfessional(SQLModel, table=True):
    professional_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)
    related_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)


class ProfessionalBuildingMaterial(SQLModel, table=True):
    professional_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)
    building_material_id: int | None = Field(default=None, foreign_key="buildingmaterial.id", primary_key=True)


class ProfessionalTechnicalConstruction(SQLModel, table=True):
    professional_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)
    technical_construction_id: int | None = Field(
        default=None, foreign_key="technicalconstruction.id", primary_key=True
    )


class BuildingElementProfessional(SQLModel, table=True):
    building_element_id: int | None = Field(default=None, foreign_key="buildingelement.id", primary_key=True)
    professional_id: int | None = Field(default=None, foreign_key="professional.id", primary_key=True)


# Domain tables

# Natural resources


class NaturalResourceBase(PhysicalEntity):
    type: str
    files: list[dict] | None = Field(default=None, sa_column=Column(JSON))
    authors: list[str] | None = Field(default=None, sa_column=Column(JSON))
    related_sources: list[str] | None = Field(default=None, sa_column=Column(JSON))


class NaturalResource(NaturalResourceBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: list["BuildingMaterial"] = Relationship(
        back_populates="natural_resources", link_model=BuildingMaterialNaturalResource
    )


# Building materials


class BuildingMaterialBase(PhysicalEntity):
    types: list[str] | None = Field(default=None, sa_column=Column(JSON))
    materials: list[str] | None = Field(default=None, sa_column=Column(JSON))
    files: list[dict] | None = Field(default=None, sa_column=Column(JSON))
    authors: list[str] | None = Field(default=None, sa_column=Column(JSON))
    related_sources: list[str] | None = Field(default=None, sa_column=Column(JSON))


class BuildingMaterial(BuildingMaterialBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    natural_resources: list["NaturalResource"] = Relationship(
        back_populates="building_materials", link_model=BuildingMaterialNaturalResource
    )
    technical_constructions: list["TechnicalConstruction"] = Relationship(
        back_populates="building_materials", link_model=TechnicalConstructionBuildingMaterial
    )
    buildings: list["Building"] = Relationship(back_populates="building_materials", link_model=BuildingBuildingMaterial)
    professionals: list["Professional"] = Relationship(
        back_populates="building_materials", link_model=ProfessionalBuildingMaterial
    )


# Technical constructions


class TechnicalConstructionBase(PhysicalEntity):
    types: list[str] | None = Field(default=None, sa_column=Column(JSON))
    materials: list[str] | None = Field(default=None, sa_column=Column(JSON))
    files: list[dict] | None = Field(default=None, sa_column=Column(JSON))
    authors: list[str] | None = Field(default=None, sa_column=Column(JSON))
    related_sources: list[str] | None = Field(default=None, sa_column=Column(JSON))


class TechnicalConstruction(TechnicalConstructionBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: list["BuildingMaterial"] = Relationship(
        back_populates="technical_constructions", link_model=TechnicalConstructionBuildingMaterial
    )
    professionals: list["Professional"] = Relationship(
        back_populates="technical_constructions", link_model=ProfessionalTechnicalConstruction
    )
    building_elements: list["BuildingElement"] = Relationship(
        back_populates="technical_construction", cascade_delete=True
    )


# Building elements


class BuildingElementBase(SQLModel):
    building_id: int | None = Field(default=None, foreign_key="building.id", ondelete="CASCADE")
    technical_construction_id: int | None = Field(
        default=None, foreign_key="technicalconstruction.id", ondelete="CASCADE"
    )
    # Technical construction type that applies to this element (leaf of urn:arema:technical-construction:type)
    type: str | None = Field(default=None)


class BuildingElement(BuildingElementBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    technical_construction: Optional["TechnicalConstruction"] = Relationship(back_populates="building_elements")
    building: Optional["Building"] = Relationship(back_populates="building_elements")
    professionals: list["Professional"] = Relationship(
        back_populates="building_elements", link_model=BuildingElementProfessional
    )
    materials: list["BuildingElementMaterial"] = Relationship(back_populates="building_element", cascade_delete=True)


class BuildingElementMaterialBase(SQLModel):
    distance: float | None = Field(default=None)
    weight: float | None = Field(default=None)
    building_element_id: int | None = Field(default=None, foreign_key="buildingelement.id", ondelete="CASCADE")
    building_material_id: int | None = Field(default=None, foreign_key="buildingmaterial.id", ondelete="CASCADE")


class BuildingElementMaterial(BuildingElementMaterialBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_element: Optional["BuildingElement"] = Relationship(back_populates="materials")


# Buildings


class BuildingBase(Entity):
    type: str
    status: str | None = Field(default=None)
    materials: list[str] | None = Field(default=None, sa_column=Column(JSON))
    client: str | None = Field(default=None)
    gross_internal_area: float | None = Field(default=None)
    year: int | None = Field(default=None)
    address: str | None = Field(default=None)
    long: float | None = Field(default=None)
    lat: float | None = Field(default=None)
    geom: dict | None = Field(default=None, sa_column=Column(JSON))
    files: list[dict] | None = Field(default=None, sa_column=Column(JSON))
    authors: list[str] | None = Field(default=None, sa_column=Column(JSON))
    related_sources: list[str] | None = Field(default=None, sa_column=Column(JSON))


class Building(BuildingBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    building_materials: list["BuildingMaterial"] = Relationship(
        back_populates="buildings", link_model=BuildingBuildingMaterial
    )
    professionals: list["Professional"] = Relationship(back_populates="buildings", link_model=ProfessionalBuilding)
    building_elements: list["BuildingElement"] = Relationship(back_populates="building", cascade_delete=True)


# Professionals


class ProfessionalBase(Entity):
    types: list[str] | None = Field(default=None, sa_column=Column(JSON))
    materials: list[str] | None = Field(default=None, sa_column=Column(JSON))
    address: str | None = Field(default=None)
    addresses: list[str] | None = Field(default=None, sa_column=Column(JSON))
    web: str | None = Field(default=None)
    tel: str | None = Field(default=None)
    email: str | None = Field(default=None)
    long: float | None = Field(default=None)
    lat: float | None = Field(default=None)
    radius: int | None = Field(default=None)
    geom: dict | None = Field(default=None, sa_column=Column(JSON))
    files: list[dict] | None = Field(default=None, sa_column=Column(JSON))
    authors: list[str] | None = Field(default=None, sa_column=Column(JSON))
    related_sources: list[str] | None = Field(default=None, sa_column=Column(JSON))


class Professional(ProfessionalBase, table=True):
    id: int | None = Field(
        default=None,
        nullable=False,
        primary_key=True,
        index=True,
    )
    # Related professionals (e.g., partners, subsidiaries)
    professionals: list["Professional"] = Relationship(
        back_populates="parent_professionals",
        link_model=ProfessionalProfessional,
        sa_relationship_kwargs={
            "primaryjoin": "Professional.id==ProfessionalProfessional.professional_id",
            "secondaryjoin": "Professional.id==ProfessionalProfessional.related_id",
        },
    )
    # Reverse relationship (who links TO this professional)
    parent_professionals: list["Professional"] = Relationship(
        back_populates="professionals",
        link_model=ProfessionalProfessional,
        sa_relationship_kwargs={
            "primaryjoin": "Professional.id==ProfessionalProfessional.related_id",
            "secondaryjoin": "Professional.id==ProfessionalProfessional.professional_id",
        },
    )
    buildings: list["Building"] = Relationship(back_populates="professionals", link_model=ProfessionalBuilding)
    building_materials: list["BuildingMaterial"] = Relationship(
        back_populates="professionals", link_model=ProfessionalBuildingMaterial
    )
    technical_constructions: list["TechnicalConstruction"] = Relationship(
        back_populates="professionals", link_model=ProfessionalTechnicalConstruction
    )
    building_elements: list["BuildingElement"] = Relationship(
        back_populates="professionals", link_model=BuildingElementProfessional
    )
