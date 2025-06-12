"""
Handle / uploads
"""
import datetime

from fastapi.datastructures import UploadFile
from fastapi.param_functions import File
from fastapi import Depends, Query, APIRouter, HTTPException
from fastapi.responses import Response

from api.services.s3 import s3_client
from api.auth import kc_service, User
from api.utils.files import file_checker

from pydantic import BaseModel


class FilePath(BaseModel):
    paths: list[str]


router = APIRouter()


@router.get("/{file_path:path}",
            status_code=200,
            description="Download any assets from S3")
async def get_file(file_path: str,
                   download: bool = Query(
                       False, alias="d", description="Download file instead of inline display")):
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


@router.post("/tmp",
             status_code=200,
             description="Upload any assets to S3 in the /tmp folder",
             dependencies=[Depends(file_checker.check_size)])
async def upload_temp_files(
        files: list[UploadFile] = File(description="Multiple file upload"),
        user: User = Depends(kc_service.require_admin())
):
    current_time = datetime.datetime.now()
    # generate unique name for the files' base folder in S3
    folder_name = str(current_time.timestamp()).replace('.', '')
    folder_path = f"tmp/{folder_name}"
    children = [await s3_client.upload_file(file, s3_folder=folder_path) for file in files]
    return children


@router.delete("/{file_path:path}",
               status_code=204,
               description="Delete asset present in S3 if it is in /tmp/ folder",
               )
async def delete_temp_files(
    file_path: str,
    user: User = Depends(kc_service.require_admin())
):
    # delete file at path
    await s3_client.delete_file(file_path)
    return
