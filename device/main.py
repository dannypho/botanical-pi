import time
import requests
from sensors import DHT22Sensor, ADS1115Sensor, BH1750Sensor, WaterLevelSensor
from actuators import RelayController

# ========== CONFIGURATION ==========
AWS_BASE_URL = "http://botanical-pi-env.eba-npauivb3.us-east-1.elasticbeanstalk.com"
DEVICE_ID = "plant_001" # Hardcoded device ID
POLL_INTERVAL = 5  # seconds between each loop

# ========== INITIALIZE HARDWARE ==========
dht = DHT22Sensor()
ads = ADS1115Sensor()
light_sensor = BH1750Sensor()
water_sensor = WaterLevelSensor()
relay = RelayController()


def read_all_sensors():
    """Read all sensors and return combined data dict"""
    return {
        "device_id": DEVICE_ID,
        "environment": dht.read(),
        "moisture": ads.read_moisture(),
        "light": light_sensor.read(),
        "water": water_sensor.read()
    }


def send_telemetry(sensor_data):
    """POST sensor data to AWS backend"""
    try:
        response = requests.post(
            f"{AWS_BASE_URL}/api/devices/telemetry",
            json=sensor_data,
            timeout=5
        )
        if response.status_code == 200:
            print(f"[Telemetry] Sent OK - Reading ID: {response.json().get('reading_id')}")
        else:
            print(f"[Telemetry] Failed: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"[Telemetry] Network error: {e}")


def poll_and_execute_commands():
    """GET pending commands from AWS and execute them on hardware"""
    try:
        response = requests.get(
            f"{AWS_BASE_URL}/api/devices/{DEVICE_ID}/commands",
            timeout=5
        )
        if response.status_code != 200:
            print(f"[Commands] Failed to fetch: {response.status_code}")
            return

        commands = response.json()

        if not commands:
            return  # Nothing to do

        for cmd in commands:
            action = cmd.get("action")
            print(f"[Commands] Executing: {action}")

            if action == "pump_on":
                relay.pump_on()
                time.sleep(5)   # Run pump for 5 seconds
                relay.pump_off()
                print("[Commands] Pump ran for 5 seconds, now OFF")

            elif action == "pump_off":
                relay.pump_off()

            elif action == "light_on":
                relay.light_on()

            elif action == "light_off":
                relay.light_off()

            else:
                print(f"[Commands] Unknown action: {action}")

    except requests.exceptions.RequestException as e:
        print(f"[Commands] Network error: {e}")


def main():
    print(f"Botanical Pi starting up...")
    print(f"Device ID: {DEVICE_ID}")
    print(f"AWS Backend: {AWS_BASE_URL}")
    print(f"Polling every {POLL_INTERVAL} seconds\n")

    try:
        while True:
            # 1. Read all sensors
            sensor_data = read_all_sensors()
            print(f"[Sensors] Temp: {sensor_data['environment']['temperature_f']}°F | "
                  f"Humidity: {sensor_data['environment']['humidity']}% | "
                  f"Moisture: {sensor_data['moisture']['voltage']}V | "
                  f"Light: {sensor_data['light']['lux']} lux")

            # 2. Send data to AWS
            send_telemetry(sensor_data)

            # 3. Check for and execute any pending commands
            poll_and_execute_commands()

            # 4. Wait before next cycle
            time.sleep(POLL_INTERVAL)

    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        relay.cleanup()
        print("GPIO cleaned up. Goodbye.")


if __name__ == "__main__":
    main()