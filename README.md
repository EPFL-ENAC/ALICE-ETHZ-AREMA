# AREMA

Atlas of REgenerative MAterials

# Development

## Environment 

What the .env file should look like for the AREMA backend:

```sh
# Postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=arema
DB_PREFIX=postgresql+asyncpg
# PostGIS
DB_GIS_HOST=localhost
DB_GIS_PORT=5433
DB_GIS_USER=postgres
DB_GIS_PASSWORD=password
DB_GIS_NAME=arema_gis
# FastAPI prefix
PATH_PREFIX=
# Keycloak
KEYCLOAK_REALM=AREMA
KEYCLOAK_URL=https://enac-it-sso.epfl.ch
KEYCLOAK_API_ID=local-api
KEYCLOAK_API_SECRET=xxxxx
# S3
S3_ENDPOINT_PROTOCOL=https://
S3_ENDPOINT_HOSTNAME=s3.epfl.ch
S3_REGION=EU
S3_ACCESS_KEY_ID=xxxxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET=xxxxx
S3_PATH_PREFIX=arema/local/
# Elasticsearch
ES_URL=http://localhost:9200
```
## Manage external services

Local Postgres database:

```sh
make run-db
```

Local Elasticsearch:

```sh
make run-es
```

Local PostGIS database (used by Martin):

```sh
make run-gis
```

Local Martin tiles server:

```sh
make run-martin
```
