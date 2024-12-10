from fastapi import APIRouter, Depends, Query
from api.auth import kc_service, User
from api.db import get_session, AsyncSession
from api.services.natural_resources import NaturalResourceService
from api.services.building_materials import BuildingMaterialService
from api.services.technical_constructions import TechnicalConstructionService
from api.services.buildings import BuildingService
from api.services.professionals import ProfessionalService
from api.services.search import IndexService
from api.models.query import SearchResult
from enacit4r_sql.utils.query import paramAsDict

router = APIRouter()


@router.post("/_index")
async def populate_index(
    type: str = Query(None),
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
):
    """Index all or specific entity type"""
    service = NaturalResourceService(session)
    await service.index()
    service = BuildingMaterialService(session)
    await service.index()
    service = TechnicalConstructionService(session)
    await service.index()
    service = BuildingService(session)
    await service.index()
    service = ProfessionalService(session)
    await service.index()


@router.delete("/_index")
async def delete_index(
    type: str = Query(None),
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
):
    """Deindex all or specific entity type"""
    indexService = IndexService()
    try:
        if type:
            indexService.deleteEntities(type)
        else:
            indexService.deleteIndex()
    except Exception as e:
        return {"error": str(e)}


@router.get("/", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    query: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
) -> SearchResult:
    """Search documents matching the query"""
    indexService = IndexService()
    queryDict = paramAsDict(query)
    return indexService.search(query=queryDict, skip=skip, limit=limit)
