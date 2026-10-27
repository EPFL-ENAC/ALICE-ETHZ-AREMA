import asyncio
from unittest.mock import AsyncMock, MagicMock

import pytest
from enacit4r_auth.models.auth import AppUser, AppUserDraft, User
from fastapi import HTTPException

from api.views import users


def make_app_user(roles: list[str]) -> AppUser:
    return AppUser(id="abc", username="test", email="test@me.com", first_name="Foo", last_name="Bar", roles=roles)


def make_user() -> User:
    return User(
        id="abc",
        username="test",
        email="test@me.com",
        first_name="Foo",
        last_name="Bar",
        realm_roles=[],
        client_roles=[],
    )


@pytest.fixture
def kc_admin(monkeypatch):
    kc_admin = MagicMock()
    kc_admin.get_user = AsyncMock()
    kc_admin.update_user = AsyncMock(side_effect=lambda app_user: app_user)
    monkeypatch.setattr(users, "kc_admin_service", kc_admin)
    return kc_admin


def test_register_existing_user(kc_admin):
    kc_admin.get_user.return_value = make_app_user(["app-user"])
    item = AppUserDraft(username="test", email="test@me.com", first_name="Foo", last_name="Bar", password="Passw0rd!")
    with pytest.raises(HTTPException) as e:
        # unwrap the rate limiter decorator
        asyncio.run(users.register.__wrapped__(MagicMock(), item, MagicMock()))
    assert e.value.detail == "error.registration_failed"
    kc_admin.create_user.assert_not_called()


def test_join(kc_admin):
    tasks = MagicMock()
    kc_admin.get_user.return_value = make_app_user(["other-role"])
    app_user = asyncio.run(users.join(tasks, make_user()))
    assert app_user.roles == ["other-role", "app-contributor"]
    kc_admin.update_user.assert_called_once()
    tasks.add_task.assert_called_once()


def test_join_already_member(kc_admin):
    tasks = MagicMock()
    kc_admin.get_user.return_value = make_app_user(["app-user", "app-reviewer"])
    app_user = asyncio.run(users.join(tasks, make_user()))
    assert app_user.roles == ["app-user", "app-reviewer"]
    kc_admin.update_user.assert_not_called()
    tasks.add_task.assert_not_called()


def test_find_with_identity_providers(kc_admin):
    kc_admin.get_users = AsyncMock(return_value=[make_app_user(["app-user"])])
    kc_admin.kc_admin.get_user_social_logins.return_value = [{"identityProvider": "github", "userId": "123"}]
    result = asyncio.run(users.find(make_user()))
    assert result.data[0].identity_providers == ["github"]


def test_update_password_with_identity_provider(kc_admin):
    kc_admin.kc_admin.get_user_social_logins.return_value = [{"identityProvider": "google", "userId": "123"}]
    with pytest.raises(HTTPException) as e:
        asyncio.run(users.update_password("abc", users.AppUserPassword(password="Passw0rd!"), make_user()))
    assert e.value.detail == "error.password_with_identity_provider"
    kc_admin.update_user_password.assert_not_called()
