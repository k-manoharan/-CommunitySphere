import random

class RiskPredictionEngine:
    @staticmethod
    def predict_flood_risk(precipitation_mm, water_level_m, elevation_m=5.0):
        """
        Calculates flood risk based on precipitation, water levels and zone elevation.
        Returns a dictionary containing risk status, confidence, and Explainable AI reasoning.
        """
        # Risk score calculation
        base_score = (precipitation_mm * 1.5) + (water_level_m * 20) - (elevation_m * 2)
        risk_score = min(max(base_score, 0.0), 100.0)
        
        if risk_score > 75:
            severity = "High"
        elif risk_score > 40:
            severity = "Medium"
        else:
            severity = "Low"
            
        # Explanations
        reasons = []
        if precipitation_mm > 30:
            reasons.append(f"Excessive precipitation forecast: {precipitation_mm}mm/hr")
        if water_level_m > 2.0:
            reasons.append(f"Critical local river water level: {water_level_m}m")
        if elevation_m < 10.0:
            reasons.append(f"Low-lying terrain profile: {elevation_m}m above sea level")
            
        if not reasons:
            reasons.append("Environmental metrics within safe historical thresholds.")
            
        return {
            "risk_score": round(risk_score, 1),
            "severity": severity,
            "confidence": round(80.0 + random.uniform(5.0, 15.0), 1),
            "reasons": reasons,
            "supporting_data": {
                "rainfall_24h": f"{precipitation_mm}mm",
                "water_depth": f"{water_level_m}m",
                "terrain_elevation": f"{elevation_m}m"
            }
        }

    @staticmethod
    def predict_traffic_congestion(current_level, hour_of_day, weather_condition):
        """
        Predicts traffic levels for the next 1h, 6h, and 24h.
        """
        base_levels = {"Low": 20, "Moderate": 50, "High": 80, "Critical": 95}
        current_score = base_levels.get(current_level, 50)
        
        # Simulated prediction offsets
        forecast = []
        for offset_hours in [1, 6, 24]:
            offset_hour = (hour_of_day + offset_hours) % 24
            
            # Rush hours
            rush_multiplier = 1.3 if (7 <= offset_hour <= 9 or 17 <= offset_hour <= 19) else 0.8
            weather_multiplier = 1.25 if weather_condition in ["Rain", "Heavy Rain", "Storm"] else 1.0
            
            predicted_score = min(max(current_score * rush_multiplier * weather_multiplier, 10.0), 100.0)
            
            if predicted_score > 80:
                pred_label = "Critical Congestion"
            elif predicted_score > 55:
                pred_label = "Heavy Traffic"
            elif predicted_score > 30:
                pred_label = "Moderate Flow"
            else:
                pred_label = "Clear Roadways"
                
            forecast.append({
                "time_offset_hours": offset_hours,
                "hour_of_day": offset_hour,
                "predicted_score": round(predicted_score, 1),
                "label": pred_label
            })
            
        return forecast

    @staticmethod
    def predict_aqi_forecast(current_aqi, wind_speed_kmh, temp_c):
        """
        Forecasts Air Quality Index for the next 3 days.
        """
        forecast = []
        for day in range(1, 4):
            # AQI changes based on wind (high wind disperses pollution) and temperature inversions
            wind_effect = -1.2 * wind_speed_kmh
            temp_effect = 0.8 * temp_c
            random_variance = random.uniform(-10.0, 10.0)
            
            predicted_aqi = current_aqi + wind_effect + temp_effect + random_variance
            predicted_aqi = min(max(predicted_aqi, 10.0), 500.0)
            
            if predicted_aqi <= 50:
                status = "Good"
            elif predicted_aqi <= 100:
                status = "Moderate"
            elif predicted_aqi <= 150:
                status = "Unhealthy for Sensitive Groups"
            else:
                status = "Unhealthy"
                
            forecast.append({
                "day": f"Day {day}",
                "aqi": int(predicted_aqi),
                "status": status
            })
            
        return forecast
