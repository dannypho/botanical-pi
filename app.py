from flask import Flask, jsonify
import threading, time
from sensors import DHT22Sensor, ADS1115Sensor, BH1750Sensor, WaterLevelSensor

app = Flask(__name__)

# Initialize sensors
# dht = DHT22Sensor()
# ads = ADS1115Sensor()
light_sensor = BH1750Sensor()
water_sensor = WaterLevelSensor()

sensor_data = {}
lock = threading.Lock()

def read_sensors():
    while True:
        with lock:
            # sensor_data["environment"] = dht.read()
            # sensor_data["moisture"] = ads.read_moisture()
            sensor_data["light"] = light_sensor.read()
            sensor_data["water_detected"] = water_sensor.read()
        time.sleep(2)

@app.route("/")
def home():
    return jsonify({"message": "Sensor API running"})

# @app.route("/sensors")
# def get_all():
#     with lock:
#         return jsonify(sensor_data)

@app.route("/water")
def get_water():
    with lock:
        return jsonify(sensor_data.get("water_detected", {}))

@app.route("/light")
def get_light():
    with lock:
        return jsonify(sensor_data.get("light", {}))

# @app.route("/temperature")
# def get_temp():
#     with lock:
#         return jsonify(sensor_data.get("environment", {}))

if __name__ == "__main__":
    threading.Thread(target=read_sensors, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
