from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import BuildingMaterial
from api.models.query import BuildingMaterialResult, BuildingMaterialDraft
from api.services.building_materials import BuildingMaterialService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=BuildingMaterialResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> BuildingMaterialResult:
    """Search for building materials"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await BuildingMaterialService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=BuildingMaterial, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> BuildingMaterial:
    """Get a building material by id"""
    return await BuildingMaterialService(session).get(id)


@router.delete("/{id}", response_model=BuildingMaterial, response_model_exclude_none=True)
async def delete(
        id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_admin())) -> BuildingMaterial:
    """Delete a building material by id"""
    return await BuildingMaterialService(session).delete(id)


@router.post("/", response_model=BuildingMaterial, response_model_exclude_none=True)
async def create(
    payload: BuildingMaterialDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-contributor"]))
) -> BuildingMaterial:
    """Create a building material"""
    return await BuildingMaterialService(session).create(payload, user)


@router.put("/{id}", response_model=BuildingMaterial, response_model_exclude_none=True)
async def update(
    id: int, payload: BuildingMaterialDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-contributor"]))
) -> BuildingMaterial:
    """Update a building material by id"""
    async with session:
        return await BuildingMaterialService(session).update(id, payload, user)


@router.put("/{id}/_index", response_model_exclude_none=True)
async def publish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Publish/unpublish a building material by id"""
    return await BuildingMaterialService(session).index(id, user)
