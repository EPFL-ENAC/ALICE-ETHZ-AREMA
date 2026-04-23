# Import endpoints from external services
import httpx
from fastapi import APIRouter, Depends
from api.auth import kc_service, User
from api.models.importer import IGLehmProject, IGLehmProjectSummary
from bs4 import BeautifulSoup
from markdownify import markdownify as md

router = APIRouter()


@router.get("/iglehm/projects")
async def get_iglehm_projects(
    user: User = Depends(kc_service.get_user_info()),
) -> list[IGLehmProjectSummary]:
    """Get all projects from IG Lehm"""
    # fetch IG Lehm projects from https://www.iglehm.ch/ccm/api/v1/projects
    async with httpx.AsyncClient() as client:
        response = await client.get("https://www.iglehm.ch/ccm/api/v1/projects")
        response.raise_for_status()
        return [IGLehmProjectSummary(**project) for project in response.json()]


@router.get("/iglehm/project/{cId}")
async def get_iglehm_project(
    cId: int,
    user: User = Depends(kc_service.get_user_info()),
) -> IGLehmProject:
    """Get a project from IG Lehm by its cId"""
    # fetch IG Lehm project from https://www.iglehm.ch/ccm/api/v1/project/{cId}
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://www.iglehm.ch/ccm/api/v1/project/{cId}")
        response.raise_for_status()
        project = IGLehmProject(**response.json())
        html = project.content
        if html:
            soup = BeautifulSoup(html, "html.parser")
            project.content = md(str(soup))
        return project
