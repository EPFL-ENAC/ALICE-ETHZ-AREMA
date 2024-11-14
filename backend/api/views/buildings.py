from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import Building
from api.models.query import BuildingResult
from api.services.buildings import BuildingService
from enacit4r_sql.utils.query import paramAsArray, paramAsDict

router = APIRouter()


@router.get("/", response_model=BuildingResult)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> BuildingResult:
    """Search for buildings"""
    return await BuildingService(session).find(paramAsDict(filter), paramAsArray(sort), paramAsArray(range))
  
@router.get("/{id}", response_model=Building)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> Building:
    """Get a building by id"""
    return await BuildingService(session).get(id)
  
@router.delete("/{id}", response_model=Building)
async def delete(id: int, session: AsyncSession = Depends(get_session)) -> Building:
    """Delete a building by id"""
    return await BuildingService(session).delete(id)

@router.post("/", response_model=Building)
async def create(
    payload: Building, session: AsyncSession = Depends(get_session)
) -> Building:
    """Create a building"""
    return await BuildingService(session).create(payload)
  
@router.put("/{id}", response_model=Building)
async def update(
    id: int, payload: Building, session: AsyncSession = Depends(get_session)
) -> Building:
    """Update a building by id"""
    return await BuildingService(session).update(id, payload)    