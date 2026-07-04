import random

class TrafficPredictionModel:
    @staticmethod
    def predict(current_congestion: str, hour: int, weather: str) -> list:
        base_scores = {"Low": 15, "Moderate": 45, "High": 75, "Critical": 92}
        score = base_scores.get(current_congestion, 45)
        
        forecast = []
        for offset in [1, 6, 24]:
            target_hour = (hour + offset) % 24
            
            # Simulated congestion weight factors
            rush_hour_factor = 1.35 if (7 <= target_hour <= 9 or 17 <= target_hour <= 19) else 0.75
            weather_factor = 1.30 if weather in ["Rainy", "Heavy Rain", "Stormy"] else 1.0
            
            predicted_score = min(max(score * rush_hour_factor * weather_factor, 5.0), 100.0)
            
            if predicted_score > 75:
                label = "Critical Congestion"
            elif predicted_score > 50:
                label = "Heavy Traffic"
            elif predicted_score > 25:
                label = "Moderate Flow"
            else:
                label = "Clear Roadways"
                
            forecast.append({
                "time_offset_hours": offset,
                "hour_of_day": target_hour,
                "predicted_score": round(predicted_score, 1),
                "label": label
            })
            
        return forecast
