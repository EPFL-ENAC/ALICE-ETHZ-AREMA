from typing import List, Optional
from sqlmodel import Field
from api.models.domain import NaturalResource, BuildingMaterial, BuildingMaterialBase, TechnicalConstruction, Building, Professional
from enacit4r_sql.models.query import ListResult

class BuildingMaterialDraft(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    natural_resource_ids: List[int] = []

class BuildingMaterialRead(BuildingMaterialBase):
    id: Optional[int] = Field(default=None)
    natural_resources: List[NaturalResource] = []

class NaturalResourceResult(ListResult):
    data: List[NaturalResource] = []

class BuildingMaterialResult(ListResult):
    data: List[BuildingMaterialRead] = []

class TechnicalConstructionResult(ListResult):
    data: List[TechnicalConstruction] = []

class BuildingResult(ListResult):
    data: List[Building] = []

class ProfessionalResult(ListResult):
    data: List[Professional] = []
