
from datetime import datetime
import os

from fastapi import Depends, APIRouter
from fastapi.responses import Response
from api.services.snapshot import SnapshotService
from api.auth import kc_service, User

router = APIRouter()


@router.post("/",
             description="Make a new snapshot")
async def create_snapshot(
        user: User = Depends(kc_service.require_admin())
) -> Response:
    zip_path = await SnapshotService().create_snapshot()
    # Stream the zip file as a response
    with open(zip_path, "rb") as f:
        data = f.read()
    os.remove(zip_path)  # Clean up the temporary file
    filename = f"arema_snapshot_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    return Response(content=data, media_type="application/zip", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })
