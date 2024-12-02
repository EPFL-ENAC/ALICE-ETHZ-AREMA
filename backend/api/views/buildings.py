from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import Building
from api.models.query import BuildingDraft, BuildingResult
from api.services.buildings import BuildingService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=BuildingResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> BuildingResult:
    """Search for buildings"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await BuildingService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=Building, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> Building:
    """Get a building by id"""
    return await BuildingService(session).get(id)


@router.delete("/{id}", response_model=Building, response_model_exclude_none=True)
async def delete(
        id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_admin())) -> Building:
    """Delete a building by id"""
    return await BuildingService(session).delete(id)


@router.post("/", response_model=Building, response_model_exclude_none=True)
async def create(
    payload: BuildingDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Building:
    """Create a building"""
    return await BuildingService(session).create(payload, user)


@router.put("/{id}", response_model=Building, response_model_exclude_none=True)
async def update(
    id: int, payload: BuildingDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Building:
    """Update a building by id"""
    return await BuildingService(session).update(id, payload, user)
