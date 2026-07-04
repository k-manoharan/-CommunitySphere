import React, { useEffect, useState } from "react";
import { getFeedback, submitFeedback } from "../services/api";
import { MessageSquare, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function CitizenFeedback() {
  const [reports, setReports] = useState([]);
  const [category, setCategory] = useState("Garbage Overflow");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("North Sector (Zone 1)");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getFeedback();
      setReports(data);
    } catch (err) {
      console.error("Failed to load feedback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setSuccessMsg("");
    try {
      await submitFeedback({ category, description, location });
      setSuccessMsg("Your report has been logged and sent to municipal dispatch agents.");
      setDescription("");
      // Reload reports list
      fetchReports();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={14} className="text-emerald-400" />;
      case "In Progress":
        return <Clock size={14} className="text-amber-400" />;
      default:
        return <AlertCircle size={14} className="text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-header font-extrabold text-3xl text-white">Citizen Feedback Portal</h2>
        <p className="text-gray-400 text-sm mt-1">Report local issues to help emergency agents and authorities optimize resources.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm animate-pulse">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Submit Feedback Form */}
        <div className="col-span-12 md:col-span-5 glass-panel rounded-2xl p-6 h-fit">
          <h3 className="font-header font-bold text-lg text-gray-200 mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            Log Local Incident Report
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Report Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-200 py-3 px-4 focus:outline-none focus:border-indigo-500"
              >
                <option value="Garbage Overflow">Garbage Overflow</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Road Damage">Road Damage / Pothole</option>
                <option value="Power Outage">Power Grid Outage</option>
                <option value="Drainage Blockage">Drainage Blockage</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Location Sector</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-200 py-3 px-4 focus:outline-none focus:border-indigo-500"
              >
                <option value="North Sector (Zone 1)">North Sector (Zone 1)</option>
                <option value="East Coast (Zone 2)">East Coast (Zone 2)</option>
                <option value="West Suburbs (Zone 3)">West Suburbs (Zone 3)</option>
                <option value="South Sector (Zone 4)">South Sector (Zone 4)</option>
                <option value="Central Business District (Zone 5)">Central Business District (Zone 5)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Incident Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain the situation in details..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-200 py-3 px-4 focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              {submitting ? "Saving to SQLite..." : "Submit Incident Report"}
            </button>
          </form>
        </div>

        {/* Live Submissions Feed */}
        <div className="col-span-12 md:col-span-7 glass-panel rounded-2xl p-6">
          <h3 className="font-header font-bold text-lg text-gray-200 mb-6">Submitted Community Incidents</h3>
          
          {loading && <div className="text-gray-500 text-xs py-4 text-center">Refreshing incidents feed...</div>}
          
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar">
            {reports.map((report) => (
              <div 
                key={report.report_id} 
                className="p-4 bg-gray-900/40 border border-gray-800/80 rounded-xl space-y-2 transition-all hover:border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-indigo-400">{report.category}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800/80">
                    {getStatusIcon(report.status)}
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{report.status}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{report.description}</p>
                
                <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-800/60 pt-2.5 mt-2">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {report.location}</span>
                  <span>Logged: {report.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
