import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from db.database import Base, engine
from routes import ingredients, recipes, upload

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend funcionando 🚀"}

# Crear tablas automáticamente (solo dev)
Base.metadata.create_all(bind=engine)

app.include_router(recipes.router)
app.include_router(ingredients.router)
app.include_router(upload.router)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    # Lee el puerto de Render, si no existe usa el 8000
    port = int(os.environ.get("PORT", 8000))
    # Corre uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)     
    