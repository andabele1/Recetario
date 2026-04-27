from fastapi import FastAPI
from app.db.database import engine, Base
from app.routes import recipes, ingredients, upload
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas automáticamente (solo dev)
Base.metadata.create_all(bind=engine)

app.include_router(recipes.router)
app.include_router(ingredients.router)
app.include_router(upload.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
