from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import Professional
from api.models.query import ProfessionalDraft, ProfessionalResult
from api.services.professionals import ProfessionalService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=ProfessionalResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> ProfessionalResult:
    """Search for professionals"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await ProfessionalService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=Professional, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> Professional:
    """Get a professional by id"""
    return await ProfessionalService(session).get(id)


@router.delete("/{id}", response_model=Professional, response_model_exclude_none=True)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> Professional:
    """Delete a professional by id"""
    return await ProfessionalService(session).delete(id)


@router.post("/", response_model=Professional, response_model_exclude_none=True)
async def create(
    payload: ProfessionalDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-contributor"]))
) -> Professional:
    """Create a professional"""
    return await ProfessionalService(session).create(payload, user)


@router.put("/{id}", response_model=Professional, response_model_exclude_none=True)
async def update(
    id: int,
    payload: ProfessionalDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_any_role(
        ["app-administrator", "app-contributor"]))
) -> Professional:
    """Update a professional by id"""
    return await ProfessionalService(session).update(id, payload, user)


@router.put("/{id}/_index", response_model_exclude_none=True)
async def publish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Publish/unpublish a professional by id"""
    return await ProfessionalService(session).index(id, user)
