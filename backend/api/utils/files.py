from enacit4r_files.utils.files import FileChecker
from api.models.domain import FileItem
from api.services.s3 import s3_client
import urllib.parse
from logging import debug

file_checker = FileChecker()

async def moveTempFile(item: FileItem, i: int, s3_folder: str) -> FileItem:
    """Move a file from /tmp/ to a folder and ensure the file name is unique"""
    if "/tmp/" in item.ref.path:
      try:
          new_name = f"{i + 1}-{item.ref.name}"
          file_path = f"{s3_folder}/{new_name}"
          new_key = await s3_client.move_file(item.ref.path, file_path)
          item.ref.name = new_name
          item.ref.path = urllib.parse.quote(new_key)
          if item.ref.alt_path is not None:
              new_name = f"{i + 1}-{item.ref.alt_name}"
              new_key = await s3_client.move_file(item.ref.alt_path, f"{s3_folder}/{new_name}")
              item.ref.alt_name = new_name
              item.ref.alt_path = urllib.parse.quote(new_key)
      except Exception as e:
          debug(f"Error moving file {item.ref.path}: {e}")
    return item
