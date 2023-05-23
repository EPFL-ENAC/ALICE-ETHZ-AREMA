"""
Handle / requests
"""
from fastapi import Cookie, Header, APIRouter

from typing import Union
from arema.utils.auth import isUserLoggedIn

router = APIRouter()


@router.get("/ping", status_code=200, description="-- service check --")
async def ping(AuthSession: Union[str, None] = Cookie(default=None),
               Authorization: Union[str, None] = Header(default=None)):

    return {
        "status": "success",
        "is_user_logged_in": isUserLoggedIn(AuthSession, Authorization),
    }
