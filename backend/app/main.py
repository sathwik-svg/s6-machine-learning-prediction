from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "attrition_model.joblib"

model = joblib.load(MODEL_PATH)

app = FastAPI(
    title="S6 Machine Learning Prediction API",
    description="Employee attrition prediction service powered by scikit-learn.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)
    monthly_income: float = Field(..., gt=0)
    years_at_company: float = Field(..., ge=0)
    job_satisfaction: int = Field(..., ge=1, le=5)
    overtime: str
    work_life_balance: int = Field(..., ge=1, le=5)


@app.get("/")
def root():
    return {
        "project": "S6 Machine Learning Prediction",
        "status": "online",
        "service": "Employee Attrition Prediction API",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": MODEL_PATH.exists(),
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    input_data = pd.DataFrame([{
        "age": request.age,
        "monthly_income": request.monthly_income,
        "years_at_company": request.years_at_company,
        "job_satisfaction": request.job_satisfaction,
        "overtime": request.overtime,
        "work_life_balance": request.work_life_balance,
    }])

    prediction = int(model.predict(input_data)[0])

    probability = model.predict_proba(input_data)[0][1]

    return {
        "prediction": "High Attrition Risk" if prediction == 1 else "Low Attrition Risk",
        "attrition": bool(prediction),
        "probability": round(float(probability), 4),
        "risk_percentage": round(float(probability) * 100, 2),
    }
