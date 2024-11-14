from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import BuildingMaterial
from api.models.query import BuildingMaterialResult, BuildingMaterialDraft
from api.services.building_materials import BuildingMaterialService
from enacit4r_sql.utils.query import paramAsArray, paramAsDict

router = APIRouter()


@router.get("/", response_model=BuildingMaterialResult)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> BuildingMaterialResult:
    """Search for building materials"""
    return await BuildingMaterialService(session).find(paramAsDict(filter), paramAsArray(sort), paramAsArray(range))
  
@router.get("/{id}", response_model=BuildingMaterial)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> BuildingMaterial:
    """Get a building material by id"""
    return await BuildingMaterialService(session).get(id)
  
@router.delete("/{id}", response_model=BuildingMaterial)
async def delete(id: int, session: AsyncSession = Depends(get_session)) -> BuildingMaterial:
    """Delete a building material by id"""
    return await BuildingMaterialService(session).delete(id)

@router.post("/", response_model=BuildingMaterial)
async def create(
    payload: BuildingMaterialDraft, session: AsyncSession = Depends(get_session)
) -> BuildingMaterial:
    """Create a building material"""
    return await BuildingMaterialService(session).create(payload)
  
@router.put("/{id}", response_model=BuildingMaterial)
async def update(
    id: int, payload: BuildingMaterialDraft, session: AsyncSession = Depends(get_session)
) -> BuildingMaterial:
    """Update a building material by id"""
    async with session:
        return await BuildingMaterialService(session).update(id, payload)    