from typing import List, Optional
from sqlmodel import Field
from api.models.domain import NaturalResource, BuildingMaterial, BuildingMaterialBase, TechnicalConstruction, TechnicalConstructionBase, BuildingBase, Professional, ProfessionalBase
from enacit4r_sql.models.query import ListResult

# Natural resources
class NaturalResourceResult(ListResult):
    data: List[NaturalResource] = []

# Building materials
class BuildingMaterialDraft(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    natural_resource_ids: List[int] = []

class BuildingMaterialRead(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    natural_resources: List[NaturalResource] = []

class BuildingMaterialResult(ListResult):
    data: List[BuildingMaterialRead] = []

# Technical constructions

class TechnicalConstructionDraft(TechnicalConstructionBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []

class TechnicalConstructionRead(TechnicalConstructionBase):
    id: Optional[int] = Field(default=None)
    building_materials: List[BuildingMaterial] = []

class TechnicalConstructionResult(ListResult):
    data: List[TechnicalConstructionRead] = []

# Buildings

class BuildingDraft(BuildingBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []
    technical_construction_ids: List[int] = []
    professional_ids: List[int] = []

class BuildingRead(BuildingBase):
    id: Optional[int] = Field(default=None)
    building_materials: List[BuildingMaterial] = []
    technical_constructions: List[TechnicalConstruction] = []
    professionals: List[Professional] = []

class BuildingResult(ListResult):
    data: List[BuildingRead] = []

# professionals
class ProfessionalDraft(ProfessionalBase):
    id: Optional[int] = Field(default=None)
    building_material_ids: List[int] = []
    technical_construction_ids: List[int] = []

class ProfessionalRead(ProfessionalBase):
    id: Optional[int] = Field(default=None)
    building_materials: List[BuildingMaterial] = []
    technical_constructions: List[TechnicalConstruction] = []

class ProfessionalResult(ListResult):
    data: List[ProfessionalRead] = []
