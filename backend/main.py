from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import prediction, alerts, feedback, recommendation

app = FastAPI(
    title="CommunitySphere AI API Gateway",
    description="Backend Decision Intelligence & Simulation Gateway powered by Gemini",
    version="1.1.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(prediction.router)
app.include_router(alerts.router)
app.include_router(feedback.router)
app.include_router(recommendation.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CommunitySphere AI Decision Support Backend",
        "endpoints": [
            "/api/predictions/dashboard-data",
            "/api/predictions/benchmark",
            "/api/alerts",
            "/api/feedback",
            "/api/recommendations/recommend",
            "/api/recommendations/resources"
        ]
    }
