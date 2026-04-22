env_path=../.env

install:
	uv sync

run:
	uv run dotenv -f "$(env_path)" run uvicorn api.main:app

lint:
	uv run pre-commit run --all-files

db-upgrade:
	uv run dotenv -f "$(env_path)" run alembic upgrade head

db-downgrade:
	uv run dotenv -f "$(env_path)" run alembic downgrade -1

db-revision:
	uv run dotenv -f "$(env_path)" run alembic revision --autogenerate -m "$(name)"

seed:
	curl -X PUT 'http://localhost:8000/seed' -H 'accept: application/json'

es-health:
	curl http://localhost:9200/_cluster/health?pretty

docker-build:
	docker build -t alice-arema-backend .
