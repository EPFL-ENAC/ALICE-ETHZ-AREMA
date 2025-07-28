from api.models.domain import Entity
from api.auth import User


class EntityService:
    """Base service for entity operations"""

    def can_edit(self, entity: Entity, user: User) -> bool:
        """Check if the user can edit the entity"""
        if user is None:
            return False
        if user.username == entity.created_by:
            return True
        if "app-reviewer" in user.realm_roles or "app-administrator" in user.realm_roles:
            return True
        return False
