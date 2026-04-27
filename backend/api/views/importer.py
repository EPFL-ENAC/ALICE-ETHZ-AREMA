# Import endpoints from external services
import httpx
from fastapi import APIRouter, Depends, HTTPException
from api.db import AsyncSession, get_session
from api.auth import kc_service, User
from api.models.importer import IGLehmProject, IGLehmProjectSummary
from api.services.buildings import BuildingService
from bs4 import BeautifulSoup
from markdownify import markdownify as md

_IGLEHM_API_URL = "https://www.iglehm.ch/ccm/api/v1"
_IGLEHM_TIMEOUT = httpx.Timeout(10.0, connect=5.0)

router = APIRouter()


@router.get("/iglehm/projects")
async def get_iglehm_projects(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.get_user_info()),
) -> list[IGLehmProjectSummary]:
    """Get all projects from IG Lehm"""
    iglehm_buildings = await BuildingService(
        session).find_by_source_prefix("iglehm:")
    # fetch IG Lehm projects from https://www.iglehm.ch/ccm/api/v1/projects
    try:
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/projects")
            response.raise_for_status()
            summaries = [IGLehmProjectSummary(**project)
                         for project in response.json()]
            # Find matching building for each project and set building_id in summary
            for project_summary in summaries:
                for building in iglehm_buildings:
                    if building.source == f"iglehm:{project_summary.cId}":
                        project_summary.building_id = building.id
                        break
            return summaries
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504, detail="IG Lehm API timed out") from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502, detail=f"IG Lehm API returned {exc.response.status_code}") from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502, detail="IG Lehm API unreachable") from exc


@router.get("/iglehm/project/{cId}")
async def get_iglehm_project(
    cId: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.get_user_info()),
) -> IGLehmProject:
    """Get a project from IG Lehm by its cId"""
    # fetch IG Lehm project from https://www.iglehm.ch/ccm/api/v1/project/{cId}
    try:
        building = await BuildingService(session).find_by_source(f"iglehm:{cId}")
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/project/{cId}")
            response.raise_for_status()
            project = IGLehmProject(**response.json())
            html = project.content
            if html:
                soup = BeautifulSoup(html, "html.parser")
                project.content = md(str(soup))
            if building:
                project.building_id = building.id
            return project
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504, detail="IG Lehm API timed out") from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502, detail=f"IG Lehm API returned {exc.response.status_code}") from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502, detail="IG Lehm API unreachable") from exc
