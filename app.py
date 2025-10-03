from flask import Flask, jsonify
import threading, time, random
import time
import board
import adafruit_dht

app = Flask(__name__)

# Initialize the DHT22 sensor on GPIO4
dhtDevice = adafruit_dht.DHT22(board.D4, use_pulseio=False)

# Shared dictionary to store latest readings
sensor_data = {
    "temperature_c": None,
    "temperature_f": None,
    "humidity": None,
    "last_updated": None
}

def read_dht22():
    try:
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity

        # Update the shared dictionary
        sensor_data.update({
            "temperature_c": round(temperature_c, 1),
            "temperature_f": round(temperature_f, 1),
            "humidity": round(humidity, 1),
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S")
        })

    except RuntimeError as error:
        # Common DHT read errors, just skip
        print(f"DHT read error: {error}")
    except Exception as error:
        dhtDevice.exit()
        raise error

def read_sensors():
    while True:
        read_dht22()

@app.route("/")
def index():
    return jsonify("Hello, World")

@app.route("/temp_humidity")
def get_temp_and_humidity():
    if sensor_data["temperature_c"] is None:
        return jsonify({"error": "Sensor data not ready yet."}), 503
    return jsonify(sensor_data)
    

if __name__ == "__main__":
    # Start the background sensor thread
    t = threading.Thread(target=read_sensors, daemon=True)
    t.start()

    # Run Flask
    app.run(host="0.0.0.0", port=5000)