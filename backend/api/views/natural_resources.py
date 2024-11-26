from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import NaturalResource
from api.models.query import NaturalResourceResult
from api.services.natural_resources import NaturalResourceService
from enacit4r_sql.utils.query import paramAsArray, paramAsDict

router = APIRouter()


@router.get("/", response_model=NaturalResourceResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> NaturalResourceResult:
    """Search for natural resources"""
    return await NaturalResourceService(session).find(paramAsDict(filter), paramAsArray(sort), paramAsArray(range))


@router.get("/{id}", response_model=NaturalResource)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> NaturalResource:
    """Get a natural resource by id"""
    return await NaturalResourceService(session).get(id)


@router.delete("/{id}", response_model=NaturalResource)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> NaturalResource:
    """Delete a natural resource by id"""
    return await NaturalResourceService(session).delete(id)


@router.post("/", response_model=NaturalResource)
async def create(
    natural_resource: NaturalResource,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> NaturalResource:
    """Create a natural resource"""
    return await NaturalResourceService(session).create(natural_resource, user)


@router.put("/{id}", response_model=NaturalResource)
async def update(
    id: int,
    natural_resource: NaturalResource,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> NaturalResource:
    """Update a natural resource by id"""
    return await NaturalResourceService(session).update(id, natural_resource, user)
