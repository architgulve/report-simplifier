from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import easyocr
import shutil
import os
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

reader = easyocr.Reader(['en'])

# Replace with your Groq API key
GROQ_API_KEY = ""

@app.post("/ocr/")
async def ocr_and_reminders(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = reader.readtext(temp_path, detail=0)
    os.remove(temp_path)

    extracted_text = " ".join(result)

    prompt = f"""You are a helpful assistant. Here is a medical discharge report:\n\n{extracted_text}\n\nFrom this, extract reminders in bullet points. Keep it short and clear."""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": "You are an assistant that extracts key medical instructions from discharge reports."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4
            }
        )

        groq_reply = response.json()["choices"][0]["message"]["content"]

        return JSONResponse(content={"text": groq_reply})

    except Exception as e:
        return JSONResponse(content={"text": "Error processing Groq API", "error": str(e)})
