from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.services.natural_resources import NaturalResourceService
from api.services.building_materials import BuildingMaterialService
from api.services.technical_constructions import TechnicalConstructionService
from api.services.buildings import BuildingService
from api.services.professionals import ProfessionalService
from api.models.query import GroupByResult
from enacit4r_sql.utils.query import paramAsDict
from api.auth import kc_service, User

router = APIRouter()


@router.get("/frequencies/natural-resource")
async def count_natural_resources(
        filter: str = Query(None),
        by: str = Query(None),
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_any_role(
            ["app-administrator", "app-reviewer", "app-contributor"])
        )) -> GroupByResult:
    """Count filtered natural resources grouped by a field"""
    service = NaturalResourceService(session)
    res = await service.count_group_by(paramAsDict(filter), by)
    return res


@router.get("/frequencies/building-material")
async def count_building_materials(
        filter: str = Query(None),
        by: str = Query(None),
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_any_role(
            ["app-administrator", "app-reviewer", "app-contributor"])
        )) -> GroupByResult:
    """Count filtered building materials grouped by a field"""
    service = BuildingMaterialService(session)
    res = await service.count_group_by(paramAsDict(filter), by)
    return res


@router.get("/frequencies/technical-construction")
async def count_technical_constructions(
        filter: str = Query(None),
        by: str = Query(None),
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_any_role(
            ["app-administrator", "app-reviewer", "app-contributor"])
        )) -> GroupByResult:
    """Count filtered technical constructions grouped by a field"""
    service = TechnicalConstructionService(session)
    res = await service.count_group_by(paramAsDict(filter), by)
    return res


@router.get("/frequencies/building")
async def count_buildings(
        filter: str = Query(None),
        by: str = Query(None),
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_any_role(
            ["app-administrator", "app-reviewer", "app-contributor"])
        )) -> GroupByResult:
    """Count filtered buildings grouped by a field"""
    service = BuildingService(session)
    res = await service.count_group_by(paramAsDict(filter), by)
    return res


@router.get("/frequencies/professional")
async def count_professionals(
        filter: str = Query(None),
        by: str = Query(None),
        session: AsyncSession = Depends(get_session),
        user: User = Depends(kc_service.require_any_role(
            ["app-administrator", "app-reviewer", "app-contributor"])
        )) -> GroupByResult:
    """Count filtered professionals grouped by a field"""
    service = ProfessionalService(session)
    res = await service.count_group_by(paramAsDict(filter), by)
    return res
