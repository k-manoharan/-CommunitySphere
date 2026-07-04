import time
import random
import pandas as pd

class CommunityDataEngine:
    def __init__(self):
        # Generate initial synthetic data for communities
        self.num_records = 500000
        
    def simulate_cudf_speedup(self):
        """
        Simulates sorting, filtering, and aggregating 500,000 community sensor records
        comparing CPU-bound Pandas vs GPU-accelerated RAPIDS cuDF.
        """
        # Simulated CPU processing time (Pandas)
        cpu_start = time.time()
        # Simulate heavy CPU workload (generating noise, grouping, filtering)
        _ = [random.random() for _ in range(10000)]
        time.sleep(0.42)  # Simulated Pandas overhead for 500k rows
        cpu_time = time.time() - cpu_start
        
        # Simulated GPU processing time (RAPIDS cuDF)
        gpu_start = time.time()
        time.sleep(0.012)  # Simulated GPU kernel execution + memory transfer
        gpu_time = time.time() - gpu_start
        
        speedup = cpu_time / gpu_time
        
        return {
            "records_processed": self.num_records,
            "cpu_time_seconds": round(cpu_time, 4),
            "gpu_time_seconds": round(gpu_time, 4),
            "speedup_factor": round(speedup, 1),
            "active_gpu": "NVIDIA GeForce RTX (Simulated L4/T4 GPU)",
            "framework": "RAPIDS cuDF v24.04"
        }

    def get_realtime_sensor_data(self):
        """
        Generates simulated real-time data for different areas/zones.
        """
        zones = [
            {"id": "zone_1", "name": "North Sector (Zone 1)", "coords": [12.98, 80.25]},
            {"id": "zone_2", "name": "East Coast (Zone 2)", "coords": [12.92, 80.27]},
            {"id": "zone_3", "name": "West Suburbs (Zone 3)", "coords": [12.95, 80.18]},
            {"id": "zone_4", "name": "South Sector (Zone 4)", "coords": [12.88, 80.22]},
            {"id": "zone_5", "name": "Central Business District (Zone 5)", "coords": [12.97, 80.23]}
        ]
        
        results = []
        for zone in zones:
            # Add dynamic sensor readings
            results.append({
                **zone,
                "weather": {
                    "temperature_c": round(random.uniform(26.0, 34.0), 1),
                    "humidity_percent": random.randint(60, 95),
                    "precipitation_mm": round(random.uniform(0.0, 45.0) if zone["id"] == "zone_2" else random.uniform(0.0, 10.0), 1)
                },
                "aqi": random.randint(45, 180) if zone["id"] != "zone_5" else random.randint(150, 240),
                "traffic": {
                    "congestion_level": random.choice(["Low", "Moderate", "High", "Critical"]),
                    "average_speed_kmh": random.randint(15, 60)
                },
                "water_level_m": round(random.uniform(0.2, 2.8), 2)
            })
            
        return results
