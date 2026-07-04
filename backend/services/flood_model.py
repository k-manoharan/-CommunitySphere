import random

class FloodPredictionModel:
    @staticmethod
    def predict(precipitation_mm: float, water_level_m: float, elevation_m: float = 5.0) -> dict:
        base_score = (precipitation_mm * 1.6) + (water_level_m * 22) - (elevation_m * 1.8)
        risk_score = min(max(base_score, 0.0), 100.0)
        
        if risk_score > 75:
            severity = "High"
        elif risk_score > 40:
            severity = "Medium"
        else:
            severity = "Low"
            
        reasons = []
        if precipitation_mm > 25:
            reasons.append(f"Heavy rainfall forecast: {precipitation_mm}mm/hr")
        if water_level_m > 1.8:
            reasons.append(f"Elevated canal water levels: {water_level_m}m")
        if elevation_m < 8.0:
            reasons.append(f"Low-elevation zone topography: {elevation_m}m above sea level")
            
        if not reasons:
            reasons.append("Environmental factors are within safe thresholds.")
            
        return {
            "risk_score": round(risk_score, 1),
            "severity": severity,
            "confidence": round(82.0 + random.uniform(2.0, 12.0), 1),
            "reasons": reasons,
            "supporting_data": {
                "rainfall": f"{precipitation_mm}mm",
                "water_level": f"{water_level_m}m",
                "elevation": f"{elevation_m}m"
            }
        }
