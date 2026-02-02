from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from api.auth import kc_service, User
from api.db import get_session, AsyncSession
from api.services.natural_resources import NaturalResourceService
from api.services.building_materials import BuildingMaterialService
from api.services.subject_profiles import SubjectProfileService
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
    """Reindex all or of a specific entity type"""
    try:
        indexCounts = {}
        if type is None or type == "natural-resource":
            service = NaturalResourceService(session)
            indexCounts["natural-resource"] = await service.reIndexAll()
        if type is None or type == "building-material":
            service = BuildingMaterialService(session)
            indexCounts["building-material"] = await service.reIndexAll()
        if type is None or type == "technical-construction":
            service = TechnicalConstructionService(session)
            indexCounts["technical-construction"] = await service.reIndexAll()
        if type is None or type == "building":
            service = BuildingService(session)
            indexCounts["building"] = await service.reIndexAll()
        if type is None or type == "professional":
            service = ProfessionalService(session)
            indexCounts["professional"] = await service.reIndexAll()
        if type is None or type == "author":
            service = SubjectProfileService(session)
            indexCounts["author"] = await service.reIndexAll()
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
async def find_by_query(
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


@router.get("/_authors", response_model=SearchResult, response_model_exclude_none=True)
async def find_documents(keys: List[str] = Query(None),
                         index: str = Query("entities")) -> SearchResult:
    """Search subject profile documents per keys"""
    indexService = SearchService.fromIndex(index)
    if keys is None or len(keys) == 0:
        return SearchResult(total=0, skip=0, limit=0, data=[])
    shouldQueries = []
    # the keys are in the format type:identifier, so both fields are needed
    for key in keys:
        parts = key.split(":")
        if len(parts) != 2:
            continue
        shouldQueries.append(
            {"bool": {
                "must": [
                    {"term": {"type.keyword": parts[0]}},
                    {"term": {"identifier.keyword": parts[1]}}
                ]
            }}
        )
    queryDict = {"query": {"bool": {"should": shouldQueries}}}
    return indexService.search(query=queryDict, skip=0, limit=len(keys))


@router.get("/_doc", response_model=SearchResult, response_model_exclude_none=True)
async def find_documents(id: str = Query(None),
                         index: str = Query("entities"),
                         fields: List[str] = Query(None)) -> SearchResult:
    """Search document per id"""
    indexService = SearchService.fromIndex(index)
    queryDict = {"query": {"term": {"_id": id}}}
    if fields is not None and len(fields) > 0:
        queryDict["_source"] = fields
    return indexService.search(query=queryDict, skip=0, limit=1)


@router.get("/_videos", response_model=SearchResult, response_model_exclude_none=True)
async def find_videos(
    text: str = Query(None),
    resources: List[str] = Query(None),
    tags: List[str] = Query(None),
    entity_types: List[str] = Query(None),
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
    mustQueries.extend(make_resources_criteria(resources))
    mustQueries.extend(make_tags_criteria(tags))
    mustQueries.extend(make_entity_types_criteria(entity_types))
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
async def find_entities(
    text: str = Query(None),
    resources: List[str] = Query(None),
    tags: List[str] = Query(None),
    entity_types: List[str] = Query(None),
    fields: List[str] = Query(
        ["entity_type", "tags", "id", "name", "description", "files", "location", "relates_to"]),
    exists: List[str] = Query([]),  # filter documents with a non-empty field
    # filter documents within the bounding box: top, left, bottom, right
    bbox: List[float] = Query(None),
    # filter documents related to the given ids
    relates: List[str] = Query(None),
    authors: List[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
) -> SearchResult:
    """Search entity documents by tags or full text"""
    indexService = SearchService.fromIndex("entities")
    mustQueries = []

    if text:
        mustQueries.append(make_text_criteria(text, ENTITY_ANALYZED_FIELDS))
    mustQueries.extend(make_resources_criteria(resources))
    mustQueries.extend(make_tags_criteria(tags))
    mustQueries.extend(make_entity_types_criteria(entity_types))
    mustQueries.extend(make_exists_criteria(exists))
    mustQueries.extend(make_bbox_criteria(bbox))
    if relates:
        mustQueries.append({"terms": {"relates_to": relates}})
    if authors:
        # authors must contain any of the given authors
        mustQueries.append({"terms": {"authors.keyword": authors}})

    # entity_type must be any of natural-resource, building-material, technical-construction, building, professional
    mustQueries.append({"terms": {"entity_type": [
        "natural-resource", "building-material", "technical-construction", "building", "professional"]}})

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


def make_resources_criteria(tags: List[str]):
    mustQueries = []
    if tags and len(tags) > 0:
        mustQueries.append({"terms": {"tags": tags}})
    return mustQueries


def make_tags_criteria(tags: List[str]):
    mustQueries = []
    if tags:
        terms = []
        entity_types = set()
        for tag in tags:
            entity_type = tag.split(':')[2] if len(
                tag.split(':')) > 2 else None
            if entity_type:
                entity_types.add(entity_type)
            terms.append(tag)
        if len(terms) > 0:
            mustQueries.append({"terms": {"tags": terms}})
        if len(entity_types) > 0:
            mustQueries.append({"terms": {"entity_type": list(entity_types)}})
    return mustQueries


def make_entity_types_criteria(entity_types: List[str]):
    mustQueries = []
    if entity_types:
        mustQueries.append({"terms": {"entity_type": entity_types}})
    return mustQueries


def make_exists_criteria(exists: List[str]):
    mustQueries = []
    if exists:
        for field in exists:
            mustQueries.append({"exists": {"field": field}})
    return mustQueries


def make_bbox_criteria(bbox: List[float]):
    mustQueries = []
    if bbox and len(bbox) == 4:
        mustQueries.append(
            {"geo_shape": {"location": {"shape": {"type": "envelope", "coordinates": [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]}}}})
    return mustQueries
