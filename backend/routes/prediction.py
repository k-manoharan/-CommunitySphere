from fastapi import APIRouter
from services.flood_model import FloodPredictionModel
from services.traffic_model import TrafficPredictionModel
from services.aqi_model import AqiPredictionModel
from data_engine import CommunityDataEngine

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])
data_engine = CommunityDataEngine()

@router.get("/dashboard-data")
def get_dashboard_data():
    sensor_data = data_engine.get_realtime_sensor_data()
    predictions = {}
    
    for zone in sensor_data:
        predictions[zone["id"]] = {
            "flood": FloodPredictionModel.predict(
                zone["weather"]["precipitation_mm"], 
                zone["water_level_m"],
                elevation_m=4.0 if zone["id"] == "zone_2" else (12.0 if zone["id"] == "zone_5" else 7.0)
            ),
            "traffic": TrafficPredictionModel.predict(
                zone["traffic"]["congestion_level"], 
                12, # current hour
                "Rain" if zone["weather"]["precipitation_mm"] > 15 else "Clear"
            ),
            "aqi_forecast": AqiPredictionModel.predict(
                zone["aqi"],
                zone["traffic"]["average_speed_kmh"] / 3.0,
                zone["weather"]["temperature_c"]
            )
        }
        
    scores = []
    for zone in sensor_data:
        aqi_score = max(0, 100 - (zone["aqi"] / 3.0))
        traffic_map = {"Low": 100, "Moderate": 75, "High": 45, "Critical": 15}
        traffic_score = traffic_map[zone["traffic"]["congestion_level"]]
        flood_safety_score = 100.0 - predictions[zone["id"]]["flood"]["risk_score"]
        
        zone_health = (aqi_score + traffic_score + flood_safety_score) / 3.0
        scores.append(zone_health)
        
    overall_health_score = int(sum(scores) / len(scores))
    
    return {
        "overall_health_score": overall_health_score,
        "sensor_data": sensor_data,
        "predictions": predictions
    }

@router.get("/benchmark")
def get_benchmark():
    return data_engine.simulate_cudf_speedup()
