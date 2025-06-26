env_path=../.env

install:
	poetry install

run:
	poetry run dotenv -f "$(env_path)" run uvicorn api.main:app

lint:
	poetry run pre-commit run --all-files

db-upgrade:
	poetry run dotenv -f "$(env_path)" run alembic upgrade head

db-downgrade:
	poetry run dotenv -f "$(env_path)" run alembic downgrade -1

db-revision:
	poetry run dotenv -f "$(env_path)" run alembic revision --autogenerate -m "$(name)"

seed:
	curl -X PUT 'http://localhost:8000/seed' -H 'accept: application/json'
