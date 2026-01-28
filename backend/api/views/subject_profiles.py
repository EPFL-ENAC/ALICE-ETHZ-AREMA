from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import SubjectProfile
from api.models.query import SubjectProfileResult, SubjectProfileDraft
from api.services.subject_profiles import SubjectProfileService
from enacit4r_sql.utils.query import validate_params, ValidationError

router = APIRouter()


@router.get("/", response_model=SubjectProfileResult, response_model_exclude_none=True)
async def find(
    filter: str = Query(None),
    select: str = Query(None),
    sort: str = Query(None),
    range: str = Query("[0,99]"),
    session: AsyncSession = Depends(get_session),
) -> SubjectProfileResult:
    """Search for subject profiles"""
    try:
        validated = validate_params(filter, sort, range, select)
        return await SubjectProfileService(session).find(validated["filter"], validated["fields"], validated["sort"], validated["range"])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"{e}")


@router.get("/{id}", response_model=SubjectProfile, response_model_exclude_none=True)
async def get(id: int, session: AsyncSession = Depends(get_session)) -> SubjectProfile:
    """Get a subject profile by id"""
    return await SubjectProfileService(session).get_by_id(id)


@router.delete("/{id}", response_model=SubjectProfile, response_model_exclude_none=True)
async def delete(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> SubjectProfile:
    """Delete a subject profile by id"""
    return await SubjectProfileService(session).delete_by_id(id)


@router.post("/", response_model=SubjectProfile, response_model_exclude_none=True)
async def create(
    subject_profile:  SubjectProfileDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> SubjectProfile:
    """Create a subject profile"""
    return await SubjectProfileService(session).create(subject_profile)


@router.put("/{id}", response_model=SubjectProfile, response_model_exclude_none=True)
async def update(
    id: int,
    subject_profile: SubjectProfileDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> SubjectProfile:
    """Update a subject profile"""
    return await SubjectProfileService(session).update(id, subject_profile)
