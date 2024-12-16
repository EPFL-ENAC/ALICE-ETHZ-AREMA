from typing import List, Optional, Dict
from sqlmodel import Field
from api.models.domain import NaturalResource, NaturalResourceBase, BuildingMaterial, BuildingMaterialBase, TechnicalConstruction, TechnicalConstructionBase, BuildingBase, Professional, ProfessionalBase, BuildingElement, BuildingElementBase
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


class BuildingElementDraft(BuildingElementBase):
    id: Optional[int] = Field(default=None)
    building_id: Optional[int] = Field(default=None)
    technical_construction_id: Optional[int] = Field(default=None)
    professional_ids: List[int] = None


class BuildingElementRead(BuildingElementBase):
    id: Optional[int] = Field(default=None)
    technical_construction: TechnicalConstruction = None
    building: BuildingBase = None
    professionals: List[Professional] = None


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

# professionals


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
