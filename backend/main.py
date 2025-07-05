from fastapi import FastAPI, Query
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is working!"}

@app.get("/suggest")
def suggest(mood: str = Query(..., description="How are you feeling?")):
    prompt = f"I'm feeling {mood}. Suggest a practical and gentle strategy to help with this."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive and thoughtful mental health assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7,
        )

        suggestion = response.choices[0].message.content.strip()
        return {"suggestion": suggestion}

    except Exception as e:
        return {"error": str(e)}
