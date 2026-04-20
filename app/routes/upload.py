

import os
import shutil
from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/upload")

UPLOAD_DIR = "uploads"

@router.post("/")
def upload_image(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "url": f"http://127.0.0.1:8000/uploads/{file.filename}"
    }