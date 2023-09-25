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
DNS=128.178.15.8

S3_ENDPOINT_HOSTNAME=s3.epfl.ch
S3_ENDPOINT_PROTOCOL=https://
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_REGION=EU
S3_Bucket=xxxxx-xxxxx
S3_Key=alice-ethz-arema-suffix/

API_URL=https://localhost
API_PATH=/api

DATABASE_USERNAME=postgres
DATABASE_PASSWORD=xxxxx
DATABASE_NAME=myDbNAME
DATABASE_HOST=localhost

DATABASE_URL=postgres://postgres:xxxxx@localhost:5432/myDbNAME
ADMIN_PASSWORD="xxxx"
ADMIN_EMAIL="no-reply@epfl.ch"
FEATHERS_SECRET="xxxxxxxxxxxxxxxx"
```