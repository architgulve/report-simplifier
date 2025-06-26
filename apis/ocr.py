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

reader = easyocr.Reader(["en"])

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

    prompt = f"""
You are a medical assistant. Here is a medical discharge report:

{extracted_text}

1. Extract only medicine-related instructions and return them as a valid JSON array strictly in this format, Do not add any extra information in the JSON other than what is told.
The name field should only contain the content of the notification
The time field should only contain the time of day when the notification is to be sent(morning, afternoon, evening).
If a singel medicaine has multiplae times of day then break it down into multiple notifications.
If there is no specific time that you can find assume it to be afternoon.
This data will be used to generate reminders for the user.

[
  {{
    "name": "Take 56mg Paracetamol",
    "time": "evening",
  }},
  ...
]

2. Then, provide a short diet recommendation labeled exactly as **Diet Recommendation**, with main topics:
- What to include in the diet
- What to avoid in the diet
Use info from the discharge report. As well as any general tips related to the medicines.
Return the text in a structured paragraph, in about 3-4 sentences.

Return only the JSON array and the diet recommendation. Do not include any explanations, notes, or extra text.
"""

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
                    {
                        "role": "system",
                        "content": "You are an assistant that extracts key medical instructions from discharge reports.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.4,
            },
        )

        groq_reply = response.json()["choices"][0]["message"]["content"]

        return JSONResponse(content={"text": groq_reply})

    except Exception as e:
        return JSONResponse(
            content={"text": "Error processing Groq API", "error": str(e)}
        )
