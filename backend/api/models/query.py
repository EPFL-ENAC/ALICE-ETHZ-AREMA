from enacit4r_sql.models.query import ListResult
from pydantic import BaseModel
from sqlmodel import Field

from api.models.authz import ACL
from api.models.domain import (
    BuildingBase,
    BuildingElement,
    BuildingElementBase,
    BuildingElementMaterial,
    BuildingElementMaterialBase,
    BuildingMaterial,
    BuildingMaterialBase,
    NaturalResource,
    NaturalResourceBase,
    Professional,
    ProfessionalBase,
    SubjectProfileBase,
    TechnicalConstruction,
    TechnicalConstructionBase,
)

# Subject profiles


class SubjectProfileDraft(SubjectProfileBase):
    identifier: str | None = Field(default=None)


class SubjectProfileRead(SubjectProfileDraft):
    id: int | None = None


class SubjectProfileResult(ListResult):
    data: list[SubjectProfileRead] = []


# Natural resources


class NaturalResourceRead(NaturalResourceBase):
    id: int | None = Field(default=None)
    name: str | None = Field(default=None)
    type: str | None = Field(default=None)


class NaturalResourceResult(ListResult):
    data: list[NaturalResourceRead] = []


# Building materials


class BuildingMaterialDraft(BuildingMaterialBase):
    id: int | None = Field(default=None)
    natural_resource_ids: list[int] = []


class BuildingMaterialRead(BuildingMaterialBase):
    id: int | None = Field(default=None)
    name: str | None = Field(default=None)
    natural_resources: list[NaturalResource] = None


class BuildingMaterialResult(ListResult):
    data: list[BuildingMaterialRead] = []


# Technical constructions


class TechnicalConstructionDraft(TechnicalConstructionBase):
    id: int | None = Field(default=None)
    building_material_ids: list[int] = []


class TechnicalConstructionRead(TechnicalConstructionBase):
    id: int | None = Field(default=None)
    name: str | None = Field(default=None)
    type: str | None = Field(default=None)
    building_materials: list[BuildingMaterial] = None


class TechnicalConstructionResult(ListResult):
    data: list[TechnicalConstructionRead] = []


# Building elements


class BuildingElementMaterialDraft(BuildingElementMaterialBase):
    id: int | None = Field(default=None)
    building_element_id: int | None = Field(default=None)
    building_material_id: int | None = Field(default=None)


class BuildingElementMaterialRead(BuildingElementMaterialBase):
    id: int | None = Field(default=None)
    building_element: BuildingElementBase = None
    building_material: BuildingMaterial = None


class BuildingElementMaterialResult(ListResult):
    data: list[BuildingElementMaterialRead] = []


class BuildingElementDraft(BuildingElementBase):
    id: int | None = Field(default=None)
    building_id: int | None = Field(default=None)
    technical_construction_id: int | None = Field(default=None)
    professional_ids: list[int] = None
    materials: list[BuildingElementMaterialDraft] = None


class BuildingElementRead(BuildingElementBase):
    id: int | None = Field(default=None)
    technical_construction: TechnicalConstruction | None = None
    building: BuildingBase | None = None
    professionals: list[Professional] = None
    materials: list[BuildingElementMaterial] = None


class BuildingElementResult(ListResult):
    data: list[BuildingElementRead] = []


# Buildings


class BuildingDraft(BuildingBase):
    id: int | None = Field(default=None)
    building_material_ids: list[int] = []
    professional_ids: list[int] = []
    building_elements: list[BuildingElementDraft] = []


class BuildingRead(BuildingBase):
    id: int | None = Field(default=None)
    name: str | None = Field(default=None)
    type: str | None = Field(default=None)
    building_materials: list[BuildingMaterial] = None
    building_elements: list[BuildingElement] = None
    professionals: list[Professional] = None


class BuildingResult(ListResult):
    data: list[BuildingRead] = []


# Professionals


class ProfessionalDraft(ProfessionalBase):
    id: int | None = Field(default=None)
    professional_ids: list[int] = []
    building_material_ids: list[int] = []
    technical_construction_ids: list[int] = []


class ProfessionalBaseRead(ProfessionalBase):
    id: int | None = Field(default=None)
    name: str | None = Field(default=None)


class ProfessionalRead(ProfessionalBaseRead):
    building_materials: list[BuildingMaterial] = None
    technical_constructions: list[TechnicalConstruction] = None
    professionals: list["ProfessionalBaseRead"] = None


class ProfessionalResult(ListResult):
    data: list[ProfessionalRead] = []


class SearchResult(ListResult):
    data: list[dict] = []


# Authorization models


class ACLResult(ListResult):
    data: list[ACL] = []


class GroupByCount(BaseModel):
    value: str | None
    count: int


class GroupByResult(BaseModel):
    field: str
    counts: list[GroupByCount]
