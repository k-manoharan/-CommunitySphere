import React, { useEffect, useState } from "react";
import { getResources } from "../services/api";
import { ShieldAlert, RefreshCw, Send, CheckCircle2, UserCheck } from "lucide-react";

export default function EmergencyCenter({ currentRole }) {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispatchedMessage, setDispatchedMessage] = useState("");

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSimulateDispatch = (resource, zone) => {
    setDispatchedMessage(`Successfully dispatched additional unit of ${resource} to ${zone}. Target ETA: 8 minutes.`);
    setTimeout(() => setDispatchedMessage(""), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-header font-extrabold text-3xl text-white">Emergency Command & Intelligence Desk</h2>
          <p className="text-gray-400 text-sm mt-1">Resource allocation and AI optimization panel restricted to authorities.</p>
        </div>
        <button 
          onClick={loadResources}
          className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 text-xs px-3.5 py-2 rounded-xl text-gray-300 hover:text-indigo-400 font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Sync Assets
        </button>
      </div>

      {dispatchedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2.5 text-sm animate-pulse">
          <CheckCircle2 size={16} />
          {dispatchedMessage}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Resource Asset Allocation Grid */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-2xl p-6">
          <h3 className="font-header font-bold text-lg text-gray-200 mb-6 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" />
            Active Fleet Allocations
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs font-bold uppercase">
                  <th className="pb-3">Resource Asset</th>
                  <th className="pb-3">Active Deployment</th>
                  <th className="pb-3">Standby Stock</th>
                  <th className="pb-3">Optimized Staging Zone</th>
                  <th className="pb-3 text-right">Quick Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                {resources && resources.allocations.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-900/20 transition-all">
                    <td className="py-3.5 font-semibold text-white">{item.resource}</td>
                    <td className="py-3.5 text-emerald-400 font-bold">{item.active} units</td>
                    <td className="py-3.5 text-gray-400">{item.standby} units</td>
                    <td className="py-3.5 text-indigo-400 font-semibold">{item.optimal_zone}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleSimulateDispatch(item.resource, item.optimal_zone)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10"
                      >
                        <Send size={10} />
                        Dispatch Unit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations optimization logs */}
        <div className="col-span-12 md:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-header font-bold text-lg text-gray-200 mb-6 flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-400" />
              AI Logistics Optimization
            </h3>
            <div className="space-y-4">
              {resources && resources.optimization_suggestions.map((suggestion, idx) => (
                <div key={idx} className="p-3 bg-gray-900/40 border border-gray-800/80 rounded-xl text-xs leading-relaxed text-gray-300">
                  <div className="text-indigo-400 font-extrabold uppercase text-[9px] mb-1 tracking-wider">Recommendation #{idx+1}</div>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-gray-500 mt-6 border-t border-gray-800/80 pt-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            Sync completed with BigQuery emergency logistics logs.
          </div>
        </div>
      </div>
    </div>
  );
}
