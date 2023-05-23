FROM python:3.10.9-alpine as build-stage
WORKDIR /app
RUN apk add --no-cache \
    g++ \
    gcc \
    musl-dev \
    libc-dev \
    libffi-dev
RUN pip install poetry
COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry export --output requirements.txt


FROM python:3.10.9-alpine as production-stage
LABEL maintainer="<pierre.guilbert@epfl.ch>"
LABEL description="FastAPI upload via boto3"

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
EXPOSE 5050
WORKDIR /app
RUN apk add --no-cache \
    g++ \
    gcc \
    musl-dev \
    ca-certificates \
    ffmpeg \
    libwebp \
    libwebp-tools

COPY --from=build-stage /app/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY ./pyproject.toml ./README.md /app/
COPY ./arema /app/arema

RUN pip install --no-cache-dir .


CMD [ "uvicorn", "arema.main:app", "--host", "0.0.0.0", "--port", "5050" ]

HEALTHCHECK --interval=30s --timeout=10s --start-period=3s --retries=2 CMD wget --no-verbose --tries=1 --spider http://localhost:5050/ping || exit 1