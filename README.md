# CommunitySphere AI

**CommunitySphere AI** is a modern Decision Intelligence and Digital Twin platform built for community environmental risk predictions, emergency resource logistics, and public safety chatbot assistants.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### Step 1: Launch Backend API
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your Gemini API key (optional; local backup simulation handles queries if key is missing):
   - **Windows (PowerShell):** `$env:GEMINI_API_KEY="your_api_key_here"`
   - **macOS/Linux:** `export GEMINI_API_KEY="your_api_key_here"`
4. Run the FastAPI dev server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
The backend server runs at `http://127.0.0.1:8000`.

---

### Step 2: Launch Frontend App
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
The web dashboard launches at `http://localhost:5173`.

---

## 🛠️ Architecture and Stack

### Frontend
- **React.js + Vite** for lightweight reactive pages.
- **Tailwind CSS** for dark-themed glassmorphism layout rules.
- **Leaflet.js** for mapping and geographic coordinates layers overlays.
- **Recharts** for weather, traffic, and air quality predictive graphics.
- **Lucide Icons** for dashboard symbol assets.

### Backend
- **FastAPI** serving predictions, alerts, database queries, and recommendations.
- **SQLite** storing citizen-logged incident logs.
- **Google GenAI** routing chat queries to customized Gemini agents.
- **Data simulation engine** comparing CPU Pandas speeds against GPU-Accelerated RAPIDS cuDF calculations.
