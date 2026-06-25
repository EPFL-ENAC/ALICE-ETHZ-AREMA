from fastapi import APIRouter
from api.models.taxonomy import Taxonomy
from api.services.taxonomy import TaxonomyService

router = APIRouter()


@router.get("/", response_model=Taxonomy, response_model_exclude_none=True)
async def find() -> Taxonomy:
    """Get all taxonomies"""
    return TaxonomyService().get_all()


@router.get("/{type}", response_model=Taxonomy, response_model_exclude_none=True)
async def get(type: str) -> Taxonomy:
    """Get a taxonomy by type"""
    return TaxonomyService().get(type)
