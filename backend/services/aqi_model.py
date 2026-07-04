import random

class AqiPredictionModel:
    @staticmethod
    def predict(current_aqi: int, wind_speed: float, temperature: float) -> list:
        forecast = []
        for day in range(1, 4):
            # Simulation calculation: wind disperses pollution, high temp traps it
            wind_effect = -1.5 * wind_speed
            temp_effect = 0.9 * temperature
            variance = random.uniform(-12.0, 12.0)
            
            predicted_aqi = current_aqi + wind_effect + temp_effect + variance
            predicted_aqi = min(max(predicted_aqi, 0.0), 500.0)
            
            if predicted_aqi <= 50:
                status = "Good"
            elif predicted_aqi <= 100:
                status = "Moderate"
            elif predicted_aqi <= 150:
                status = "Unhealthy for Sensitive Groups"
            elif predicted_aqi <= 200:
                status = "Unhealthy"
            else:
                status = "Very Unhealthy"
                
            forecast.append({
                "day": f"Day {day}",
                "aqi": int(predicted_aqi),
                "status": status
            })
            
        return forecast
