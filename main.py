# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai
import os

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="AI Startup Analyst API")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Startup Analyst API Running"}

@app.post("/evaluate")
async def evaluate_startup(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        text = content.decode("utf-8", errors="ignore")  # Decode PDF/text as plain text

        # Call OpenAI's ChatCompletion API (v1.0+)
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI startup analyst."},
                {"role": "user", "content": f"Evaluate this startup: {text}"}
            ]
        )

        result = response.choices[0].message.content
        return {
            "filename": file.filename,
            "size_in_bytes": len(content),
            "evaluation": result
        }

    except openai.error.RateLimitError:
        raise HTTPException(status_code=429, detail="OpenAI API quota exceeded. Please check your plan or API key.")

    except openai.error.OpenAIError as e:
        # Generic OpenAI API errors
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

    except Exception as e:
        # Catch-all for other errors
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
