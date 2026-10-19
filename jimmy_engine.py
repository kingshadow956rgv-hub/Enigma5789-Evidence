import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

# ==========================================
# 1. EVIDENCE CLASSIFICATION & KILL-TEST
# ==========================================
class EvidenceClassifier:
    """Classifies incoming feeds and executes strict evidentiary kill-tests."""
    
    VALID_CATEGORIES = {"Observation", "Interpretation", "Hypothesis", "Speculation", "Unsupported"}
    
    @staticmethod
    def evaluate_evidence(record: Dict) -> Dict:
        category = record.get("category", "Unsupported")
        if category not in EvidenceClassifier.VALID_CATEGORIES:
            category = "Unsupported"
            
        # Kill-test filter: downgrade speculation or unsupported items with low source corroboration
        is_killed = False
        if category in {"Speculation", "Unsupported"} and record.get("corroboration_score", 0.0) < 0.4:
            is_killed = True
            category = "Unsupported"
            
        return {
            "record_id": record.get("id"),
            "timestamp_utc": record.get("timestamp_utc", datetime.now(timezone.utc).isoformat()),
            "source": record.get("source"),
            "category": category,
            "is_killed": is_killed,
            "confidence": record.get("confidence", 0.0)
        }

# ==========================================
# 2. LOCKED-SERIES INDEPENDENT SCORING ENGINE
# ==========================================
class LockedSeriesScorer:
    """Computes independent roll-ups for P<->R, M<->R, and P<->M without zeroing missing days."""
    
    @staticmethod
    def compute_period_rollup(active_records: List[Dict], series_type: str) -> Dict[str, float]:
        if not active_records:
            return {"active_days": 0, "mean_score": 0.0, "cumulative_score": 0.0}
            
        scores = []
        for rec in active_records:
            # Extract specific verification weight based on series type
            if series_type == "P_R": # Prediction vs Real-World
                val = rec.get("p_r_score", 0.0)
            elif series_type == "M_R": # Maya Symbolism vs Real-World
                val = rec.get("m_r_score", 0.0)
            elif series_type == "P_M": # Prediction vs Maya Framework
                val = rec.get("p_m_score", 0.0)
            else:
                val = 0.0
            scores.append(val)
            
        arr = np.array(scores)
        return {
            "active_days": len(arr),
            "mean_score": float(np.mean(arr)),
            "cumulative_score": float(np.sum(arr)),
            "std_deviation": float(np.std(arr)) if len(arr) > 1 else 0.0
        }

# ==========================================
# 3. NEURAL TIME-TO-EVENT & HAZARD MODEL
# ==========================================
class NeuralHazardPredictor:
    """Calculates right-censored hazard rates and survival curves for Jimmy AI forecasts."""
    
    def __init__(self, base_hazard: float = 0.05):
        self.base_hazard = base_hazard  # Lambda_0(t)
        
    def compute_hazard_and_survival(self, feature_vector: np.ndarray, weights: np.ndarray, t_horizon: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Computes hazard rate lambda(t | X) = lambda_0(t) * exp(f_theta(X))
        and survival distribution S(t | X) = exp(-integral of hazard).
        """
        linear_comb = np.dot(feature_vector, weights)
        exp_factor = np.exp(linear_comb)
        
        # Time-dependent hazard array
        hazard_rate = self.base_hazard * exp_factor * (1.0 + 0.1 * np.log1p(t_horizon))
        
        # Cumulative hazard integral approximation
        cum_hazard = np.cumsum(hazard_rate)
        survival_prob = np.exp(-cum_hazard)
        
        return hazard_rate, survival_prob

# ==========================================
# 4. JIMMY AI MASTER ORCHESTRATOR
# ==========================================
class JimmyMasterOrchestrator:
    """Orchestrates ingestion, classification, locked-series scoring, and neural forecasting."""
    
    def __init__(self):
        self.classifier = EvidenceClassifier()
        self.scorer = LockedSeriesScorer()
        self.hazard_engine = NeuralHazardPredictor()
        
    def process_pipeline(self, raw_stream: List[Dict], weights: np.ndarray, time_horizon: np.ndarray) -> Dict:
        # Step 1: Clean and evaluate evidence through kill-tests
        processed_records = [self.classifier.evaluate_evidence(rec) for rec in raw_stream]
        valid_records = [r for r in processed_records if not r["is_killed"]]
        
        # Step 2: Compute independent locked-series roll-ups
        pr_score = self.scorer.compute_period_rollup(valid_records, "P_R")
        mr_score = self.scorer.compute_period_rollup(valid_records, "M_R")
        pm_score = self.scorer.compute_period_rollup(valid_records, "P_M")
        
        # Step 3: Run neural hazard prediction across time horizon
        # Aggregate mean feature representation from valid records if available
        sample_features = np.array([r.get("confidence", 0.5) for r in valid_records]) if valid_records else np.array([0.5])
        avg_feature = np.mean(sample_features) * np.ones(len(weights))
        
        hazard, survival = self.hazard_engine.compute_hazard_and_survival(avg_feature, weights, time_horizon)
        
        return {
            "status": "success",
            "total_ingested": len(raw_stream),
            "valid_after_killtest": len(valid_records),
            "locked_series_scores": {
                "P_R": pr_score,
                "M_R": mr_score,
                "P_M": pm_score
            },
            "neural_forecast": {
                "final_survival_probability": float(survival[-1]) if len(survival) > 0 else 1.0,
                "peak_hazard_rate": float(np.max(hazard)) if len(hazard) > 0 else 0.0
            }
        }
