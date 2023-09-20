# enac-it4r-repo

Template with licences / github templates and contributing processes

# Todo
- [x] create the following pages with a basic on name and their store
  - [x] Natural Resource
  - [x] (OPTIONAL) List of elements of a building: BE 
  - [x] Building Material
  - [x] (OPTIONAL) Types of professionals
  - [x] Professionals
  - [x] Buildings
  - [x] List of Technical constructions

- [ ] ensure the defineSchema relationship works
- [ ] ensure type in frontend/src/definitions/regenerativeMaterials.ts
- [ ] Add all fields not mandatory to all the resources
- [ ] Optimize by calling getAll without joints

- [ ] Add form validation to at least one
- [ ] Add welcome page with a small explanation
- [ ] // TODO: make english/german translation as key
- [ ] Test conflicts and replication

## Input professionals	standards (column names must be exact) :

Encoding format: UTF-8, Separator: ',' (comma)


| Variable name         | Description                                             | Symbol    | Unit    | Data type | Mandatory       |
| --------------------- | ------------------------------------------------------- | --------- | ------- | --------- | --------------- |
| nameP                 |                              |        |    |    |               |
| addressP                 |                              |        |    |    |               |
| expertiseP                 |                              |        |    |    |               |
| webP                 |                              |        |    |    |               |
| telP                 |                              |        |    |    |               |
| emailP                 |                              |        |    |    |               |
| workswS_P                 |                              |        |    |    |               |




--> Vision

# Points d'entrées
- Soit on arrive par les humains (professionals)
- Soit les buildings


# What the .env file should look like

```sh
NODE_ENV=development
# for s3 and custom cdn (epfl dns)
DNS=128.178.15.8

S3_ENDPOINT_HOSTNAME=s3.epfl.ch
S3_ENDPOINT_PROTOCOL=https://
S3_ACCESS_KEY_ID=xxxxxxxxxxx
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_REGION=EU
S3_Bucket=xxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_Key=alice-ethz-arema-local/

# the domain where the api will be hosted + proper protocol
API_URL=https://localhost/
# use by the frontend and admin to request infos (for http and ws)
API_PATH=/api

DATABASE_USERNAME=postgres
DATABASE_PASSWORD=xxx
DATABASE_NAME=backend
DATABASE_HOST=postgre

DATABASE_URL=postgres://postgres:xxx@postgres:5432/backend
```