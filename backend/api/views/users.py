from fastapi import APIRouter, Depends
from api.db import get_session, AsyncSession
from api.models.users import AppUser, AppUserResult, AppUserDraft, AppUserPassword
from api.auth import kc_service, User, kc_admin_service
from api.services.subject_profiles import SubjectProfileService

router = APIRouter()


@router.get("/", response_model=AppUserResult, response_model_exclude_none=True)
async def find(user: User = Depends(kc_service.require_admin())):
    """Get users"""
    app_users = await kc_admin_service.get_users()
    return AppUserResult(
        skip=0,
        limit=len(app_users),
        total=len(app_users),
        data=app_users)


@router.get("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def get(id: str, user: User = Depends(kc_service.require_admin())) -> AppUser:
    """Get a user by id or name"""
    return await kc_admin_service.get_user(id)


@router.delete("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def delete(id: str, user: User = Depends(kc_service.require_admin())):
    """Delete a user by id or name"""
    return await kc_admin_service.delete_user(id)


@router.post("/", response_model=AppUser, response_model_exclude_none=True)
async def create(item: AppUserDraft,
                 session: AsyncSession = Depends(get_session),
                 user: User = Depends(kc_service.require_admin())) -> AppUser:
    """Create a user"""
    appUser = await kc_admin_service.create_user(item)
    subjectProfileService = SubjectProfileService(session)
    await subjectProfileService.create_subject_profile_for_user(appUser)
    return appUser


@router.put("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def update(
    id: str,
    item: AppUser,
    user: User = Depends(kc_service.require_admin())
) -> AppUser:
    """Update a user by id"""
    if id != item.id:
        raise Exception("id does not match")
    return await kc_admin_service.update_user(item)


@router.put("/{id}/password")
async def update_password(
    id: str,
    payload: AppUserPassword,
    user: User = Depends(kc_service.require_admin())
) -> None:
    """Set a temporary user password by id"""
    if payload.password is None:
        raise Exception("password is required")
    return await kc_admin_service.update_user_password(id, payload.password)
