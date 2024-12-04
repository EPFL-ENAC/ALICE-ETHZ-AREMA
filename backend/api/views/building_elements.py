from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import BuildingElement
from api.models.query import BuildingElementResult, BuildingElementDraft
from api.services.building_elements import BuildingElementService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=BuildingElementResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> BuildingElementResult:
    """Search for building elements"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await BuildingElementService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=BuildingElement, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> BuildingElement:
    """Get a building element by id"""
    return await BuildingElementService(session).get(id)


@router.delete("/{id}", response_model=BuildingElement, response_model_exclude_none=True)
async def delete(
        id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_admin())) -> BuildingElement:
    """Delete a building element by id"""
    return await BuildingElementService(session).delete(id)


@router.post("/", response_model=BuildingElement, response_model_exclude_none=True)
async def create(
    payload: BuildingElementDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> BuildingElement:
    """Create a building element"""
    return await BuildingElementService(session).create(payload)


@router.put("/{id}", response_model=BuildingElement, response_model_exclude_none=True)
async def update(
    id: int, payload: BuildingElementDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> BuildingElement:
    """Update a building element by id"""
    async with session:
        return await BuildingElementService(session).update(id, payload)
