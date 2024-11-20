from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import Professional
from api.models.query import ProfessionalDraft, ProfessionalResult
from api.services.professionals import ProfessionalService
from enacit4r_sql.utils.query import paramAsArray, paramAsDict

router = APIRouter()


@router.get("/", response_model=ProfessionalResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> ProfessionalResult:
    """Search for professionals"""
    return await ProfessionalService(session).find(paramAsDict(filter), paramAsArray(sort), paramAsArray(range))


@router.get("/{id}", response_model=Professional)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> Professional:
    """Get a professional by id"""
    return await ProfessionalService(session).get(id)


@router.delete("/{id}", response_model=Professional)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Professional:
    """Delete a professional by id"""
    return await ProfessionalService(session).delete(id)


@router.post("/", response_model=Professional)
async def create(
    payload: ProfessionalDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Professional:
    """Create a professional"""
    return await ProfessionalService(session).create(payload)


@router.put("/{id}", response_model=Professional)
async def update(
    id: int,
    payload: ProfessionalDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Professional:
    """Update a professional by id"""
    return await ProfessionalService(session).update(id, payload)
