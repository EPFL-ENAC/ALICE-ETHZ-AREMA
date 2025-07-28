import logging
from api.db import AsyncSession
from sqlmodel import select
from api.models.authz import ACL
from api.models.query import ACLResult


class ACLService:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_acls(self, resource: str = None) -> ACLResult:
        """List ACLs for a resource or all resources

        Args:
            resource (str, optional): The unique resource name. Defaults to None.

        Returns:
            ACLResult: List of ACL objects
        """
        query = select(ACL)
        if resource:
            query = query.where(ACL.resource == resource)
        res = await self.session.exec(query)
        data = res.all()
        return ACLResult(total=len(data), data=data)

    async def delete_user_permissions(self, resource: str, subject: str = None):
        """Delete ACLs for resource and optionally a specific user

        Args:
            resource (str): The unique resource name
            subject (str, optional): The unique user name. Defaults to None.
        """
        query = select(ACL).where(
            ACL.resource == resource and ACL.subject_type == "user")
        if subject:
            query = query.where(ACL.subject == subject)
        acls = await self.session.exec(query)

        if len(acls):
            for acl in acls:
                self.session.delete(acl)
            self.session.commit()

    async def apply_user_permission(self, resource: str, permission: str, subject: str) -> ACL:
        """Ensure user has permission on resource

        Args:
            resource (str): The resource name
            permission (str): The permission name
            subject (str): The subject name
        Returns:
            (ACL): The ACL object if created or found
        """
        res = await self.session.exec(
            select(ACL)
            .where(ACL.resource == resource and ACL.permission == permission and ACL.subject_type == "user" and ACL.subject == subject)
        )
        acl = res.one_or_none()

        if acl:
            # user has resource permission
            return acl

        acl = ACL(resource=resource, permission=permission,
                  subject=subject, subject_type="user")
        self.session.add(acl)
        await self.session.commit()
        return acl

    async def check_user_permission(self, resource: int, permission: str, subject: str) -> bool:
        """Check user has permission on a resource

        Args:
            resource (int): The unique resource name
            permission (str): The permission
            user (str): The unique user name

        Returns:
            (bool): True if user has permission on resource, False otherwise
        """
        res = await self.session.exec(
            select(ACL)
            .where(ACL.resource == resource and ACL.permission == permission and ACL.subject_type == "user" and ACL.subject == subject)
        )
        acl = res.one_or_none()
        if acl:
            # user has resource permission
            return True
        logging.debug(f"Permission denied: {subject} {permission} {resource}")
        return False
