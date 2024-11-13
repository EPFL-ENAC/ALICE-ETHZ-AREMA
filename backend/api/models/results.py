from typing import List
from api.models.domain import NaturalResource
from enacit4r_sql.models.query import ListResult

class NaturalResourceResult(ListResult):
    data: List[NaturalResource] = []