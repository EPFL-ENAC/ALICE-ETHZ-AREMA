"""
Handle / requests
"""
from fastapi import APIRouter

from arema import __name__ as name
from arema import __version__

router = APIRouter()


@router.get("/")
async def root():
    """
    Get Info
    """
    return {"name": name, "version": __version__}
