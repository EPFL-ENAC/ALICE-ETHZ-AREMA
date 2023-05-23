install:
	poetry env use python; poetry install

run:
	poetry env use python; poetry run dotenv -f ../.env run uvicorn arema.main:app --reload

lint:
	poetry run pre-commit run --all-files
