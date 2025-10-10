from flask import Flask, jsonify, render_template
import threading, time
from sensors import DHT22Sensor, ADS1115Sensor, BH1750Sensor, WaterLevelSensor
from actuators import RelayController

app = Flask(__name__)

# Initialize sensors
dht = DHT22Sensor()
ads = ADS1115Sensor()
light_sensor = BH1750Sensor()
water_sensor = WaterLevelSensor()
relay = RelayController()

sensor_data = {}
lock = threading.Lock()

def read_sensors():
    while True:
        with lock:
            sensor_data["environment"] = dht.read()
            sensor_data["moisture"] = ads.read_moisture()
            sensor_data["light"] = light_sensor.read()
            sensor_data["water_detected"] = water_sensor.read()
        time.sleep(2)

@app.route("/data")
def home():
    with lock:
        return jsonify(sensor_data)

@app.route("/water")
def get_water():
    with lock:
        return jsonify(sensor_data.get("water_detected", {}))

@app.route("/light")
def get_light():
    with lock:
        return jsonify(sensor_data.get("light", {}))

@app.route("/temperature")
def get_temp():
    with lock:
        return jsonify(sensor_data.get("environment", {}))

@app.route("/pump/on", methods=["POST", "GET"])
def pump_on():
    relay.pump_on()
    return jsonify({"status": "pump ON"})

@app.route("/pump/off", methods=["POST", "GET"])
def pump_off():
    relay.pump_off()
    return jsonify({"status": "pump OFF"})

@app.route("/light/on", methods=["POST", "GET"])
def light_on():
    relay.light_on()
    return jsonify({"status": "light ON"})

@app.route("/light/off", methods=["POST", "GET"])
def light_off():
    relay.light_off()
    return jsonify({"status": "light OFF"})

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    try:
        threading.Thread(target=read_sensors, daemon=True).start()
        app.run(host="0.0.0.0", port=5000)
    except KeyboardInterrupt:
        pass
    finally:
        relay.light_off()
        relay.pump_off()
        relay.cleanup()
