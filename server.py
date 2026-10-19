"""
ENIGMA 5789 M + JIMMY AI: UNIVERSAL BACKEND SERVER
==================================================
Runs cross-platform (Linux, Windows, macOS, console/embedded web engines).
Serves the master dashboard interface and processes Jimmy AI telemetry.
"""

import os
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Enigma 5789 + Jimmy AI Master Engine",
    description="Multi-platform intelligence server for global nation modeling and hazard forecasting.",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StreamRecord(BaseModel):
    id: str
    source: str
    category: str  # Observation, Interpretation, Hypothesis, Speculation, Unsupported
    corroboration_score: float
    confidence: float
    p_r_score: float
    m_r_score: float
    p_m_score: float

class PipelineRequest(BaseModel):
    records: List[StreamRecord]

@app.get("/", response_class=HTMLResponse)
def index():
    """Serves the main HTML dashboard interface."""
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>Enigma 5789 Engine Active. Save index.html in the root directory.</h1>"

@app.post("/api/v1/process-telemetry")
def process_telemetry(payload: PipelineRequest):
    """Processes incoming stream records through the Jimmy AI kill-test filter."""
    valid_records = []
    for r in payload.records:
        if r.category in {"Speculation", "Unsupported"} and r.corroboration_score < 0.35:
            continue
        valid_records.append(r)

    return {
        "status": "success",
        "ingested_count": len(payload.records),
        "retained_count": len(valid_records),
        "locked_series_mean": {
            "p_r": sum(r.p_r_score for r in valid_records) / max(len(valid_records), 1),
            "m_r": sum(r.m_r_score for r in valid_records) / max(len(valid_records), 1),
            "p_m": sum(r.p_m_score for r in valid_records) / max(len(valid_records), 1),
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
  
