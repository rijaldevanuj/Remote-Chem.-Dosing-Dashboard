from flask import Flask, jsonify, request, Response
import math
import json
import time
import threading
import serial
from flask_cors import CORS
from pymongo import MongoClient
import sys
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

# MongoDB Atlas setup
MONGO_URI = "mongodb+srv://userAdmin:devanuj_83mNS@chemicaldosing.o2kdxnu.mongodb.net/?retryWrites=true&w=majority&appName=ChemicalDosing"
client = MongoClient(MONGO_URI)
db = client["chemical_dosing_db"]
collection = db["ChemicalDosing"]

# Default critical thresholds
CRITICALS = {
    "distance_cm": 15.0,
    "flowrate_lpm": 5.0
}

# Logger thread control
logger_running = False
logger_thread = None

def arduino_logger():
    """Background thread for reading Arduino data and saving to MongoDB"""
    global logger_running
    
    PORT = 'COM3'
    BAUD_RATE = 9600
    
    try:
        ser = serial.Serial(PORT, BAUD_RATE, timeout=1)
        print(f"[✓] Connected to {PORT}. Logging data to MongoDB...")
        time.sleep(2)

        while logger_running:
            try:
                line = ser.readline().decode('utf-8').strip()
                if line:
                    # Skip header lines
                    if "Chemical Dosing Monitoring System Started" in line or "Time(ms)" in line:
                        continue
                    
                    data = line.split(',')
                    if len(data) == 4:
                        document = {
                            "Time_ms": int(data[0]),
                            "TankLevel_cm": float(data[1]),
                            "FlowRate_L_per_min": float(data[2]),
                            "TotalVolume_L": float(data[3]),
                            "timestamp": time.time()
                        }
                        collection.insert_one(document)
                        print(f"📤 Inserted: {document}")
            except Exception as e:
                print(f"[!] Error reading data: {e}")
                time.sleep(1)  # Wait before retrying
                
    except Exception as e:
        print(f"[X] Serial connection failed: {e}")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("[✓] Serial port closed")

def start_logger():
    """Start the Arduino logger thread"""
    global logger_running, logger_thread
    
    if not logger_running:
        logger_running = True
        logger_thread = threading.Thread(target=arduino_logger)
        logger_thread.daemon = True  # Terminates with main thread
        logger_thread.start()
        print("✅ Arduino logger started")

def stop_logger():
    """Stop the Arduino logger thread"""
    global logger_running
    logger_running = False
    print("⏹️ Arduino logger stopped")

# Start logger when app starts
@app.before_request
def initialize_logger():
    start_logger()

# Existing API routes
@app.route('/api/latest', methods=['GET'])
def get_latest_data():
    try:
        latest = collection.find_one(sort=[("timestamp", -1)])
        
        if not latest:
            return jsonify({
                "timestamp": "",
                "TankLevel_cm": 0,
                "FlowRate_L_per_min": 0,
                "TotalVolume_L": 0,
                "critical": {"level_low": False, "flow_high": False}
            })

        # Safe conversion with NaN checks
        def safe_float(value):
            try:
                val = float(value)
                return val if not math.isnan(val) else None
            except (TypeError, ValueError):
                return None

        distance = safe_float(latest.get("TankLevel_cm"))
        flowrate = safe_float(latest.get("FlowRate_L_per_min"))
        volume = safe_float(latest.get("TotalVolume_L", 0))
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(latest.get("timestamp", time.time())))

        response_dict = {
            "timestamp": timestamp,
            "TankLevel_cm": distance,
            "FlowRate_L_per_min": flowrate,
            "TotalVolume_L": volume,
            "critical": {
                "level_low": distance is not None and distance < CRITICALS["distance_cm"],
                "flow_high": flowrate is not None and flowrate > CRITICALS["flowrate_lpm"]
            }
        }


        try:
            json_str = json.dumps(response_dict, allow_nan=False)
            return Response(json_str, mimetype="application/json")
        except ValueError as ve:
            return jsonify({"error": "Data contains invalid values"}), 500

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/thresholds', methods=['POST'])
def update_criticals():
    try: 
        data = request.json
        CRITICALS["distance_cm"] = float(data.get("distance_cm", CRITICALS["distance_cm"]))
        CRITICALS["flowrate_lpm"] = float(data.get("flowrate_lpm", CRITICALS["flowrate_lpm"]))
        return jsonify({"message": "Thresholds updated", "new": CRITICALS})
    except Exception as e:
        return jsonify({"error": "Invalid data provided"}), 400

# Cleanup on exit
import atexit
@atexit.register
def cleanup():
    stop_logger()
    print("🔌 Cleaning up resources before exit")


if __name__ == '__main__':
    print("⚙️ Python used:", sys.executable)
    print("🚀 Flask server starting on http://localhost:5000 ...")
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)




