import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, MapPin } from "lucide-react";

export default function DigitalTwin({ data }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState("flood"); // flood, aqi, traffic, services

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [12.94, 80.23], // Chennai / generic mock coordinates
        zoom: 12,
        zoomControl: true,
      });

      // Dark style tile layer (matches the dark neon UI theme)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        // We'll keep the instance active to avoid rendering bugs during page switches
      }
    };
  }, []);

  // Update layers when activeLayer or data changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current || !data) return;

    // Clear previous markers/overlays
    layerGroupRef.current.clearLayers();

    data.sensor_data.forEach((zone) => {
      const coords = zone.coords;
      const predictions = data.predictions[zone.id];

      if (activeLayer === "flood") {
        const floodRisk = predictions?.flood?.risk_score || 0;
        const color = floodRisk > 70 ? "#ef4444" : floodRisk > 40 ? "#f59e0b" : "#10b981";
        
        // Add a translucent risk zone circle overlay
        L.circle(coords, {
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          radius: 1200,
        })
          .bindPopup(`
            <div class="text-white text-xs">
              <strong class="text-sm block mb-1 text-indigo-300">${zone.name}</strong>
              <strong>Flood Risk Level:</strong> ${floodRisk}%<br/>
              <strong>Rainfall:</strong> ${zone.weather.precipitation_mm}mm<br/>
              <strong>Safety Threshold:</strong> ${predictions?.flood?.severity}
            </div>
          `)
          .addTo(layerGroupRef.current);

      } else if (activeLayer === "aqi") {
        const aqi = zone.aqi;
        const color = aqi > 200 ? "#ef4444" : aqi > 100 ? "#f59e0b" : "#10b981";

        L.circle(coords, {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          radius: 1000,
        }).addTo(layerGroupRef.current);

        // Add a marker showing the exact AQI index
        const customIcon = L.divIcon({
          className: "bg-transparent",
          html: `<div class="flex items-center justify-center font-bold text-[10px] w-8 h-8 rounded-full border border-gray-800 text-black shadow-md" style="background-color: ${color}; font-weight: 800">${aqi}</div>`,
          iconSize: [32, 32],
        });

        L.marker(coords, { icon: customIcon })
          .bindPopup(`
            <div class="text-white text-xs">
              <strong class="text-sm block mb-1 text-indigo-300">${zone.name}</strong>
              <strong>Air Quality Index (AQI):</strong> ${aqi}<br/>
              <strong>Forecast Status:</strong> ${predictions?.aqi_forecast[0]?.status}
            </div>
          `)
          .addTo(layerGroupRef.current);

      } else if (activeLayer === "traffic") {
        const congestion = zone.traffic.congestion_level;
        const color = congestion === "Critical" ? "#ef4444" : congestion === "High" ? "#f59e0b" : "#10b981";

        // Draw simulated roadways representation lines
        const offsetLng = 0.015;
        const pathCoords = [
          [coords[0] - 0.01, coords[1] - offsetLng],
          [coords[0], coords[1]],
          [coords[0] + 0.01, coords[1] + offsetLng]
        ];

        L.polyline(pathCoords, {
          color: color,
          weight: 6,
          opacity: 0.7
        })
          .bindPopup(`
            <div class="text-white text-xs">
              <strong class="text-sm block mb-1 text-indigo-300">${zone.name} Mainways</strong>
              <strong>Congestion Status:</strong> ${congestion}<br/>
              <strong>Average Flow Speed:</strong> ${zone.traffic.average_speed_kmh} km/h
            </div>
          `)
          .addTo(layerGroupRef.current);

      } else if (activeLayer === "services") {
        // Pin hospitals and safety dispatchers
        const hospitalCoords = [coords[0] + 0.004, coords[1] - 0.005];
        L.marker(hospitalCoords, {
          icon: L.divIcon({
            className: "bg-transparent",
            html: '<div class="h-6 w-6 bg-red-600 border border-white rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-md">+</div>'
          })
        })
          .bindPopup(`<strong class="text-xs text-white">Community Care Center (${zone.name})</strong>`)
          .addTo(layerGroupRef.current);

        const schoolCoords = [coords[0] - 0.005, coords[1] + 0.004];
        L.marker(schoolCoords, {
          icon: L.divIcon({
            className: "bg-transparent",
            html: '<div class="h-6 w-6 bg-blue-600 border border-white rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">S</div>'
          })
        })
          .bindPopup(`<strong class="text-xs text-white">Community School Zone (${zone.name})</strong>`)
          .addTo(layerGroupRef.current);
      }
    });

  }, [activeLayer, data]);

  return (
    <div className="space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-header font-extrabold text-3xl text-white">Geospatial Digital Twin</h2>
          <p className="text-gray-400 text-sm mt-1">Simulated map layers detailing environmental risks and critical assets.</p>
        </div>
        
        {/* Layer Controls */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-xl gap-1.5">
          {[
            { id: "flood", label: "Flood Zones" },
            { id: "aqi", label: "Air Pollution" },
            { id: "traffic", label: "Traffic Congestion" },
            { id: "services", label: "Public Assets" }
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLayer === layer.id 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="grow relative glass-panel rounded-2xl overflow-hidden border border-gray-800/80">
        <div ref={mapContainerRef} className="h-full w-full absolute inset-0 z-10" />
        
        {/* Bottom Legend Overlay panel */}
        <div className="absolute bottom-4 left-4 z-20 bg-gray-950/90 border border-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-sm space-y-2 text-xs">
          <h4 className="font-bold text-gray-200 flex items-center gap-1.5 mb-1.5">
            <Info size={14} className="text-indigo-400" />
            Active Layer Legend: {activeLayer.toUpperCase()}
          </h4>
          {activeLayer === "flood" && (
            <div className="space-y-1.5 text-gray-400">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500 block"></span> High Flood Risk (&gt;75%)</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500 block"></span> Moderate Risk (40% - 75%)</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500 block"></span> Standard Condition (&lt;40%)</div>
            </div>
          )}
          {activeLayer === "aqi" && (
            <div className="space-y-1.5 text-gray-400">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500 block"></span> Unhealthy AQI (&gt;150)</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500 block"></span> Moderate AQI (50 - 150)</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500 block"></span> Good Air Quality (&lt;50)</div>
            </div>
          )}
          {activeLayer === "traffic" && (
            <div className="space-y-1.5 text-gray-400">
              <div className="flex items-center gap-2"><span className="h-3 w-1.5 bg-rose-500 rounded block"></span> Critical Bottleneck (High Congestion)</div>
              <div className="flex items-center gap-2"><span className="h-3 w-1.5 bg-amber-500 rounded block"></span> Heavy / Slow Traffic flow</div>
              <div className="flex items-center gap-2"><span className="h-3 w-1.5 bg-emerald-500 rounded block"></span> Free Flowing lanes</div>
            </div>
          )}
          {activeLayer === "services" && (
            <div className="space-y-1.5 text-gray-400">
              <div className="flex items-center gap-2"><span className="h-5 w-5 bg-red-600 rounded flex items-center justify-center text-white text-[10px] font-bold">+</span> Emergency Hospital Care</div>
              <div className="flex items-center gap-2"><span className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">S</span> Municipal School Safe Zone</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
