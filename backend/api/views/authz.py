# Authorization views
from fastapi import APIRouter, Depends, HTTPException
from api.auth import require_admin_or_perm
from api.services.authz import ACLService
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.authz import ACL
from api.models.query import ACLResult
from api.auth import kc_admin_service
router = APIRouter()


@router.get("/acl", response_model=ACLResult, response_model_exclude_none=True)
async def list_all_acls(session: AsyncSession = Depends(get_session),
                        user: User = Depends(kc_service.require_admin())):
    """List ACLs for all resources"""
    acl_service = ACLService(session)
    return await acl_service.list_acls()


@router.get("/acl/{resource}", response_model=ACLResult, response_model_exclude_none=True)
async def list_resource_acls(resource: str,
                             session: AsyncSession = Depends(get_session),
                             user: User = Depends(kc_service.require_admin())):
    """List ACLs for a resource"""
    acl_service = ACLService(session)
    return await acl_service.list_acls(resource)


@router.delete("/acl/{resource}", response_model=None)
async def delete_resource_acls(resource: str,
                               subject: str = None,
                               session: AsyncSession = Depends(get_session),
                               user: User = Depends(kc_service.require_admin())):
    """Delete ACLs for a resource and optionally a specific user"""
    acl_service = ACLService(session)
    await acl_service.delete_user_permissions(resource, subject)
    return {"message": "ACLs deleted successfully"}


@router.post("/acl/{resource}", response_model=ACL)
async def apply_acl(resource: str,
                    permission: str,
                    subject: str,
                    session: AsyncSession = Depends(get_session),
                    user: User = Depends(kc_service.require_admin())):
    """Apply a permission for a user on a resource"""
    acl_service = ACLService(session)
    return await acl_service.apply_user_permission(resource, permission, subject)


@router.get("/acl/{resource}/check", response_model=bool)
async def check_acl(resource: str,
                    permission: str,
                    subject: str,
                    session: AsyncSession = Depends(get_session),
                    user: User = Depends(kc_service.get_user_info())):
    """Check if a user has a permission on a resource"""
    acl_service = ACLService(session)
    hasPerm = await acl_service.check_user_permission(resource, permission, subject)
    if not hasPerm:
        # check if user has permission through roles
        try:
            user = await kc_admin_service.get_user(subject)
            if user:
                if "app-administrator" in user.roles:
                    hasPerm = True
                if "app-reviewer" in user.roles and permission != "publish":
                    hasPerm = True
        except Exception as e:
            pass
    return {"message": hasPerm}
