from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import easyocr
import shutil
import os

app = FastAPI()

# CORS for Expo Go
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

reader = easyocr.Reader(['en'])

@app.post("/ocr/")
async def ocr_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = reader.readtext(temp_path, detail=0)
    os.remove(temp_path)
    return JSONResponse(content={"text": " ".join(result)})
