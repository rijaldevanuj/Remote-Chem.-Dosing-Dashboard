from flask import Flask, jsonify, request, Response
import math
import json
import time
from flask_cors import CORS
from pymongo import MongoClient
import os
import sys
print("⚙️ Python used:", sys.executable)


app = Flask(__name__)
CORS(app)  # Enable CORS
#devanuj_83mNS
# MongoDB Atlas setup
MONGO_URI = "mongodb+srv://userAdmin:devanuj_83mNS@chemicaldosing.o2kdxnu.mongodb.net/?retryWrites=true&w=majority&appName=ChemicalDosing"
client = MongoClient(MONGO_URI) #data will be fetched from here
db = client["chemical_dosing_db"]
collection = db["ChemicalDosing"]  # Collection where data will be stored

# Default critical thresholds
CRITICALS = {
    "distance_cm": 15.0,
    "flowrate_lpm": 5.0
}
from flask import Flask, jsonify
import math
import time

@app.route('/api/latest', methods=['GET'])
def get_latest_data():
    try:
        latest = collection.find_one(sort=[("timestamp", -1)])  # Get latest document

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

        # Serialize with strict NaN check
        try:
            json_str = json.dumps(response_dict, allow_nan=False)
            return Response(json_str, mimetype="application/json")
        except ValueError as ve:
            app.logger.error(f"❌ JSON serialization error: {ve}")
            return jsonify({"error": "Data contains invalid values (e.g., NaN)"}), 500

    except Exception as e:
        app.logger.error(f"Error in get_latest_data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/thresholds', methods=['POST'])
def update_criticals():
    try: 
        data = request.json
        CRITICALS["distance_cm"] = float(data.get("distance_cm", CRITICALS["distance_cm"]))
        CRITICALS["flowrate_lpm"] = float(data.get("flowrate_lpm", CRITICALS["flowrate_lpm"]))
        return jsonify({"message": "Thresholds updated", "new": CRITICALS})
    except Exception as e:
        app.logger.error(f"Error in update_criticals: {str(e)}")
        return jsonify({"error": "Invalid data provided"}), 400

if __name__ == '__main__':
    print("Flask server is starting on http://localhost:5000 ...")
    print(sys.executable)
    print(sys.version)
    app.run(debug=True, port=5000, use_reloader=False)



