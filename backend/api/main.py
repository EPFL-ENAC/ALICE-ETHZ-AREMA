import os
from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.config import config
from api.db import get_session, AsyncSession
from logging import basicConfig, INFO, DEBUG
from pydantic import BaseModel
from sqlalchemy.sql import text
from api.views.files import router as files_router
from api.views.natural_resources import router as natural_resources_router
from api.views.building_materials import router as building_materials_router
from api.views.technical_constructions import router as technical_constructions_router
from api.views.buildings import router as buildings_router
from api.views.professionals import router as professionals_router
from api.views.taxonomy import router as taxonomy_router

basicConfig(level=DEBUG)

app = FastAPI(root_path=config.PATH_PREFIX)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""
    status: str = "OK"


@app.get(
    "/healthz",
    tags=["Healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
async def get_health(
    session: AsyncSession = Depends(get_session),
) -> HealthCheck:
    """
    Endpoint to perform a healthcheck on for kubenernetes liveness and
    readiness probes.
    """
    # Check DB connection
    try:
        await session.exec(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {e}")

    return HealthCheck(status="OK")

app.include_router(
    files_router,
    prefix="/files",
    tags=["Files"],
)

app.include_router(
    natural_resources_router,
    prefix="/natural-resource",
    tags=["Natural Resources"],
)

app.include_router(
    building_materials_router,
    prefix="/building-material",
    tags=["Building Materials"],
)

app.include_router(
    technical_constructions_router,
    prefix="/technical-construction",
    tags=["Technical Constructions"],
)

app.include_router(
    buildings_router,
    prefix="/building",
    tags=["Buildings"],
)

app.include_router(
    professionals_router,
    prefix="/professional",
    tags=["Professionals"],
)

app.include_router(
    taxonomy_router,
    prefix="/taxonomy",
    tags=["Taxonomies"],
)