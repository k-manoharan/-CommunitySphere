from fastapi import APIRouter

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

live_alerts = [
    {
        "alert_id": 101,
        "type": "Flood Warning",
        "severity": "High",
        "location": "East Coast (Zone 2)",
        "message": "High water level detected at East Coast river bank. Rainfall intensity increasing.",
        "created_at": "10 minutes ago"
    },
    {
        "alert_id": 102,
        "type": "Pollution Warning",
        "severity": "Medium",
        "location": "Central Business District (Zone 5)",
        "message": "AQI levels have exceeded 200. Residents with respiratory issues should stay indoors.",
        "created_at": "1 hour ago"
    },
    {
        "alert_id": 103,
        "type": "Traffic Congestion",
        "severity": "Low",
        "location": "West Suburbs (Zone 3)",
        "message": "Minor congestion on Bypass Link road due to stalled utility vehicle.",
        "created_at": "30 minutes ago"
    }
]

@router.get("")
def get_alerts():
    return live_alerts
