# Import endpoints from external services
import httpx
from fastapi import APIRouter, Depends, HTTPException
from api.auth import kc_service, User
from api.models.importer import IGLehmProject, IGLehmProjectSummary
from bs4 import BeautifulSoup
from markdownify import markdownify as md

_IGLEHM_API_URL = "https://www.iglehm.ch/ccm/api/v1"
_IGLEHM_TIMEOUT = httpx.Timeout(10.0, connect=5.0)

router = APIRouter()


@router.get("/iglehm/projects")
async def get_iglehm_projects(
    user: User = Depends(kc_service.get_user_info()),
) -> list[IGLehmProjectSummary]:
    """Get all projects from IG Lehm"""
    # fetch IG Lehm projects from https://www.iglehm.ch/ccm/api/v1/projects
    try:
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/projects")
            response.raise_for_status()
            return [IGLehmProjectSummary(**project) for project in response.json()]
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
    user: User = Depends(kc_service.get_user_info()),
) -> IGLehmProject:
    """Get a project from IG Lehm by its cId"""
    # fetch IG Lehm project from https://www.iglehm.ch/ccm/api/v1/project/{cId}
    try:
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/project/{cId}")
            response.raise_for_status()
            project = IGLehmProject(**response.json())
            html = project.content
            if html:
                soup = BeautifulSoup(html, "html.parser")
                project.content = md(str(soup))
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
