import os
import google.generativeai as genai

# Setup API Key
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    gemini_enabled = True
else:
    gemini_enabled = False

class GeminiAgentsService:
    # System contexts for our 3 agents
    AGENT_PROMPTS = {
        "analyst": (
            "You are the Community Analyst Agent for CommunitySphere AI.\n"
            "Your role is to analyze environmental and infrastructure risk patterns (flood risks, AQI index values, traffic bottlenecks).\n"
            "Provide quantitative summaries, confidence assessments, and identify critical risk hotspots based on user questions.\n"
            "Format responses clearly with bullet points and bold headers."
        ),
        "planner": (
            "You are the Emergency Planner Agent for CommunitySphere AI.\n"
            "Your role is to organize resources and response logistics for municipal authorities and rescue teams.\n"
            "Provide deployment details, specifying exactly what resources (ambulances, rescue boats, clearing trucks) to position and where.\n"
            "Be tactical, concise, and prioritize life safety."
        ),
        "citizen": (
            "You are the Citizen Assistant Agent for CommunitySphere AI.\n"
            "Your role is to provide public safety alerts, routing advice, and environmental risk details directly to residents.\n"
            "Keep your tone reassuring, helpful, and clear. Advise on alternate routes, shelter locations, and simple preparations."
        )
    }

    @classmethod
    def get_agent_response(cls, agent_type: str, query: str) -> dict:
        prompt_context = cls.AGENT_PROMPTS.get(agent_type, cls.AGENT_PROMPTS["citizen"])
        
        if gemini_enabled:
            try:
                model = genai.GenerativeModel("gemini-2.5-flash")
                response = model.generate_content(
                    f"System Persona Instructions:\n{prompt_context}\n\nUser Question: {query}\n\nResponse:"
                )
                return {
                    "reply": response.text,
                    "agent": agent_type,
                    "source": "Gemini AI Live (gemini-2.5-flash)"
                }
            except Exception as e:
                return {
                    "reply": cls.get_simulated_response(agent_type, query, f"Live API Error: {str(e)}"),
                    "agent": agent_type,
                    "source": "Local Fallback Engine"
                }
        else:
            return {
                "reply": cls.get_simulated_response(agent_type, query),
                "agent": agent_type,
                "source": "Local Simulation Engine (API Key Missing)"
            }

    @staticmethod
    def get_simulated_response(agent_type: str, query: str, err_info: str = "") -> str:
        q_lower = query.lower()
        err_prefix = f"*(Note: Using local backup model due to {err_info})*\n\n" if err_info else ""
        
        if agent_type == "analyst":
            if "flood" in q_lower or "rain" in q_lower:
                return err_prefix + (
                    "### 📊 Environmental Analysis Report: Flood Risk\n"
                    "- **Risk Severity:** High in Low-lying coastal sectors (Zone 2).\n"
                    "- **Primary Indicators:** Water height at river markers (2.8m) combined with 40mm precipitation forecast.\n"
                    "- **Historical Baseline:** Matches the 2021 flooding baseline with 86% correlation.\n"
                    "- **Confidence Score:** 89.4%"
                )
            elif "aqi" in q_lower or "air" in q_lower:
                return err_prefix + (
                    "### 📊 Air Quality Index Report\n"
                    "- **Current Status:** Critical (AQI 210) in CBD (Zone 5).\n"
                    "- **Contributing Factors:** Low wind speed (5km/h) preventing dispersion of vehicular emissions.\n"
                    "- **Risk Areas:** Zone 5 school districts and high-density office corridors."
                )
            else:
                return err_prefix + (
                    "### 📊 Community Risk Assessment\n"
                    "Overall Community Health Index stands at **82/100**. Environmental metrics are stable except for Zone 2 (precipitation warning) and Zone 5 (elevated particulate concentration)."
                )
                
        elif agent_type == "planner":
            if "flood" in q_lower or "rain" in q_lower or "rescue" in q_lower:
                return err_prefix + (
                    "### 🚨 Deployment Plan: Flood Operations\n"
                    "- **Target Area:** East Coast (Zone 2)\n"
                    "- **Deployments:**\n"
                    "  - 3 Emergency Rescue Inflatable Boats to East Coast Hub.\n"
                    "  - 2 High-clearance relief vehicles to Zone 2 medical staging yards.\n"
                    "- **Action items:** Divert waste trucks to elevated base. Establish backup communications link."
                )
            else:
                return err_prefix + (
                    "### 🚨 Dispatch Advisory\n"
                    "- **Asset Allocation:** All ambulance stations are on standby. Recommending green traffic light priority routing through CBD for emergency services due to heavy congestions."
                )
                
        else: # citizen agent
            if "flood" in q_lower or "rain" in q_lower:
                return err_prefix + (
                    "### 🏡 Citizen Safety Guide: Flood Preparedness\n"
                    "A high flood warning is active for **East Coast (Zone 2)**.\n"
                    "- **What to do:**\n"
                    "  1. Avoid travel along lower riverside pathways.\n"
                    "  2. Relocate parked vehicles away from Zone 2 drainage channels.\n"
                    "  3. Keep a basic medical kit and flashlight ready."
                )
            elif "traffic" in q_lower or "route" in q_lower:
                return err_prefix + (
                    "### 🚗 Traffic and Transit Advice\n"
                    "- Heavy congestion on West Suburbs Link road. **Suggested detour:** Use the Upper Bypass route to save ~20 minutes.\n"
                    "- Public transit is running on schedule except for Zone 2 river bus lines."
                )
            else:
                return err_prefix + (
                    "Hello! I am your Citizen Assistant. You can ask me about safe travel routes, emergency shelter locations, or flood preparedness advice in your neighborhood."
                )
