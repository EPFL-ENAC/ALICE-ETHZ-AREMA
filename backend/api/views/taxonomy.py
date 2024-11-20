from fastapi import APIRouter
from api.models.taxonomy import Taxonomy
from api.services.taxonomy import TaxonomyService

router = APIRouter()


@router.get("/", response_model=Taxonomy, response_model_exclude_none=True)
async def find() -> Taxonomy:
    """Get all taxonomies"""
    return TaxonomyService().getAll()


@router.get("/{type}", response_model=Taxonomy, response_model_exclude_none=True)
async def get(type: str) -> Taxonomy:
    """Get a natural resource by id"""
    return TaxonomyService().get(type)
