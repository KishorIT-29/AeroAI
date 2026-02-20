import os
import random
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AeroAI Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

class FlightData(BaseModel):
    altitude: float
    latitude: float
    longitude: float
    wind_speed: float
    pressure: float
    humidity: float
    temperature: float

class PredictionResponse(BaseModel):
    probability: float
    risk_level: str
    suggestion: str
    next_30_min: List[float]

@app.get("/")
async def root():
    return {"message": "AeroAI Aviation Safety API is running"}

@app.post("/predict_turbulence", response_model=PredictionResponse)
async def predict_turbulence(data: FlightData):
    # Simulated ML Prediction Logic
    # In a real scenario, this would use a pre-trained scikit-learn model
    
    # Simple logic to simulate turbulence based on wind and pressure
    base_prob = (data.wind_speed / 100) * 40 + (1013 - data.pressure) * 0.5
    prob = max(0, min(100, base_prob + random.uniform(-5, 5)))
    
    risk_level = "Low"
    if prob > 70:
        risk_level = "High"
    elif prob > 40:
        risk_level = "Medium"
        
    suggestions = {
        "Low": "Conditions are stable. Maintain current flight path.",
        "Medium": "Mild turbulence expected. Consider ascending 2000ft for smoother air.",
        "High": "Severe turbulence ahead. Immediate altitude change or course correction recommended."
    }
    
    # Generate mock timeline for 30 mins
    next_30 = [max(0, min(100, prob + random.uniform(-10, 10))) for _ in range(10)]
    
    return {
        "probability": round(prob, 2),
        "risk_level": risk_level,
        "suggestion": suggestions[risk_level],
        "next_30_min": next_30
    }

class VoiceRequest(BaseModel):
    text: str
    flight_context: Optional[dict] = None

@app.post("/voice_assistant")
async def voice_assistant(request: VoiceRequest):
    if not model:
        return {"response": "Voice assistant is in offline mode (API key missing). SkyAssist recommends maintaining standard procedures."}
    
    prompt = f"""
    You are 'SkyAssist', a professional and advanced AI flight assistant for pilots.
    You are part of the AeroAI system.
    The pilot is asking: '{request.text}'
    Context: {request.flight_context if request.flight_context else 'Default flight parameters'}
    
    Provide a concise, professional, and helpful response. Use aviation terminology where appropriate.
    Keep it short as it will be spoken back to the pilot.
    """
    
    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"SkyAssist encountered an error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
