import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL, SQLITE_FALLBACK_URL

logger = logging.getLogger("uvicorn")

Base = declarative_base()
active_db_type = "unknown"

# Convert standard postgresql:// to postgresql+psycopg2:// for SQLAlchemy compatibility
formatted_db_url = DATABASE_URL
if formatted_db_url.startswith("postgresql://") and not formatted_db_url.startswith("postgresql+"):
    formatted_db_url = formatted_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

try:
    # Attempt connecting to PostgreSQL
    postgres_engine = create_engine(
        formatted_db_url, 
        pool_pre_ping=True, 
        connect_args={"connect_timeout": 3} if "postgresql" in formatted_db_url else {}
    )
    with postgres_engine.connect() as conn:
        logger.info(f"Connected to PostgreSQL database at {DATABASE_URL}")
    engine = postgres_engine
    active_db_type = "PostgreSQL"
except Exception as e:
    logger.warning(
        f"Could not connect to PostgreSQL ({e}). Falling back to SQLite for seamless execution: {SQLITE_FALLBACK_URL}"
    )
    engine = create_engine(
        SQLITE_FALLBACK_URL, 
        connect_args={"check_same_thread": False}
    )
    active_db_type = "SQLite (Local fallback - set DATABASE_URL for Postgres)"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_active_db_type():
    return active_db_type
