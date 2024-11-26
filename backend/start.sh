# Run migrations
poetry run alembic upgrade head
uvicorn --host=0.0.0.0 --timeout-keep-alive=0 api.main:app --reload