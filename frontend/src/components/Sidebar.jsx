import React from "react";
import { 
  LayoutDashboard, 
  Map, 
  Bot, 
  LineChart, 
  AlertTriangle, 
  ShieldAlert, 
  MessageSquareShare, 
  Zap,
  Users
} from "lucide-react";

export default function Sidebar({ currentPage, setCurrentPage, currentRole, setCurrentRole }) {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "digital-twin", name: "Digital Twin Map", icon: Map },
    { id: "ai-assistant", name: "AI Gemini Assistant", icon: Bot },
    { id: "analytics", name: "Risk Forecast Center", icon: LineChart },
    { id: "emergency", name: "Emergency Command", icon: ShieldAlert, roleRestricted: ["Authority", "Emergency Team"] },
    { id: "feedback", name: "Citizen Feedback", icon: MessageSquareShare },
    { id: "nvidia", name: "NVIDIA Acceleration", icon: Zap },
  ];

  return (
    <aside className="w-72 bg-gray-950 border-r border-gray-800 p-6 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/30">
            CS
          </div>
          <div>
            <h1 className="font-header font-extrabold text-white text-lg tracking-tight leading-none">CommunitySphere</h1>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Decision Intelligence</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            // Hide menu item if user role is not allowed
            if (item.roleRestricted && !item.roleRestricted.includes(currentRole)) {
              return null;
            }
            
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-md"
                    : "text-gray-400 hover:bg-gray-900/50 hover:text-gray-200"
                }`}
              >
                <Icon size={18} className={isActive ? "text-indigo-400" : "text-gray-400"} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800/80">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
            <Users size={10} /> Active Role Profile
          </label>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-200 py-2 px-3 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="Citizen">Citizen (Public)</option>
            <option value="Authority">Municipal Authority</option>
            <option value="Emergency Team">Emergency Response Team</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
