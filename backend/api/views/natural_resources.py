from fastapi import APIRouter, Depends, Query
from api.db import get_session, AsyncSession
from api.auth import kc_service, User
from api.models.domain import NaturalResource
from api.models.results import NaturalResourceResult

router = APIRouter()


@router.get("/", response_model=NaturalResourceResult)
async def find(
    filter: str = Query(None),
    sort: str = Query(None),
    range: str = Query(None),
    session: AsyncSession = Depends(get_session),
) -> NaturalResourceResult:
    """Search for Natural Resources"""
    return NaturalResourceResult(total=0, skip=0, limit=0, data=[])