"""
Handle / uploads
"""

import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File
from fastapi.responses import Response
from pydantic import BaseModel

from api.auth import User, kc_service
from api.db import AsyncSession, get_session
from api.services.building_materials import BuildingMaterialService
from api.services.buildings import BuildingService
from api.services.natural_resources import NaturalResourceService
from api.services.professionals import ProfessionalService
from api.services.s3 import s3_client
from api.services.technical_constructions import TechnicalConstructionService
from api.utils.files import file_checker


class FilePath(BaseModel):
    paths: list[str]


router = APIRouter()

# S3 folder of an entity's files -> service that knows who can edit it
ENTITY_SERVICES = {
    "buildings": BuildingService,
    "building-materials": BuildingMaterialService,
    "natural-resources": NaturalResourceService,
    "professionals": ProfessionalService,
    "technical-constructions": TechnicalConstructionService,
}


def parse_file_path(file_path: str) -> tuple[str, int | None]:
    """Split a file path (with or without the S3 prefix) into ("tmp", None) or (entity folder, entity id).
    Raise 403 for anything else."""
    if file_path.startswith(s3_client.path_prefix):
        file_path = file_path[len(s3_client.path_prefix) :]
    parts = file_path.split("/")
    if ".." not in parts and "" not in parts:
        if parts[0] == "tmp" and len(parts) > 1:
            return ("tmp", None)
        if len(parts) > 2 and parts[0] in ENTITY_SERVICES and parts[1].isdigit():
            return (parts[0], int(parts[1]))
    raise HTTPException(status_code=403, detail="Operation not allowed")


@router.get("/{file_path:path}", status_code=200, description="Download any assets from S3")
async def get_file(
    file_path: str, download: bool = Query(False, alias="d", description="Download file instead of inline display")
):
    (body, content_type) = await s3_client.get_file(file_path)
    if body:
        if download:
            # download file
            return Response(content=body, media_type=content_type)
        else:
            # inline image
            return Response(content=body)
    else:
        raise HTTPException(status_code=404, detail="File not found")


@router.post(
    "/tmp",
    status_code=200,
    description="Upload any assets to S3 in the /tmp folder",
    dependencies=[Depends(file_checker.check_size)],
)
async def upload_temp_files(
    files: list[UploadFile] = File(description="Multiple file upload"),
    user: User = Depends(kc_service.require_role("app-user")),
):
    current_time = datetime.datetime.now(datetime.UTC)
    # generate unique name for the files' base folder in S3
    folder_name = str(current_time.timestamp()).replace(".", "")
    folder_path = f"tmp/{folder_name}"
    children = [await s3_client.upload_file(file, s3_folder=folder_path) for file in files]
    return children


@router.delete(
    "/{file_path:path}",
    status_code=204,
    description="Delete asset present in S3 if it is in /tmp/ folder or belongs to an entity the user can edit",
)
async def delete_file(
    file_path: str,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(kc_service.require_role("app-user")),
):
    folder, entity_id = parse_file_path(file_path)
    # ponytail: tmp uploads carry no owner, any app-user may delete them; record uploader if that matters
    if entity_id is not None:
        service = ENTITY_SERVICES[folder](session)
        entity = await service.get(entity_id)
        if not service.can_edit(entity, user):
            raise HTTPException(status_code=403, detail="Not enough permissions")
    await s3_client.delete_file(file_path)
    return
