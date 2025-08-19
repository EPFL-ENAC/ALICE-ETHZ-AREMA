from datetime import datetime
from fastapi import HTTPException
from api.db import AsyncSession
from api.models.domain import Entity
from api.auth import User
from api.services.mailer import Mailer


class EntityService:
    """Base service for entity operations"""

    def __init__(self, session: AsyncSession, entityType: str):
        self.session = session
        self.entityType = entityType
        self.folder = f"{self.entityType}s"

    def can_edit(self, entity: Entity, user: User) -> bool:
        """Check if the user can edit the entity"""
        if user is None:
            return False
        if user.username == entity.created_by:
            return True
        if "app-reviewer" in user.realm_roles or "app-administrator" in user.realm_roles:
            return True
        return False

    async def assign(self, entity: Entity, assignee: str | None) -> Entity:
        """Assign the entity to a user"""
        entity.assigned_to = assignee
        entity.assigned_at = datetime.now() if assignee else None
        await self.session.commit()
        if assignee:
            await Mailer().send_review_assigned_email(self.entityType, entity.id, entity.name, assignee)
        return entity

    async def apply_state(self, entity: Entity, state: str, user: User) -> Entity:
        """Set the state of the entity"""
        valid_states = ["draft", "in-review", "to-publish", "to-unpublish",
                        "published", "locked", "to-delete"]
        if state not in valid_states:
            raise HTTPException(
                status_code=400, detail=f"Invalid state: {state}")
        switcher = {
            "draft": self._set_draft,
            "in-review": self._set_in_review,
            "to-publish": self._set_to_publish,
            "to-unpublish": self._set_to_unpublish,
            "published": self._set_locked,
            "locked": self._set_locked,
            "to-delete": self._set_to_delete
        }
        set_state_func = switcher.get(state)
        if set_state_func:
            notification_states = ["in-review",
                                   "to-publish", "to-unpublish", "to-delete"]
            if state in notification_states:
                await Mailer().send_state_transition_email(self.entityType, entity.id, entity.name, state)
            return set_state_func(entity, user)
        else:
            raise HTTPException(
                status_code=400, detail=f"State change to {state} not allowed")

    def _set_in_review(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to in-review"""
        if entity.state == "in-review":
            return entity
        if entity.state != "draft" and entity.state != "to-publish":
            raise HTTPException(
                status_code=400, detail="Entity must be in draft or to-publish state to be reviewed")
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "in-review"
        return entity

    def _set_to_publish(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to to-publish"""
        if entity.state == "to-publish":
            return entity
        if entity.state != "in-review":
            raise HTTPException(
                status_code=400, detail="Entity must be in review to be published")
        if self._is_contributor(user):
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "to-publish"
        return entity

    def _set_to_unpublish(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to to-unpublish"""
        if entity.state == "to-unpublish":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "to-unpublish"
        return entity

    def _set_draft(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to draft"""
        if entity.state == "draft":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "draft"
        entity.assigned_to = None
        entity.assigned_at = None
        return entity

    def _set_locked(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to locked"""
        if entity.state == "locked":
            return entity
        if "app-administrator" not in user.realm_roles:
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "locked"
        return entity

    def _set_to_delete(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to to-delete"""
        if entity.state == "to-delete":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=403, detail="Operation not allowed")
        entity.state = "to-delete"
        return entity

    def _is_contributor(self, user: User) -> bool:
        return "app-contributor" in user.realm_roles

    def _is_author(self, entity: Entity, user: User) -> bool:
        return entity.created_by == user.username or entity.updated_by == user.username
