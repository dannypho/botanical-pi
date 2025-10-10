import RPi.GPIO as GPIO
import time

class RelayController:
    def __init__(self, relay_light_pin=26, relay_pump_pin=6):
        self.relay_light_pin = relay_light_pin
        self.relay_pump_pin = relay_pump_pin

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.relay_light_pin, GPIO.OUT)
        GPIO.setup(self.relay_pump_pin, GPIO.OUT)

        # Initialize both OFF
        GPIO.output(self.relay_light_pin, GPIO.LOW)
        GPIO.output(self.relay_pump_pin, GPIO.LOW)

    # -------- LIGHT CONTROL --------
    def light_on(self):
        GPIO.output(self.relay_light_pin, GPIO.HIGH)
        print("Light relay ON")

    def light_off(self):
        GPIO.output(self.relay_light_pin, GPIO.LOW)
        print("Light relay OFF")

    # -------- PUMP CONTROL --------
    def pump_on(self):
        GPIO.output(self.relay_pump_pin, GPIO.HIGH)
        print("Pump relay ON")

    def pump_off(self):
        GPIO.output(self.relay_pump_pin, GPIO.LOW)
        print("Pump relay OFF")

    def cleanup(self):
        self.light_off()
        self.pump_off()
        GPIO.cleanup()
        print("GPIO cleaned up")
