from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import serial
import time
import sys
#devanuj_83mNS
# MongoDB connection URI
uri = "mongodb+srv://userAdmin:devanuj_83mNS@chemicaldosing.o2kdxnu.mongodb.net/?retryWrites=true&w=majority&appName=ChemicalDosing"

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"[X] MongoDB connection failed: {e}")
    exit()

# 🔹 Choose your database and collection
db = client["chemical_dosing_db"]  # You can name this anything
collection = db["ChemicalDosing"]  # Collection where data will be stored

# 🔌 Serial connection setup
PORT = 'COM3'
BAUD_RATE = 9600

try:
    ser = serial.Serial(PORT, BAUD_RATE, timeout=1)
    print(f"[✓] Connected to {PORT}. Logging data to MongoDB...")
    time.sleep(2)

    while True:
        line = ser.readline().decode('utf-8').strip()
        if line:
            if "Chemical Dosing Monitoring System Started" in line or "Time(ms)" in line:
                continue  # Skip header lines
            data = line.split(',')
            if len(data) == 4:
                document = {
                    "Time_ms": int(data[0]),
                    "TankLevel_cm": float(data[1]),
                    "FlowRate_L_per_min": float(data[2]),
                    "TotalVolume_L": float(data[3]),
                    "timestamp": time.time()
                }
                # 🔽 Upload to MongoDB Atlas
                collection.insert_one(document)
                print(f"📤 Inserted: {document}")


except Exception as e:
    print(f"[!] Error: {e}")

finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()
        print("[✓] Serial port closed.")

print(sys.executable)
print(sys.version)




