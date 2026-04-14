from fastapi import FastAPI
from app.db.database import engine, Base
from app.routes import recipes, ingredients

app = FastAPI()

# Crear tablas automáticamente (solo dev)
Base.metadata.create_all(bind=engine)

app.include_router(recipes.router)
app.include_router(ingredients.router)