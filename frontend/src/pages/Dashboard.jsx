import React from "react";
import { 
  Heart, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Zap, 
  Flame, 
  Droplets,
  Wind,
  Compass
} from "lucide-react";

export default function Dashboard({ data, alerts, onNavigate }) {
  if (!data) return <div className="text-gray-400 p-8 text-center">Injesting data stream...</div>;

  const healthScore = data.overall_health_score;

  // Compute a simple status classification for health score
  const getHealthStatus = (score) => {
    if (score >= 80) return { label: "Excellent Condition", color: "text-emerald-400", border: "border-emerald-500/20" };
    if (score >= 60) return { label: "Moderate Conditions", color: "text-amber-400", border: "border-amber-500/20" };
    return { label: "Critical Hazard Status", color: "text-rose-400", border: "border-rose-500/20" };
  };

  const healthStatus = getHealthStatus(healthScore);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-header font-extrabold text-3xl text-white">Community Control Room</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time digital twin overview of community infrastructure & environment indicators.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Stream Connected
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Core Bento Card 1: Health Score */}
        <div className="col-span-12 md:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between h-[240px]">
          <div>
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mb-1">Community Scorecard</span>
            <h3 className="font-header font-bold text-lg text-gray-200">Community Health Score</h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-6xl font-black font-header text-emerald-400 leading-none">{healthScore}<span className="text-xl text-gray-500 font-normal">/100</span></div>
              <p className={`text-sm font-bold mt-2 ${healthStatus.color}`}>{healthStatus.label}</p>
            </div>
            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <Heart size={30} className="animate-pulse" />
            </div>
          </div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1.5 border-t border-gray-800/80 pt-3">
            <TrendingUp size={12} className="text-emerald-400" /> Increased 4.2% based on traffic dispersal reports.
          </div>
        </div>

        {/* Core Bento Card 2: Active Alerts */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-2xl p-6 flex flex-col justify-between h-[240px]">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mb-1">System Alerts</span>
              <h3 className="font-header font-bold text-lg text-gray-200">Active Warnings Feed</h3>
            </div>
            <button 
              onClick={() => onNavigate("alerts")} 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Feed &rarr;
            </button>
          </div>
          <div className="overflow-y-auto space-y-3 pr-2 max-h-[140px] flex-grow">
            {alerts && alerts.map((alert) => (
              <div 
                key={alert.alert_id} 
                className={`p-3 rounded-xl border flex gap-3 text-xs ${
                  alert.severity === "High" 
                    ? "bg-rose-500/5 border-rose-500/20 text-rose-200" 
                    : alert.severity === "Medium"
                    ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                    : "bg-blue-500/5 border-blue-500/20 text-blue-200"
                }`}
              >
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold flex justify-between">
                    <span>{alert.type} ({alert.location})</span>
                    <span className="text-[10px] font-normal opacity-60">{alert.created_at}</span>
                  </div>
                  <p className="opacity-80 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Zone Indicators */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mb-1">Geospatial telemetry</span>
              <h3 className="font-header font-bold text-lg text-gray-200">Neighborhood Digital Twin Telemetry</h3>
            </div>
            <button 
              onClick={() => onNavigate("digital-twin")}
              className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-600/30 transition-all font-semibold"
            >
              Open Interactive Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sensor_data.map((zone) => {
              const floodRisk = data.predictions[zone.id]?.flood?.risk_score || 0;
              
              return (
                <div key={zone.id} className="p-4 bg-gray-900/40 border border-gray-800/80 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-300 flex items-center gap-1.5">
                      <MapPin size={14} className="text-indigo-400" />
                      {zone.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      floodRisk > 70 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                        : floodRisk > 40
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {floodRisk > 70 ? "Critical" : floodRisk > 40 ? "Warning" : "Secure"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-950/80 p-2 rounded-lg border border-gray-800/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold flex justify-center gap-0.5"><Droplets size={10} className="text-blue-400" /> Rain</div>
                      <div className="text-xs font-extrabold mt-1 text-gray-300">{zone.weather.precipitation_mm} mm</div>
                    </div>
                    <div className="bg-gray-950/80 p-2 rounded-lg border border-gray-800/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold flex justify-center gap-0.5"><Wind size={10} className="text-indigo-400" /> AQI</div>
                      <div className={`text-xs font-extrabold mt-1 ${zone.aqi > 150 ? 'text-rose-400' : 'text-gray-300'}`}>{zone.aqi}</div>
                    </div>
                    <div className="bg-gray-950/80 p-2 rounded-lg border border-gray-800/50">
                      <div className="text-[10px] text-gray-500 uppercase font-bold flex justify-center gap-0.5"><Compass size={10} className="text-amber-400" /> Traffic</div>
                      <div className="text-xs font-extrabold mt-1 text-gray-300">{zone.traffic.congestion_level}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NVIDIA Acceleration Bento Promo Card */}
        <div 
          onClick={() => onNavigate("nvidia")}
          className="col-span-12 md:col-span-4 bg-gradient-to-br from-gray-900 to-gray-950 border border-[#76b900]/20 hover:border-[#76b900]/40 rounded-2xl p-6 flex flex-col justify-between h-full cursor-pointer group shadow-lg shadow-[#76b900]/2"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mb-1">NVIDIA GPU Acceleration</span>
              <span className="bg-[#76b900]/10 border border-[#76b900]/20 text-[#76b900] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                RAPIDS cuDF
              </span>
            </div>
            <h3 className="font-header font-bold text-lg text-white mt-1 group-hover:text-[#76b900] transition-colors">
              Analytics Acceleration Engine
            </h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Real-time vector operations Accelerated with NVIDIA GPU cuDF, delivering near-instant clean data inputs for predict networks.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
            <div>
              <div className="text-3xl font-black font-header text-[#76b900]">35.0x<span className="text-xs font-bold text-gray-400 ml-1">Speedup</span></div>
              <p className="text-[10px] text-gray-500">Aggregating 500,000 sensor streams</p>
            </div>
            <div className="h-10 w-10 bg-[#76b900]/10 rounded-xl flex items-center justify-center text-[#76b900] group-hover:scale-105 transition-transform">
              <Zap size={20} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
