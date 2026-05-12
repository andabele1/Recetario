import os
import shutil

from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/upload")

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://127.0.0.1:8000")


@router.post("/")
def upload_image(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"{APP_BASE_URL}/uploads/{file.filename}"}

