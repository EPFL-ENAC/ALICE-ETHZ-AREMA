from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker
from api.config import config
import sys


# Don't load engine if pytest is running
if "pytest" not in sys.modules:
    engine = create_async_engine(config.DB_URL, echo=True, future=True)


async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
