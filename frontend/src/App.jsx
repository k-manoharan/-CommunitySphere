import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DigitalTwin from "./pages/DigitalTwin";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import EmergencyCenter from "./pages/EmergencyCenter";
import CitizenFeedback from "./pages/CitizenFeedback";
import NVIDIAAcceleration from "./pages/NVIDIAAcceleration";
import { getDashboardData, getAlerts } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentRole, setCurrentRole] = useState("Citizen"); // Citizen, Authority, Emergency Team
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [dashRes, alertsRes] = await Promise.all([
        getDashboardData(),
        getAlerts()
      ]);
      setData(dashRes);
      setAlerts(alertsRes);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to API Gateway. Please ensure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll data every 10 seconds to simulate a live digital twin stream
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ensure role restrictions on page rendering
  useEffect(() => {
    if (currentPage === "emergency" && currentRole === "Citizen") {
      setCurrentPage("dashboard");
    }
  }, [currentRole, currentPage]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="text-gray-400 text-sm font-semibold">Connecting to CommunitySphere Gateway...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="glass-panel max-w-xl mx-auto mt-20 p-8 rounded-2xl text-center border-rose-500/20 space-y-4">
          <div className="h-12 w-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            !
          </div>
          <h3 className="font-header font-bold text-xl text-white">Connection Error</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
          <div className="p-3 bg-gray-900 rounded-lg text-[10px] text-gray-500 text-left font-mono">
            Powershell terminal commands to start backend:<br/>
            cd backend<br/>
            uvicorn main:app --reload
          </div>
          <button 
            onClick={loadData}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard data={data} alerts={alerts} onNavigate={setCurrentPage} />;
      case "digital-twin":
        return <DigitalTwin data={data} />;
      case "ai-assistant":
        return <AIAssistant />;
      case "analytics":
        return <Analytics data={data} />;
      case "emergency":
        return <EmergencyCenter currentRole={currentRole} />;
      case "feedback":
        return <CitizenFeedback />;
      case "nvidia":
        return <NVIDIAAcceleration />;
      default:
        return <Dashboard data={data} alerts={alerts} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole} 
      />
      <main className="flex-grow p-10 overflow-y-auto max-h-screen">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
