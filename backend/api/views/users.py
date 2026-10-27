import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from keycloak.exceptions import KeycloakPostError

from api.auth import User, kc_admin_service, kc_service
from api.config import config
from api.db import AsyncSession, get_engine
from api.models.users import AppUser, AppUserDraft, AppUserListItem, AppUserPassword, AppUserResult
from api.rate_limit import limiter
from api.services.mailer import Mailer
from api.services.subject_profiles import SubjectProfileService

router = APIRouter()


async def create_subject_profile_task(appUser: AppUser):
    """Background task to create subject profile for a user"""
    engine = get_engine()
    async with AsyncSession(engine) as session:
        subjectProfileService = SubjectProfileService(session)
        try:
            await subjectProfileService.create_subject_profile_for_user(appUser)
        except Exception:
            logging.exception("Error creating subject profile for user")
    # send welcome email
    try:
        await Mailer().send_welcome_email(appUser)
    except Exception as e:
        logging.error(f"Failed to send welcome email to {appUser.email}: {e}")


def get_identity_providers(id: str) -> list[str]:
    """Get the identity providers (e.g. github, google) the user signs in with"""
    return [link["identityProvider"] for link in kc_admin_service.kc_admin.get_user_social_logins(id)]


@router.get("/", response_model=AppUserResult, response_model_exclude_none=True)
async def find(user: User = Depends(kc_service.require_admin())):
    """Get users"""
    # ponytail: one Keycloak call per user, as for the roles in enacit4r-auth
    app_users = [
        AppUserListItem(**app_user.model_dump(), identity_providers=get_identity_providers(app_user.id))
        for app_user in await kc_admin_service.get_users()
    ]
    return AppUserResult(skip=0, limit=len(app_users), total=len(app_users), data=app_users)


@router.get("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def get(id: str, user: User = Depends(kc_service.require_admin())) -> AppUser:
    """Get a user by id or name"""
    return await kc_admin_service.get_user(id)


@router.delete("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def delete(id: str, user: User = Depends(kc_service.require_admin())):
    """Delete a user by id or name"""
    return await kc_admin_service.delete_user(id)


@router.post("/", response_model=AppUser, response_model_exclude_none=True)
async def create(
    item: AppUserDraft, background_tasks: BackgroundTasks, user: User = Depends(kc_service.require_admin())
) -> AppUser:
    """Create a user"""
    actions = ["UPDATE_PASSWORD"]
    if config.KEYCLOAK_TOTP:
        actions.append("CONFIGURE_TOTP")
    if kc_admin_service.check_valid_password(item.password) is False:
        raise HTTPException(status_code=400, detail="error.password_complexity_not_met")
    appUser = await kc_admin_service.create_user(item, actions)
    background_tasks.add_task(create_subject_profile_task, appUser)
    return appUser


@router.post("/_register", response_model=AppUser, response_model_exclude_none=True)
@limiter.limit(config.RATE_LIMIT_REGISTER)
async def register(request: Request, item: AppUserDraft, background_tasks: BackgroundTasks) -> AppUser:
    """User self-registration"""
    # check user does not exist (get_user raises when not found)
    try:
        existing_user = await kc_admin_service.get_user(item.username)
    except Exception:
        existing_user = None
    if existing_user:
        raise HTTPException(status_code=400, detail="error.registration_failed")

    if kc_admin_service.check_valid_password(item.password) is False:
        raise HTTPException(status_code=400, detail="error.password_complexity_not_met")
    new_user = AppUserDraft(
        username=item.username,
        email=item.email,
        first_name=item.first_name,
        last_name=item.last_name,
        password=item.password,
        enabled=True,
        email_verified=False,
        roles=["app-contributor"],
    )
    actions = ["VERIFY_EMAIL"]
    if config.KEYCLOAK_TOTP:
        actions.append("CONFIGURE_TOTP")
    try:
        appUser = await kc_admin_service.create_user(new_user, actions)
    except KeycloakPostError as e:
        # e.g. email already used by an account of the realm: sign in and join instead
        logging.warning(f"User registration failed: {e}")
        raise HTTPException(status_code=400, detail="error.registration_failed") from e
    background_tasks.add_task(create_subject_profile_task, appUser)
    return appUser


@router.post("/_join", response_model=AppUser, response_model_exclude_none=True)
async def join(background_tasks: BackgroundTasks, user: User = Depends(kc_service.get_user_info())) -> AppUser:
    """Signed-in user of the realm (e.g. registered for another app) joins this app as a contributor"""
    appUser = await kc_admin_service.get_user(user.id)
    if "app-user" in appUser.roles:
        return appUser
    appUser.roles = appUser.roles + ["app-contributor"]
    appUser = await kc_admin_service.update_user(appUser)
    background_tasks.add_task(create_subject_profile_task, appUser)
    return appUser


@router.put("/{id}", response_model=AppUser, response_model_exclude_none=True)
async def update(id: str, item: AppUser, user: User = Depends(kc_service.require_admin())) -> AppUser:
    """Update a user by id"""
    if id != item.id:
        raise Exception("id does not match")
    return await kc_admin_service.update_user(item)


@router.put("/{id}/password")
async def update_password(id: str, payload: AppUserPassword, user: User = Depends(kc_service.require_admin())) -> None:
    """Set a temporary user password by id"""
    if payload.password is None:
        raise Exception("password is required")
    if get_identity_providers(id):
        raise HTTPException(status_code=400, detail="error.password_with_identity_provider")
    return await kc_admin_service.update_user_password(id, payload.password)
