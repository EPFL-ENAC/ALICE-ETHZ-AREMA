import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from api.config import config
from api.db import get_session, AsyncSession, get_engine
from api.models.users import AppUser, AppUserResult, AppUserDraft, AppUserPassword
from api.auth import kc_service, User, kc_admin_service
from api.services.subject_profiles import SubjectProfileService
from api.services.mailer import Mailer

router = APIRouter()


async def create_subject_profile_task(appUser: AppUser):
    """Background task to create subject profile for a user"""
    engine = get_engine()
    async with AsyncSession(engine) as session:
        subjectProfileService = SubjectProfileService(session)
        try:
            await subjectProfileService.create_subject_profile_for_user(appUser)
        except Exception:
            logging.exception(
                "Error creating subject profile for user")
    # send welcome email
    try:
        Mailer().send_welcome_email(appUser)
    except Exception as e:
        logging.error(f"Failed to send welcome email to {appUser.email}: {e}")


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
                 background_tasks: BackgroundTasks,
                 user: User = Depends(kc_service.require_admin())) -> AppUser:
    """Create a user"""
    actions = ["UPDATE_PASSWORD"]
    if config.KEYCLOAK_TOTP:
        actions.append("CONFIGURE_TOTP")
    if kc_admin_service.check_valid_password(item.password) is False:
        raise HTTPException(
            status_code=400, detail="error.password_complexity_not_met")
    appUser = await kc_admin_service.create_user(item, actions)
    background_tasks.add_task(create_subject_profile_task, appUser)
    return appUser


@router.post("/_register", response_model=AppUser, response_model_exclude_none=True)
async def register(item: AppUserDraft,
                   background_tasks: BackgroundTasks) -> AppUser:
    """User self-registration"""
    # check user does not exist
    try:
        existing_user = await kc_admin_service.get_user(item.username)
        if existing_user:
            raise HTTPException(
                status_code=400, detail="error.registration_failed")
    except Exception:
        logging.exception(
            "Error checking for existing user during registration")

    if kc_admin_service.check_valid_password(item.password) is False:
        raise HTTPException(
            status_code=400, detail="error.password_complexity_not_met")
    new_user = AppUserDraft(
        username=item.username,
        email=item.email,
        first_name=item.first_name,
        last_name=item.last_name,
        password=item.password,
        enabled=True,
        email_verified=False,
        roles=["app-contributor"]
    )
    actions = ["VERIFY_EMAIL"]
    if config.KEYCLOAK_TOTP:
        actions.append("CONFIGURE_TOTP")
    appUser = await kc_admin_service.create_user(new_user, actions)
    background_tasks.add_task(create_subject_profile_task, appUser)
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
