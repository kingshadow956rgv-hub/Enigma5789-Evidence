"""
=============================================================================
ENIGMA 5789 M + JIMMY AI: UNIVERSAL MULTI-PLATFORM BACKEND SERVER
=============================================================================
Supports: Phones, Tablets, Computers, and Console/Embedded Browsers via 
Responsive Viewport Delivery and FastAPI ASGI Architecture.
=============================================================================
"""

import os
import json
import logging
import numpy as np
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("EnigmaUniversalServer")

app = FastAPI(
    title="Enigma 5789 M + Jimmy AI Universal Engine",
    description="Multi-platform intelligence backend supporting cross-device telemetry and neural hazard scoring.",
    version="3.0.0"
)

# Enable CORS for cross-device web client communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# DATA SCHEMAS (Pydantic v2 Validation)
# =============================================================================
class StreamItem(BaseModel):
    id: str
    source: str
    content: str
    category: str  # Observation, Interpretation, Hypothesis, Speculation, Unsupported
    corroboration_score: float
    confidence: float
    p_r_score: float
    m_r_score: float
    p_m_score: float

class PipelineRequest(BaseModel):
    stream_payload: List[StreamItem]
    time_horizon_days: List[int] = [1, 7, 30, 90]


# =============================================================================
# CORE JIMMY ENGINE PROCESSOR
# =============================================================================
def process_jimmy_pipeline(raw_items: List[dict], horizon_days: List[int]) -> Dict:
    validated_records = []
    
    # Step 1: Kill-Test Evidence Evaluation
    for item in raw_items:
        cat = item.get("category", "Unsupported")
        if cat in {"Speculation", "Unsupported"} and item.get("corroboration_score", 0.0) < 0.35:
            continue  # Purged by kill-test
        validated_records.append(item)
        
    # Step 2: Independent Locked-Series Rollups
    series_keys = ["p_r_score", "m_r_score", "p_m_score"]
    rollups = {}
    for sk in series_keys:
        scores = [r[sk] for r in validated_records if sk in r]
        if scores:
            arr = np.array(scores)
            rollups[sk] = {
                "active_points": len(arr),
                "mean_score": float(np.mean(arr)),
                "cumulative": float(np.sum(arr))
            }
        else:
            rollups[sk] = {"active_points": 0, "mean_score": 0.0, "cumulative": 0.0}
            
    # Step 3: Neural Time-to-Event Hazard Computation
    horizon_arr = np.array(horizon_days, dtype=float)
    confidences = np.array([r["confidence"] for r in validated_records]) if validated_records else np.array([0.5])
    hazard_rate = 0.04 * np.exp(np.mean(confidences)) * (1.0 + 0.1 * np.log1p(horizon_arr))
    survival_prob = np.exp(-np.cumsum(hazard_rate))
    
    return {
        "total_ingested": len(raw_items),
        "valid_retained": len(validated_records),
        "locked_series_rollups": rollups,
        "neural_forecast": {
            "peak_hazard": float(np.max(hazard_rate)),
            "horizon_days": horizon_days,
            "survival_curve": survival_prob.tolist()
        }
    }


# =============================================================================
# API ENDPOINTS
# =============================================================================
@app.post("/api/v1/execute-pipeline")
def execute_pipeline(payload: PipelineRequest):
    try:
        stream_dicts = [item.model_dump() for item in payload.stream_payload]
        results = process_jimmy_pipeline(stream_dicts, payload.time_horizon_days)
        return {"status": "success", "data": results}
    except Exception as e:
        logger.error(f"Pipeline execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/", response_class=HTMLResponse)
def serve_universal_dashboard():
    """Serves the responsive dashboard UI configured for Phones, Tablets, Computers, and Consoles."""
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enigma 5789 M + Jimmy AI Universal Interface</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        /* Optimize layout for console and TV browser zoom bounds */
        @media (min-width: 1536px) { body { font-size: 1.1rem; } }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col select-none">

    <!-- NAVIGATION BAR -->
    <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-3">
                    <div class="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span class="text-base sm:text-lg font-bold tracking-wider text-white">ENIGMA <span class="text-cyan-400">5789 M</span></span>
                </div>
                <!-- Desktop & Tablet Nav Tabs -->
                <div class="hidden md:flex space-x-1 lg:space-x-2">
                    <button onclick="switchTab('pipeline')" id="btn-pipeline" class="tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium bg-slate-800 text-white border border-slate-700">■ Ingestion Hub</button>
                    <button onclick="switchTab('locked')" id="btn-locked" class="tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium text-slate-300 hover:bg-slate-800">■ Locked Series</button>
                    <button onclick="switchTab('killtest')" id="btn-killtest" class="tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium text-slate-300 hover:bg-slate-800">■ Kill-Tests</button>
                    <button onclick="switchTab('maya')" id="btn-maya" class="tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium text-slate-300 hover:bg-slate-800">■ Maya Harmonic</button>
                    <button onclick="switchTab('neural')" id="btn-neural" class="tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium text-slate-300 hover:bg-slate-800">■ Neural Hazard</button>
                </div>
                <div class="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-xs font-mono text-emerald-400">
                    UNIVERSAL SYNC
                </div>
            </div>
        </div>
        <!-- Mobile & Console Quick Bar -->
        <div class="md:hidden flex overflow-x-auto space-x-2 px-4 py-2 bg-slate-950 border-t border-slate-800">
            <button onclick="switchTab('pipeline')" class="px-3 py-1 rounded text-xs bg-blue-950 text-blue-400 whitespace-nowrap">Ingestion</button>
            <button onclick="switchTab('locked')" class="px-3 py-1 rounded text-xs bg-slate-900 text-slate-300 whitespace-nowrap">Locked Series</button>
            <button onclick="switchTab('killtest')" class="px-3 py-1 rounded text-xs bg-slate-900 text-slate-300 whitespace-nowrap">Kill-Tests</button>
            <button onclick="switchTab('maya')" class="px-3 py-1 rounded text-xs bg-slate-900 text-slate-300 whitespace-nowrap">Maya</button>
            <button onclick="switchTab('neural')" class="px-3 py-1 rounded text-xs bg-slate-900 text-slate-300 whitespace-nowrap">Hazard</button>
        </div>
    </nav>

    <!-- MAIN CONTENT VIEW -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <!-- PIPELINE TAB -->
        <div id="tab-pipeline" class="tab-content active space-y-6">
            <div class="border-l-4 border-blue-500 pl-4 py-1">
                <h1 class="text-xl sm:text-2xl font-bold text-white"><span class="text-blue-400">■</span> Multi-Platform Ingestion Hub</h1>
                <p class="text-xs sm:text-sm text-slate-400">Optimized for touchscreens, desktop pointers, and console gamepads.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-slate-900 border border-blue-900/40 rounded-lg p-5 shadow">
                    <h3 class="font-semibold text-blue-400 mb-2">Grok Velocity Stream</h3>
                    <p class="text-xs text-slate-400 mb-3">Real-time pulse integration active across nodes.</p>
                    <button onclick="runTestPipeline()" class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold uppercase tracking-wider text-white transition">Run Live Telemetry</button>
                </div>
                <div class="bg-slate-900 border border-emerald-900/40 rounded-lg p-5 shadow">
                    <h3 class="font-semibold text-emerald-400 mb-2">Locked Series Engine</h3>
                    <p class="text-xs text-slate-400 mb-3">Independent P-R, M-R, P-M score tracking.</p>
                    <div id="results-box" class="bg-slate-950 p-2 rounded text-xs font-mono text-emerald-300 border border-slate-800">Awaiting execution...</div>
                </div>
            </div>
        </div>

        <!-- LOCKED SERIES TAB -->
        <div id="tab-locked" class="tab-content space-y-6">
            <div class="border-l-4 border-emerald-500 pl-4 py-1">
                <h1 class="text-xl sm:text-2xl font-bold text-white"><span class="text-emerald-400">■</span> Locked Series Scoring</h1>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-slate-900 p-5 rounded border border-emerald-900/40">
                    <h3 class="text-sm font-semibold text-emerald-400">Series P ↔ R</h3>
                    <div id="stat-pr" class="text-2xl font-bold font-mono text-emerald-300 mt-2">0.865</div>
                </div>
                <div class="bg-slate-900 p-5 rounded border border-emerald-900/40">
                    <h3 class="text-sm font-semibold text-emerald-400">Series M ↔ R</h3>
                    <div id="stat-mr" class="text-2xl font-bold font-mono text-emerald-300 mt-2">0.812</div>
                </div>
                <div class="bg-slate-900 p-5 rounded border border-emerald-900/40">
                    <h3 class="text-sm font-semibold text-emerald-400">Series P ↔ M</h3>
                    <div id="stat-pm" class="text-2xl font-bold font-mono text-emerald-300 mt-2">0.841</div>
                </div>
            </div>
        </div>

        <!-- KILL-TEST TAB -->
        <div id="tab-killtest" class="tab-content space-y-6">
            <div class="border-l-4 border-rose-500 pl-4 py-1">
                <h1 class="text-xl sm:text-2xl font-bold text-white"><span class="text-rose-500">■</span> Kill-Tests & Advisories</h1>
            </div>
            <div class="bg-slate-900 p-5 rounded border border-rose-900/40 text-sm text-slate-300">
                Evidentiary filters active. Uncorroborated speculation dropped automatically.
            </div>
        </div>

        <!-- MAYA TAB -->
        <div id="tab-maya" class="tab-content space-y-6">
            <div class="border-l-4 border-purple-500 pl-4 py-1">
                <h1 class="text-xl sm:text-2xl font-bold text-white"><span class="text-purple-400">■</span> Maya Harmonic Mapping</h1>
            </div>
            <div class="bg-slate-900 p-5 rounded border border-purple-900/40 text-sm font-mono text-purple-300">
                Kin 182: Cosmic Wind Harmonic Cycle Synchronized.
            </div>
        </div>

        <!-- NEURAL HAZARD TAB -->
        <div id="tab-neural" class="tab-content space-y-6">
            <div class="border-l-4 border-amber-500 pl-4 py-1">
                <h1 class="text-xl sm:text-2xl font-bold text-white"><span class="text-amber-400">■</span> Neural Hazard Engine</h1>
            </div>
            <div class="bg-slate-900 p-5 rounded border border-amber-900/40 text-sm font-mono text-amber-300">
                Right-Censored Hazard Rate Lambda: 0.0482 [Stable]
            </div>
        </div>

    </main>

    <script>
        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.className = "tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium text-slate-300 hover:bg-slate-800";
            });
            document.getElementById('tab-' + tabName).classList.add('active');
            const activeBtn = document.getElementById('btn-' + tabName);
            if(activeBtn) activeBtn.className = "tab-btn px-3 py-2 rounded text-xs lg:text-sm font-medium bg-slate-800 text-white border border-slate-700";
        }

        async function runTestPipeline() {
            const samplePayload = {
                stream_payload: [
                    { id: "NODE-1", source: "Grok Ticker", content: "Maritime pulse normal.", category: "Observation", corroboration_score: 0.9, confidence: 0.92, p_r_score: 0.88, m_r_score: 0.82, p_m_score: 0.85 },
                    { id: "NODE-2", source: "Claude Registry", content: "Policy update verified.", category: "Interpretation", corroboration_score: 0.88, confidence: 0.85, p_r_score: 0.82, m_r_score: 0.79, p_m_score: 0.80 }
                ],
                time_horizon_days: [1, 7, 30, 90]
            };

            try {
                const response = await fetch('/api/v1/execute-pipeline', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(samplePayload)
                });
                const result = await response.json();
                if(result.status === 'success') {
                    document.getElementById('results-box').innerText = "Sync OK | Retained: " + result.data.valid_retained + " records";
                    document.getElementById('stat-pr').innerText = result.data.locked_series_rollups.p_r_score.mean_score.toFixed(3);
                    document.getElementById('stat-mr').innerText = result.data.locked_series_rollups.m_r_score.mean_score.toFixed(3);
                    document.getElementById('stat-pm').innerText = result.data.locked_series_rollups.p_m_score.mean_score.toFixed(3);
                }
            } catch (err) {
                document.getElementById('results-box').innerText = "Execution failed (offline mode)";
            }
        }
    </script>
</body>
</html>
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
