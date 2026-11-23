from fastapi.testclient import TestClient

from api.main import app

ENTITY_GETS = [
    f"/{name}/{suffix}"
    for name in [
        "building-element",
        "building-material",
        "building",
        "natural-resource",
        "professional",
        "subject-profile",
        "technical-construction",
    ]
    for suffix in ["", "1"]
] + ["/building/1/building-element"]


def test_entity_reads_require_auth():
    client = TestClient(app)
    for path in ENTITY_GETS:
        assert client.get(path).status_code in (401, 403), path
