from arema.config import settings
from requests import get
from fastapi import Cookie, Header
from typing import Union
from fastapi.exceptions import HTTPException
from fastapi.logger import logger


def isUserLoggedIn(AuthSession: Union[str, None] = Cookie(default=None),
                   Authorization: Union[str, None] = Header(default=None)):
    # we should retrieve two authentication way
    # for azure users the Authorization: `Bearer ${token}`, header
    # for couchdb user the  Cookie: AuthSession=xxxx
    # prioritize cookie over headers
    cookies = {'AuthSession': AuthSession}
    headers = {}
    if AuthSession is None or AuthSession == "":
        headers = {'Authorization': Authorization}
    r = get(settings.AUTH_SERVER + "/_session",
            cookies=cookies,
            headers=headers)
    userCtx = r.json().get("userCtx")
    if (userCtx.get("name") is None):
        logger.error(f"user is not recognised {str(userCtx)}")
    return userCtx.get("name") is not None


async def authorization_checker(
        AuthSession: Union[str, None] = Cookie(default=None),
        Authorization: Union[str, None] = Header(default=None)):
    if (not isUserLoggedIn(AuthSession, Authorization)):
        raise HTTPException(status_code=401,
                            detail="You are not authenticated")
