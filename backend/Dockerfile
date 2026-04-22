FROM python:3.11-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/
ENV PYTHONPATH="$PYTHONPATH:/app"

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
    git \
		g++ \
		libpq-dev \
		libgl1 \
		gdal-bin \
		libgdal-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock /app/
RUN uv sync --frozen --no-install-project

COPY alembic.ini start.sh /app/
COPY migrations /app/migrations
COPY api /app/api

ENV PATH="/app/.venv/bin:$PATH"

ENTRYPOINT ["sh", "start.sh"]
