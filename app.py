from flask import Flask, jsonify
import threading, time, random

app = Flask(__name__)

def read_sensors():
    pass

@app.route("/")
def get_data():
    return jsonify("Hello, World")

if __name__ == "__main__":
    t = threading.Thread(target=read_sensors, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=5000)