from typing import List, Optional, Dict
from pydantic import BaseModel
from sqlmodel import Field
from api.models.domain import NaturalResource, NaturalResourceBase, BuildingMaterial, BuildingMaterialBase, TechnicalConstruction, TechnicalConstructionBase, BuildingBase, Professional, ProfessionalBase, BuildingElement, BuildingElementBase, BuildingElementMaterial, BuildingElementMaterialBase
from api.models.authz import ACL
from enacit4r_sql.models.query import ListResult

# Natural resources


class NaturalResourceRead(NaturalResourceBase):
    id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None)


class NaturalResourceResult(ListResult):
    data: List[NaturalResourceRead] = []

# Building materials


class BuildingMaterialDraft(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    natural_resource_ids: List[int] = []


class BuildingMaterialRead(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None)
    natural_resources: List[NaturalResource] = None


class BuildingMaterialResult(ListResult):
    data: List[BuildingMaterialRead] = []

# Technical constructions


class TechnicalConstructionDraft(TechnicalConstructionBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []


class TechnicalConstructionRead(TechnicalConstructionBase):
    id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None)
    building_materials: List[BuildingMaterial] = None


class TechnicalConstructionResult(ListResult):
    data: List[TechnicalConstructionRead] = []

# Building elements


class BuildingElementMaterialDraft(BuildingElementMaterialBase):
    id: Optional[int] = Field(default=None)
    building_element_id: Optional[int] = Field(default=None)
    building_material_id: Optional[int] = Field(default=None)


class BuildingElementMaterialRead(BuildingElementMaterialBase):
    id: Optional[int] = Field(default=None)
    building_element: BuildingElementBase = None
    building_material: BuildingMaterial = None


class BuildingElementMaterialResult(ListResult):
    data: List[BuildingElementMaterialRead] = []


class BuildingElementDraft(BuildingElementBase):
    id: Optional[int] = Field(default=None)
    building_id: Optional[int] = Field(default=None)
    technical_construction_id: Optional[int] = Field(default=None)
    professional_ids: List[int] = None
    materials: List[BuildingElementMaterialDraft] = None


class BuildingElementRead(BuildingElementBase):
    id: Optional[int] = Field(default=None)
    technical_construction: Optional[TechnicalConstruction] = None
    building: Optional[BuildingBase] = None
    professionals: List[Professional] = None
    materials: List[BuildingElementMaterial] = None


class BuildingElementResult(ListResult):
    data: List[BuildingElementRead] = []


# Buildings


class BuildingDraft(BuildingBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []
    professional_ids: List[int] = []
    building_elements: List[BuildingElementDraft] = []


class BuildingRead(BuildingBase):
    id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None)
    building_materials: List[BuildingMaterial] = None
    building_elements: List[BuildingElement] = None
    professionals: List[Professional] = None


class BuildingResult(ListResult):
    data: List[BuildingRead] = []

# Professionals


class ProfessionalDraft(ProfessionalBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []
    technical_construction_ids: List[int] = []


class ProfessionalRead(ProfessionalBase):
    id: Optional[int] = Field(default=None)
    name: Optional[str] = Field(default=None)
    building_materials: List[BuildingMaterial] = None
    technical_constructions: List[TechnicalConstruction] = None


class ProfessionalResult(ListResult):
    data: List[ProfessionalRead] = []


class SearchResult(ListResult):
    data: List[Dict] = []

# Authorization models


class ACLResult(ListResult):
    data: List[ACL] = []


class GroupByCount(BaseModel):
    value: str | None
    count: int


class GroupByResult(BaseModel):
    field: str
    counts: List[GroupByCount]
