
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.engine import make_url
from config import settings

# Check the Railway database URL without exposing credentials
try:
    parsed_url = make_url(settings.database_url)
    print("Database driver:", parsed_url.drivername, flush=True)
    print("Database host:", parsed_url.host, flush=True)
except Exception as error:
    print("Database URL format error:", type(error).__name__, flush=True)
    print("URL starts with:", repr(settings.database_url[:15]), flush=True)
    raise

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


class Base(DeclarativeBase):
    pass
