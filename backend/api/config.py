from pydantic import model_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Config(BaseSettings):

    # Postgres settings
    DB_HOST: str
    DB_PORT: int  # 5432
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str  # postgres
    DB_PREFIX: str = "postgresql+asyncpg"
    DB_URL: str | None = None

    # Keycloak
    KEYCLOAK_REALM: str = "AREMA"
    KEYCLOAK_URL: str = "https://enac-it-sso.epfl.ch"
    KEYCLOAK_API_ID: str
    KEYCLOAK_API_SECRET: str

    PATH_PREFIX: str = "/api"

    S3_ENDPOINT_PROTOCOL: str
    S3_ENDPOINT_HOSTNAME: str
    S3_ACCESS_KEY_ID: str
    S3_SECRET_ACCESS_KEY: str
    S3_REGION: str
    S3_BUCKET: str
    S3_PATH_PREFIX: str

    @model_validator(mode="before")
    def form_db_url(cls, values: dict) -> dict:
        """Form the DB URL from the settings"""
        if "DB_URL" not in values:
            values[
                "DB_URL"
            ] = "{prefix}://{user}:{password}@{host}:{port}/{db}".format(
                prefix=values["DB_PREFIX"],
                user=values["DB_USER"],
                password=values["DB_PASSWORD"],
                host=values["DB_HOST"],
                port=values["DB_PORT"],
                db=values["DB_NAME"],
            )
        return values


@lru_cache()
def get_config():
    return Config()


config = get_config()
