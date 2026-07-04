from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import GeminiAgentsService

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

class ChatRequest(BaseModel):
    message: str
    agent: str = "citizen" # analyst, planner, citizen

@router.post("/recommend")
def get_recommendation(request: ChatRequest):
    if request.agent not in ["analyst", "planner", "citizen"]:
        raise HTTPException(status_code=400, detail="Invalid agent. Must be 'analyst', 'planner', or 'citizen'.")
    
    response = GeminiAgentsService.get_agent_response(request.agent, request.message)
    return response

@router.get("/resources")
def get_resources():
    return {
        "allocations": [
            {"resource": "Waste Collection Trucks", "active": 8, "standby": 4, "optimal_zone": "Zone 1"},
            {"resource": "Rescue Inflatables", "active": 2, "standby": 6, "optimal_zone": "Zone 2 (East Coast)"},
            {"resource": "Ambulances", "active": 5, "standby": 3, "optimal_zone": "Zone 5 (CBD)"},
            {"resource": "Utility Repair Crews", "active": 3, "standby": 5, "optimal_zone": "Zone 4"}
        ],
        "optimization_suggestions": [
            "Reallocate 2 Waste Collection Trucks from Zone 3 to Zone 1 due to citizen complaints of garbage overflows.",
            "Position standby rescue inflatables closer to East Coast (Zone 2) as flood probability has crossed 80%.",
            "Establish green corridor for ambulances in Zone 5 (CBD) to bypass major traffic bottleneck predicted in the next hour."
        ]
    }
