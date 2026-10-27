# AREMA

Atlas of REgenerative MAterials

# Development

## Environment 

Copy [.env.example](.env.example) to `.env` and fill in the secrets:

```sh
cp .env.example .env
```

## Manage external services

### Database

For storing Draft data (used by admin app):

Local Postgres database:

```sh
make run-db
```

For storing storing Published data (used by frontend map):

Local Elasticsearch:

```sh
make run-es
```
