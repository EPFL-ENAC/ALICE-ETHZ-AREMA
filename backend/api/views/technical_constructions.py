from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import TechnicalConstruction
from api.models.results import TechnicalConstructionResult
from api.services.technical_constructions import TechnicalConstructionService
from enacit4r_sql.utils.query import paramAsArray, paramAsDict

router = APIRouter()


@router.get("/", response_model=TechnicalConstructionResult)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> TechnicalConstructionResult:
    """Search for technical constructions"""
    return await TechnicalConstructionService(session).find(paramAsDict(filter), paramAsArray(sort), paramAsArray(range))
  
@router.get("/{id}", response_model=TechnicalConstruction)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> TechnicalConstruction:
    """Get a technical construction by id"""
    return await TechnicalConstructionService(session).get(id)
  
@router.delete("/{id}", response_model=TechnicalConstruction)
async def delete(id: int, session: AsyncSession = Depends(get_session)) -> TechnicalConstruction:
    """Delete a technical construction by id"""
    return await TechnicalConstructionService(session).delete(id)

@router.post("/", response_model=TechnicalConstruction)
async def create(
    natural_resource: TechnicalConstruction, session: AsyncSession = Depends(get_session)
) -> TechnicalConstruction:
    """Create a technical construction"""
    return await TechnicalConstructionService(session).create(natural_resource)
  
@router.put("/{id}", response_model=TechnicalConstruction)
async def update(
    id: int, natural_resource: TechnicalConstruction, session: AsyncSession = Depends(get_session)
) -> TechnicalConstruction:
    """Update a technical construction by id"""
    return await TechnicalConstructionService(session).update(id, natural_resource)    