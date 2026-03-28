import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

# Fallback to local sqlite for dev if Postgres URL varies
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./skyguide.db")

# Create Async Engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=False, 
    future=True,
    # Additional pool config for production
    pool_size=10, 
    max_overflow=20
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

# Dependency to yield session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
