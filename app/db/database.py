import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://yo:8jPBUgQ3sHo3tJSgXKLKEYtOkCuEJhCd@dpg-d81lkgho3t8c739edpbg-a/recetario_1ijf"
)


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
Base = declarative_base()
