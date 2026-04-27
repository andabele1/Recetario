from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

password = quote_plus("aNDABELE*1")

DATABASE_URL = "postgresql+psycopg://postgres:aNDABELE*1@localhost:5432/postgres"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(    
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()