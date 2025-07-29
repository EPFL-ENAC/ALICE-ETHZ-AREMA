from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import NaturalResource
from api.models.query import NaturalResourceResult
from api.services.natural_resources import NaturalResourceService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=NaturalResourceResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> NaturalResourceResult:
    """Search for natural resources"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await NaturalResourceService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=NaturalResource, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> NaturalResource:
    """Get a natural resource by id"""
    return await NaturalResourceService(session).get(id)


@router.delete("/{id}", response_model=NaturalResource, response_model_exclude_none=True)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> NaturalResource:
    """Delete a natural resource by id"""
    return await NaturalResourceService(session).delete(id)


@router.post("/", response_model=NaturalResource, response_model_exclude_none=True)
async def create(
    natural_resource: NaturalResource,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-reviewer", "app-contributor"]))
) -> NaturalResource:
    """Create a natural resource"""
    return await NaturalResourceService(session).create(natural_resource, user)


@router.put("/{id}", response_model=NaturalResource, response_model_exclude_none=True)
async def update(
    id: int,
    natural_resource: NaturalResource,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-reviewer", "app-contributor"]))
) -> NaturalResource:
    """Update a natural resource by id"""
    return await NaturalResourceService(session).update(id, natural_resource, user)


@router.put("/{id}/_index", response_model_exclude_none=True)
async def publish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Publish a natural resource by id"""
    return await NaturalResourceService(session).index(id, user)


@router.delete("/{id}/_index", response_model_exclude_none=True)
async def unpublish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Unpublish a natural resource by id"""
    return await NaturalResourceService(session).remove_index(id, user)


@router.put("/{id}/_state", response_model_exclude_none=True)
async def set_state(
    id: int,
    s: str,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-reviewer", "app-contributor"])
    )
) -> None:
    """Set the state of a natural resource by id"""
    return await NaturalResourceService(session).set_state(id, s, user)
