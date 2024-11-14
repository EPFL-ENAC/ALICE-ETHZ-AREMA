from typing import List
from api.models.domain import NaturalResource, BuildingMaterial, TechnicalConstruction, Building, Professional
from enacit4r_sql.models.query import ListResult

class NaturalResourceResult(ListResult):
    data: List[NaturalResource] = []

class BuildingMaterialResult(ListResult):
    data: List[BuildingMaterial] = []

class TechnicalConstructionResult(ListResult):
    data: List[TechnicalConstruction] = []

class BuildingResult(ListResult):
    data: List[Building] = []

class ProfessionalResult(ListResult):
    data: List[Professional] = []
