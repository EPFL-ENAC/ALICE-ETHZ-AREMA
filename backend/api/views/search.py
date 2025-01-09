from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from api.auth import kc_service, User
from api.db import get_session, AsyncSession
from api.services.natural_resources import NaturalResourceService
from api.services.building_materials import BuildingMaterialService
from api.services.technical_constructions import TechnicalConstructionService
from api.services.buildings import BuildingService
from api.services.professionals import ProfessionalService
from api.services.search import SearchService, EntityIndexer, ENTITY_ANALYZED_FIELDS, VIDEO_ANALYZED_FIELDS
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
    indexer = EntityIndexer()
    try:
        if type:
            indexer.deleteEntities(type)
        else:
            indexer.deleteIndex()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/_query", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    query: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
    index: str = Query("entities"),
    user: User = Depends(kc_service.require_admin())
) -> SearchResult:
    """Search documents matching the Elasticsearch query"""
    indexService = SearchService.fromIndex(index)
    queryDict = paramAsDict(query)
    return indexService.search(query=queryDict, skip=skip, limit=limit)


@router.get("/_doc", response_model=SearchResult, response_model_exclude_none=True)
async def find(id: str = Query(None),
               index: str = Query("entities"),
               fields: List[str] = Query(None)) -> SearchResult:
    """Search document per id"""
    indexService = SearchService.fromIndex(index)
    queryDict = {"query": {"term": {"_id": id}}}
    if fields is not None and len(fields) > 0:
        queryDict["_source"] = fields
    return indexService.search(query=queryDict, skip=0, limit=1)


@router.get("/_videos", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    text: str = Query(None),
    tags: List[str] = Query(None),
    fields: List[str] = Query(
        ["entity_type", "tags", "id", "parent_id", "name", "legend", "url"]),
    exists: List[str] = Query([]),  # filter documents with a non-empty field
    # filter documents related to the given ids
    relates: List[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
) -> SearchResult:
    """Search video documents by full text"""
    indexService = SearchService.fromIndex("videos")
    mustQueries = []

    if text:
        mustQueries.append(make_text_criteria(text, VIDEO_ANALYZED_FIELDS))
    mustQueries.extend(make_tags_criteria(tags))
    mustQueries.extend(make_exists_criteria(exists))
    if relates:
        mustQueries.append({"terms": {"relates_to": relates}})

    queryDict = {}
    if len(mustQueries):
        queryDict = {"query": {"bool": {"must": mustQueries}}}
    if fields is not None and len(fields) > 0:
        queryDict["_source"] = fields

    return indexService.search(query=queryDict, skip=skip, limit=limit)


@router.get("/_entities", response_model=SearchResult, response_model_exclude_none=True)
async def find(
    text: str = Query(None),
    tags: List[str] = Query(None),
    fields: List[str] = Query(
        ["entity_type", "tags", "id", "name", "description", "files", "location", "relates_to"]),
    exists: List[str] = Query([]),  # filter documents with a non-empty field
    # filter documents related to the given ids
    relates: List[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
) -> SearchResult:
    """Search entity documents by tags or full text"""
    indexService = SearchService.fromIndex("entities")
    mustQueries = []

    if text:
        mustQueries.append(make_text_criteria(text, ENTITY_ANALYZED_FIELDS))
    mustQueries.extend(make_tags_criteria(tags))
    mustQueries.extend(make_exists_criteria(exists))
    if relates:
        mustQueries.append({"terms": {"relates_to": relates}})

    queryDict = {}
    if len(mustQueries):
        queryDict = {"query": {"bool": {"must": mustQueries}}}
    if fields is not None and len(fields) > 0:
        queryDict["_source"] = fields

    return indexService.search(query=queryDict, skip=skip, limit=limit)


def make_text_criteria(text: str, analyzed_fields: List[str]):
    should = []
    for field in analyzed_fields:
        should.append({"term": {f"{field}.keyword": text}})
        should.append({"match": {f"{field}.ngram": text}})
        should.append(
            {"fuzzy": {f"{field}.fuzzy": {"value": text, "fuzziness": "AUTO"}}})
    return {
        "bool": {
            "should": should,
            "minimum_should_match": 1
        }
    }


def make_tags_criteria(tags: List[str]):
    terms = {}
    mustQueries = []
    if tags:
        # group terms (urn) by their parent
        for tag in tags:
            vocabulary = tag.split('.', 1)[0]
            if vocabulary not in terms:
                terms[vocabulary] = []
            terms[vocabulary].append(tag)
        for vocabulary in terms:
            mustQueries.append({"terms": {"tags": terms[vocabulary]}})
    return mustQueries


def make_exists_criteria(exists: List[str]):
    mustQueries = []
    if exists:
        for field in exists:
            mustQueries.append({"exists": {"field": field}})
    return mustQueries
