import logging
from fastapi import APIRouter, Depends, Query, HTTPException
from api.db import get_session, AsyncSession
from api.auth import kc_service, User, kc_admin_service
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
    # check already exists for user
    existing = await SubjectProfileService(session).get(subject_profile.identifier, subject_profile.type)
    if existing:
        return existing
    return await SubjectProfileService(session).create(subject_profile)


@router.put("/{id}", response_model=SubjectProfile, response_model_exclude_none=True)
async def update(
    id: int,
    subject_profile: SubjectProfileDraft,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.get_user_info())
) -> SubjectProfile:
    """Update a subject profile"""
    return await SubjectProfileService(session).update(id, subject_profile, user)


@router.put("/{id}/_index", response_model_exclude_none=True)
async def publish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Publish a subject profile by id"""
    return await SubjectProfileService(session).index(id)


@router.delete("/{id}/_index", response_model_exclude_none=True)
async def unpublish(
    id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Unpublish a subject profile by id"""
    return await SubjectProfileService(session).remove_index(id)


@router.post("/_sync", response_model=SubjectProfileResult, response_model_exclude_none=True)
async def sync_users(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_admin())
) -> SubjectProfileResult:
    """Create a subject profile per user if it does not exist"""
    app_users = await kc_admin_service.get_users()
    service = SubjectProfileService(session)
    created = []
    updated = []
    for appUser in app_users:
        existing = await service.get(appUser.id, "user")
        if existing:
            continue
        # legacy users may not have an id, so we use the username as a fallback
        existing = await service.get(appUser.username, "user")
        if existing:
            # migrate the identifier to the user id if it exists
            profile = await service.update_identifier(existing.id, appUser.id)
            try:
                # re-index the profile if it was published
                if profile.published_at:
                    await service.index(profile.id)
            except Exception as e:
                logging.error(
                    f"Failed to index subject profile {profile.id}: {e}")
            updated.append(profile)
        else:
            profile = await service.create_subject_profile_for_user(appUser)
            created.append(profile)
    total = len(created) + len(updated)
    return SubjectProfileResult(total=total, skip=0, limit=total, data=created + updated)
