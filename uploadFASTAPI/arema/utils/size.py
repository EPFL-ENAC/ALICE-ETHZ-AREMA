from fastapi.exceptions import HTTPException
from fastapi.datastructures import UploadFile

# 10 MB in binary
max_size = 10 * 1024 * 1024


async def file_size_checker(content: bytes | str):
    file_size = len(content)
    if file_size > max_size:
        detail = f"File size {file_size} exceeds max size {max_size}"
        raise HTTPException(400, detail=detail)


async def size_checker(files: list[UploadFile]):
    for file in files:
        content = await file.read()
        await file_size_checker(content)
        await file.seek(0)
    return files
