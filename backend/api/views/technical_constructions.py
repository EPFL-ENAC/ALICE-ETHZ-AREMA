from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import TechnicalConstruction
from api.models.query import TechnicalConstructionResult, TechnicalConstructionDraft
from api.services.technical_constructions import TechnicalConstructionService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=TechnicalConstructionResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> TechnicalConstructionResult:
    """Search for technical constructions"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await TechnicalConstructionService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=TechnicalConstruction, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> TechnicalConstruction:
    """Get a technical construction by id"""
    return await TechnicalConstructionService(session).get(id)


@router.delete("/{id}", response_model=TechnicalConstruction, response_model_exclude_none=True)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> TechnicalConstruction:
    """Delete a technical construction by id"""
    return await TechnicalConstructionService(session).delete(id)


@router.post("/", response_model=TechnicalConstruction, response_model_exclude_none=True)
async def create(
    payload: TechnicalConstructionDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> TechnicalConstruction:
    """Create a technical construction"""
    return await TechnicalConstructionService(session).create(payload, user)


@router.put("/{id}", response_model=TechnicalConstruction, response_model_exclude_none=True)
async def update(
    id: int,
    payload: TechnicalConstructionDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> TechnicalConstruction:
    """Update a technical construction by id"""
    return await TechnicalConstructionService(session).update(id, payload, user)
