"""
IPO-Radar FastAPI Backend Server
High-performance REST API with real-time multi-agent streaming and forensic analysis.
"""

import os
import json
import asyncio
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data.sample_ipos import SAMPLE_IPOS
from agents.orchestrator import analyze_ipo

app = FastAPI(
    title="IPO-Radar API",
    description="Autonomous Multi-Agent Financial Intelligence & Forensic Due-Diligence Engine",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomIPOInput(BaseModel):
    company_name: str
    ticker: str
    sector: str = "Technology / Financial Services"
    price_band: str = "₹100 - ₹110"
    issue_price: float
    gmp_rupees: float = 0.0
    qib_subscription_x: float = 1.0
    nii_subscription_x: float = 1.0
    retail_subscription_x: float = 1.0
    fresh_issue_cr: float
    ofs_cr: float
    anchor_book_cr: float = 0.0
    pre_promoter_holding_pct: float = 60.0
    post_promoter_holding_pct: float = 45.0
    groq_api_key: Optional[str] = None

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "IPO-Radar Multi-Agent Backend",
        "agents": ["Valuation Auditor", "Demand Forecaster", "Dilution Auditor", "Consensus Arbiter"],
        "default_model": "Llama-3.3-70B via Groq / Cognitive Engine"
    }

@app.get("/api/ipos")
def list_ipos():
    """Returns catalog of pre-indexed landmark Indian IPO offerings."""
    catalog = []
    for key, data in SAMPLE_IPOS.items():
        total_issue = data["fresh_issue_cr"] + data["ofs_cr"]
        ofs_ratio = (data["ofs_cr"] / total_issue * 100.0) if total_issue > 0 else 0.0
        catalog.append({
            "key": key,
            "company_name": data["company_name"],
            "ticker": data["ticker"],
            "sector": data["sector"],
            "listing_date": data["listing_date"],
            "issue_price": data["issue_price"],
            "price_band": data["price_band"],
            "total_issue_cr": total_issue,
            "ofs_ratio_pct": round(ofs_ratio, 1),
            "actual_day1_return": data["actual_outcome"]["day1_gain_pct"]
        })
    return catalog

@app.get("/api/ipo/{key}")
def get_ipo_analysis(key: str, api_key: Optional[str] = None):
    """Executes or fetches the full multi-agent deliberation for a sample IPO."""
    key_upper = key.upper()
    if key_upper not in SAMPLE_IPOS:
        raise HTTPException(status_code=404, detail=f"IPO '{key}' not found in sample corpus.")
    
    ipo_data = SAMPLE_IPOS[key_upper]
    analysis = analyze_ipo(ipo_data, groq_api_key=api_key)
    analysis["actual_outcome"] = ipo_data.get("actual_outcome", {})
    return analysis

@app.post("/api/analyze")
def analyze_custom_ipo(payload: CustomIPOInput):
    """Accepts custom or dynamic IPO inputs and runs the full 4-agent swarm."""
    custom_dict = payload.model_dump()
    groq_key = custom_dict.pop("groq_api_key", None)
    analysis = analyze_ipo(custom_dict, groq_api_key=groq_key)
    return analysis

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
