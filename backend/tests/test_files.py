import pytest
from fastapi import HTTPException

from api.services.s3 import s3_client
from api.views.files import parse_file_path


def test_parse_file_path():
    prefix = s3_client.path_prefix
    assert parse_file_path("tmp/123/a.jpg") == ("tmp", None)
    assert parse_file_path(f"{prefix}tmp/123/a b.jpg") == ("tmp", None)
    assert parse_file_path(f"{prefix}buildings/12/1-a.jpg") == ("buildings", 12)
    assert parse_file_path("building-materials/3/x.pdf") == ("building-materials", 3)
    for bad in ["tmp", "tmp/../buildings/1/a.jpg", "buildings/abc/a.jpg", "buildings/1", "snapshots/x.zip", "/tmp/x"]:
        with pytest.raises(HTTPException):
            parse_file_path(bad)
