import time
import threading
import board
import busio
import adafruit_dht
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import smbus2 as smbus
import RPi.GPIO as GPIO

class DHT22Sensor:
    def __init__(self, pin=board.D4):
        self.sensor = adafruit_dht.DHT22(pin, use_pulseio=False)

    def read(self):
        try:
            temp_c = self.sensor.temperature
            temp_f = temp_c * 9 / 5 + 32
            humidity = self.sensor.humidity
            return {
                "temperature_c": round(temp_c, 1),
                "temperature_f": round(temp_f, 1),
                "humidity": round(humidity, 1),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        except RuntimeError as e:
            print(f"DHT read error: {e}")
            return None

class ADS1115Sensor:
    def __init__(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        self.ads = ADS.ADS1115(i2c)
        self.water_chan = AnalogIn(self.ads, ADS.P3)
        self.moisture_chan = AnalogIn(self.ads, ADS.P2)
        self.MIN_ADC = 0
        self.MAX_ADC = 32767

    def read_water_level(self):
        adc_val = self.water_chan.value
        water_level = (adc_val - self.MIN_ADC) / (self.MAX_ADC - self.MIN_ADC) * 100
        return {
            "adc": adc_val,
            "voltage": round(self.water_chan.voltage, 2),
            "water_level_percent": round(water_level, 1)
        }

    def read_moisture(self):
        adc_val = self.moisture_chan.value
        return {
            "adc": adc_val,
            "voltage": round(self.moisture_chan.voltage, 2)
        }

class WaterLevelSensor:
    def __init__(self, pin=22):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(pin, GPIO.IN)
        self.pin = pin

    def read(self):
        state = GPIO.input(self.pin)
        return {"water_detected": bool(state)}

class BH1750Sensor:
    def __init__(self, address=0x23):
        self.bus = smbus.SMBus(1)
        self.addr = address
        self.mode = 0x20  # One-time high-res mode

    def read(self):
        # Send measurement command (0x20 = one-time high-res mode)
        self.bus.write_byte(self.addr, self.mode)
        time.sleep(0.18)  # Wait for measurement (~120ms)
        
        # Read 2 bytes of data from the sensor
        data = self.bus.read_i2c_block_data(self.addr, 0x00, 2)
        
        # Convert to lux
        lux = ((data[0] << 8) + data[1]) / 1.2
        return {"lux": round(lux, 2)}
