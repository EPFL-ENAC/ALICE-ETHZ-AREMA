from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from api.auth import kc_service, User
from api.db import get_session, AsyncSession
from api.services.natural_resources import NaturalResourceService
from api.services.building_materials import BuildingMaterialService
from api.services.technical_constructions import TechnicalConstructionService
from api.services.buildings import BuildingService
from api.services.professionals import ProfessionalService
from api.services.search import IndexService, ANALYZED_FIELDS
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
    try:
        indexCounts = {}
        if type is None or type == "natural-resource":
            service = NaturalResourceService(session)
            indexCounts["natural-resource"] = await service.indexAll()
        if type is None or type == "building-material":
            service = BuildingMaterialService(session)
            indexCounts["building-material"] = await service.indexAll()
        if type is None or type == "technical-construction":
            service = TechnicalConstructionService(session)
            indexCounts["technical-construction"] = await service.indexAll()
        if type is None or type == "building":
            service = BuildingService(session)
            indexCounts["building"] = await service.indexAll()
        if type is None or type == "professional":
            service = ProfessionalService(session)
            indexCounts["professional"] = await service.indexAll()
        return indexCounts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/_query", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    query: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
    user: User = Depends(kc_service.require_admin())
) -> SearchResult:
    """Search documents matching the Elasticsearch query"""
    indexService = IndexService()
    queryDict = paramAsDict(query)
    return indexService.search(query=queryDict, skip=skip, limit=limit)


@router.get("/_doc", response_model=SearchResult, response_model_exclude_none=True)
async def find(id: str = Query(None)) -> SearchResult:
    """Search documents matching the Elasticsearch query"""
    indexService = IndexService()
    queryDict = {"query": {"term": {"_id": id}}}
    return indexService.search(query=queryDict, skip=0, limit=1)


@router.get("/", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    text: str = Query(None),
    tags: List[str] = Query(None),
    fields: List[str] = Query(
        ["entity_type", "tags", "id", "name", "description", "files", "location"]),
    exists: List[str] = Query([]),  # filter documents with a non-empty field
    skip: int = Query(0),
    limit: int = Query(10),
) -> SearchResult:
    """Search documents by tags or full text"""
    indexService = IndexService()
    mustQueries = []

    if text:
        mustQueries.append({"multi_match": {"query": text,
                                            "fields": ANALYZED_FIELDS}})
    if tags:
        terms = {}
        # group terms (urn) by their parent
        for tag in tags:
            vocabulary = tag.rsplit('.', 1)[0]
            if vocabulary not in terms:
                terms[vocabulary] = []
            terms[vocabulary].append(tag)
        for vocabulary in terms:
            mustQueries.append({"terms": {"tags": terms[vocabulary]}})

    if exists:
        for field in exists:
            mustQueries.append({"exists": {"field": field}})

    queryDict = {}
    if len(mustQueries):
        queryDict = {"query": {"bool": {"must": mustQueries}}}
    if fields:
        queryDict["_source"] = fields

    return indexService.search(query=queryDict, skip=skip, limit=limit)
