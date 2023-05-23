"""
Entrypoint for FastAPI application
https://fastapi.tiangolo.com/tutorial/bigger-applications/
"""
from fastapi import FastAPI
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware

from arema import __name__ as title
from arema import __version__
from arema.config import CORS_ENABLED, root_path
from arema.routers import ping
from arema.routers import root
from arema.routers import files

app = FastAPI(
    title=title,
    version=__version__,
    root_path=root_path,
    docs_url='{}/docs'.format(root_path),
    redoc_url='{}/redoc'.format(root_path),
    openapi_url='{}/openapi.json'.format(root_path),
)

if not CORS_ENABLED:
    logger.warn("cors disabled")
else:
    logger.warn("cors enabled")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(root.router)
app.include_router(ping.router)
app.include_router(files.router)
