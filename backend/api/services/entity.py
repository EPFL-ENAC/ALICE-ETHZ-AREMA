from fastapi import HTTPException
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

    def apply_state(self, entity: Entity, state: str, user: User) -> Entity:
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
                status_code=402, detail="Operation not allowed")
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
                status_code=402, detail="Operation not allowed")
        entity.state = "to-publish"
        return entity

    def _set_to_unpublish(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to to-unpublish"""
        if entity.state == "to-unpublish":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=402, detail="Operation not allowed")
        entity.state = "to-unpublish"
        return entity

    def _set_draft(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to draft"""
        if entity.state == "draft":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=402, detail="Operation not allowed")
        entity.state = "draft"
        return entity

    def _set_locked(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to locked"""
        if entity.state == "locked":
            return entity
        if "app-administrator" not in user.realm_roles:
            raise HTTPException(
                status_code=402, detail="Operation not allowed")
        entity.state = "locked"
        return entity

    def _set_to_delete(self, entity: Entity, user: User) -> Entity:
        """Change the state of the entity to to-delete"""
        if entity.state == "to-delete":
            return entity
        if self._is_contributor(user) and not self._is_author(entity, user):
            raise HTTPException(
                status_code=402, detail="Operation not allowed")
        entity.state = "to-delete"
        return entity

    def _is_contributor(user: User) -> bool:
        return "app-contributor" in user.realm_roles

    def _is_author(self, entity: Entity, user: User) -> bool:
        return entity.created_by == user.username or entity.updated_by == user.username
