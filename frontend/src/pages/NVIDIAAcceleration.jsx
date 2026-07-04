import React, { useState } from "react";
import { getBenchmark } from "../services/api";
import { Zap, Cpu, Play, BarChart2 } from "lucide-react";

export default function NVIDIAAcceleration() {
  const [benchData, setBenchData] = useState(null);
  const [running, setRunning] = useState(false);

  const runBench = async () => {
    setRunning(true);
    try {
      const data = await getBenchmark();
      setBenchData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-header font-extrabold text-3xl text-white">NVIDIA GPU Acceleration Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Benchmarking standard CPU Pandas operations against GPU-Accelerated RAPIDS cuDF operations.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Info Card */}
        <div className="col-span-12 md:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="bg-[#76b900]/10 border border-[#76b900]/20 text-[#76b900] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-3">
              RAPIDS cuDF v24.04
            </span>
            <h3 className="font-header font-bold text-lg text-white">How GPU Speedups Help</h3>
            <p className="text-gray-400 text-xs mt-3 leading-relaxed">
              When natural disasters like floods occur, cities process gigabytes of weather, traffic, and water sensors simultaneously. 
            </p>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Standard CPU-bound operations in Pandas create bottle-necks, taking seconds to clean and sort data. By offloading these tasks to NVIDIA GPUs (L4/T4 Tensor Cores) using **RAPIDS cuDF**, data operations are accelerated up to 35x-50x faster.
            </p>
          </div>
          <button
            onClick={runBench}
            disabled={running}
            className="w-full mt-6 bg-[#76b900] hover:bg-[#86d000] text-black rounded-xl py-3.5 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#76b900]/10"
          >
            {running ? (
              "Executing GPU kernels..."
            ) : (
              <>
                <Play size={14} fill="black" />
                Run Ingestion Benchmark
              </>
            )}
          </button>
        </div>

        {/* Benchmark Visuals */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-2xl p-6">
          <h3 className="font-header font-bold text-lg text-gray-200 mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-[#76b900]" />
            Real-time Aggregation Speed Comparison
          </h3>

          {benchData ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-900/60 border border-gray-800 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Accelerated GPU Framework</span>
                  <span className="text-xs text-white font-bold">{benchData.framework}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Dataset size processed</span>
                  <span className="text-xs text-indigo-400 font-bold">{benchData.records_processed.toLocaleString()} records</span>
                </div>
              </div>

              {/* Ingestion Speedup comparison visual bars */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300 flex items-center gap-1.5"><Cpu size={12} className="text-gray-400" /> Standard Pandas (CPU)</span>
                    <span className="text-gray-300">{benchData.cpu_time_seconds} seconds</span>
                  </div>
                  <div className="w-full bg-gray-950 h-5 rounded-md overflow-hidden border border-gray-800">
                    <div className="bg-gray-700 h-full rounded-r-sm" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#76b900] flex items-center gap-1.5"><Zap size={12} /> RAPIDS cuDF (NVIDIA GPU)</span>
                    <span className="text-[#76b900] font-bold">{benchData.gpu_time_seconds} seconds</span>
                  </div>
                  <div className="w-full bg-gray-950 h-5 rounded-md overflow-hidden border border-gray-800">
                    <div className="bg-[#76b900] h-full rounded-r-sm" style={{ width: `${(benchData.gpu_time_seconds / benchData.cpu_time_seconds) * 100}%`, minWidth: "4%" }}></div>
                  </div>
                </div>
              </div>

              {/* Speedup Metric Widget */}
              <div className="flex justify-between items-center border-t border-gray-800/80 pt-6 mt-6">
                <div>
                  <div className="text-5xl font-black font-header text-[#76b900] leading-none">{benchData.speedup_factor}x</div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Faster Decision Pipelines</span>
                </div>
                <div className="text-right text-[10px] text-gray-500">
                  Hardware: {benchData.active_gpu}<br/>
                  *Simulated environment benchmarks comparing single-thread NumPy vs multi-core CUDA threads.
                </div>
              </div>

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-800 rounded-xl">
              <Zap size={32} className="text-gray-600 mb-2 animate-bounce" />
              <p className="text-gray-400 text-sm">Please trigger the ingestion benchmark to view comparative processing telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
