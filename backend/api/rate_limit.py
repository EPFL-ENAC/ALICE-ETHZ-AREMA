from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from api.config import config

limiter = Limiter(key_func=get_remote_address)


def _rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "error.rate_limit_exceeded"},
    )


def setup_rate_limiting(app: FastAPI) -> None:
    if not config.RATE_LIMIT_ENABLED:
        return
    limiter.default_limits = [config.RATE_LIMIT_DEFAULT]
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)
    app.add_middleware(SlowAPIMiddleware)
