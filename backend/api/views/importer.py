# Import endpoints from external services
import httpx
from fastapi import APIRouter, Depends, HTTPException
from api.db import AsyncSession, get_session
from api.auth import kc_service, User
from api.models.importer import IGLehmProject, IGLehmProjectSummary, IGLehmSpecialistSummary, IGLehmSpecialist
from api.services.buildings import BuildingService
from api.services.professionals import ProfessionalService
from bs4 import BeautifulSoup
from markdownify import markdownify as md

_IGLEHM_API_URL = "https://www.iglehm.ch/ccm/api/v1"
_IGLEHM_TIMEOUT = httpx.Timeout(10.0, connect=5.0)

router = APIRouter()


@router.get("/iglehm/specialists")
async def get_iglehm_specialists(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.get_user_info()),
) -> list[IGLehmSpecialistSummary]:
    """Get all specialists from IG Lehm"""
    try:
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/specialists")
            response.raise_for_status()
            summaries = [IGLehmSpecialistSummary(
                **specialist) for specialist in response.json()]
            # Find matching professional for each specialist and set professional_id in summary
            iglehm_professionals = await ProfessionalService(session).find_by_source_prefix("iglehm:")
            for specialist_summary in summaries:
                for professional in iglehm_professionals:
                    if professional.source == f"iglehm:{specialist_summary.cId}":
                        specialist_summary.professional_id = professional.id
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


@router.get("/iglehm/specialist/{cId}")
async def get_iglehm_specialist(
    cId: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.get_user_info()),
) -> IGLehmSpecialist:
    """Get a specialist from IG Lehm by its cId"""
    try:
        async with httpx.AsyncClient(timeout=_IGLEHM_TIMEOUT) as client:
            response = await client.get(f"{_IGLEHM_API_URL}/specialist/{cId}")
            response.raise_for_status()
            specialist = IGLehmSpecialist(**response.json())
            specialist.description = _to_md(specialist.description)
            specialist.address = _one_liner(_to_md(specialist.address))
            professional = await ProfessionalService(session).find_by_source(f"iglehm:{cId}")
            if professional:
                specialist.professional_id = professional.id
            if specialist.projects:
                for project in specialist.projects:
                    building = await BuildingService(session).find_by_source(f"iglehm:{project.cId}")
                    if building:
                        if specialist.building_ids is None:
                            specialist.building_ids = []
                        specialist.building_ids.append(building.id)
            return specialist
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504, detail="IG Lehm API timed out") from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502, detail=f"IG Lehm API returned {exc.response.status_code}") from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502, detail="IG Lehm API unreachable") from exc


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
            project.description = _to_md(project.description)
            project.content = _to_md(project.content)
            project.location = _one_liner(_to_md(project.location))
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


def _to_md(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    return md(str(soup))


def _one_liner(text: str) -> str:
    if not text:
        return ""
    return " ".join(text.split())
