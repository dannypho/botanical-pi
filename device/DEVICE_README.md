# Device — Botanical Pi (Raspberry Pi)

Python scripts that run on the Raspberry Pi. Reads sensors every 1 second, sends data to the Render backend, and polls for commands to control the pump and grow light.

---

## Hardware

### Sensors
| Sensor | Purpose | Connection |
|--------|---------|------------|
| DHT22 | Temperature & Humidity | GPIO 27 |
| ADS1115 | Soil Moisture (ADC) | I2C (SDA/SCL) |
| BH1750 | Light (lux) | I2C (SDA/SCL) |
| Water Level Sensor | Water detected in reservoir | GPIO 16 |

### Actuators
| Component | Purpose | GPIO Pin |
|-----------|---------|----------|
| Relay (Pump) | Controls water pump | GPIO 6 |
| Relay (Light) | Controls grow light | GPIO 26 |

### Wiring Notes
- ADS1115 and BH1750 both use I2C — connect to the same SDA (GPIO 2) and SCL (GPIO 3) pins
- Soil moisture sensor output connects to ADS1115 channel P2
- Relays are active HIGH — GPIO HIGH turns them ON

---

## Software Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Run
```bash
python main.py
```

The script will start reading sensors and syncing with Render every 1 second. Press `Ctrl+C` to stop cleanly.

---

## How It Works

Every 1 second the Pi:
1. Reads all sensors (temperature, humidity, moisture, light, water level)
2. POSTs sensor data to `POST /api/devices/telemetry`
3. GETs pending commands from `GET /api/devices/<device_id>/commands`
4. Checks command age — discards any commands older than 30 seconds
5. Executes valid commands (`pump_run`, `light_on`, `light_off`)

When a `pump_run` command is received, the pump runs for 5 seconds then automatically turns off. There is no separate `pump_off` command.

---

## File Structure
```
device/
├── main.py           # Main loop — reads sensors, syncs with Render
├── sensors.py        # Sensor classes (DHT22, ADS1115, BH1750, WaterLevel)
├── actuators.py      # Relay controller (pump and light)
├── requirements.txt  # Python dependencies
└── .gitignore
```
