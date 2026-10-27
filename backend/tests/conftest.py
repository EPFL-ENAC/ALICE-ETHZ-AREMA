import os

# dummy settings so that api.config loads without a .env (no service is contacted in tests)
for key in [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "KEYCLOAK_API_ID",
    "KEYCLOAK_API_SECRET",
    "S3_ENDPOINT_PROTOCOL",
    "S3_ENDPOINT_HOSTNAME",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_REGION",
    "S3_BUCKET",
    "S3_PATH_PREFIX",
    "ES_URL",
]:
    os.environ.setdefault(key, "test")
os.environ.setdefault("DB_PORT", "5432")
