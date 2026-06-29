
import asyncio
import os
import uuid
from datetime import datetime
from typing import Literal

from fastapi import Depends, APIRouter, HTTPException
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel
from api.services.snapshot import SnapshotService
from api.auth import kc_service, User

router = APIRouter()

# In-memory task registry: task_id → task state
_tasks: dict[str, dict] = {}


class SnapshotTask(BaseModel):
    task_id: str
    status: Literal["pending", "done", "error"]
    error: str | None = None


async def _run_snapshot(task_id: str) -> None:
    try:
        zip_path = await SnapshotService().create_snapshot()
        _tasks[task_id]["status"] = "done"
        _tasks[task_id]["zip_path"] = zip_path
        _tasks[task_id]["filename"] = f"arema_snapshot_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    except Exception as exc:
        _tasks[task_id]["status"] = "error"
        _tasks[task_id]["error"] = str(exc)


@router.post("/",
             status_code=202,
             description="Start a snapshot export in the background")
async def create_snapshot(
        user: User = Depends(kc_service.require_admin())
) -> SnapshotTask:
    task_id = str(uuid.uuid4())
    _tasks[task_id] = {"status": "pending",
                       "zip_path": None, "error": None, "filename": None}
    asyncio.create_task(_run_snapshot(task_id))
    return SnapshotTask(task_id=task_id, status="pending")


@router.get("/{task_id}",
            description="Get the status of a snapshot task")
async def get_snapshot_status(
        task_id: str,
        user: User = Depends(kc_service.require_admin())
) -> SnapshotTask:
    task = _tasks.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return SnapshotTask(task_id=task_id, status=task["status"], error=task.get("error"))


@router.get("/{task_id}/download",
            description="Download the snapshot zip once the task is done")
async def download_snapshot(
        task_id: str,
        user: User = Depends(kc_service.require_admin())
) -> StreamingResponse:
    task = _tasks.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] == "pending":
        raise HTTPException(status_code=202, detail="Task still running")
    if task["status"] == "error":
        raise HTTPException(status_code=500, detail=task.get(
            "error", "Snapshot failed"))

    zip_path = task["zip_path"]
    filename = task["filename"]
    if not zip_path or not os.path.exists(zip_path):
        raise HTTPException(
            status_code=410, detail="Snapshot file no longer available")

    def iter_file():
        with open(zip_path, "rb") as f:
            yield f.read()
        os.remove(zip_path)
        del _tasks[task_id]

    return StreamingResponse(content=iter_file(), media_type="application/zip", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })
