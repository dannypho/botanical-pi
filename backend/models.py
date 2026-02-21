from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # Relationship to devices
    devices = db.relationship('Device', backref='owner', lazy=True)

class Device(db.Model):
    id = db.Column(db.String(50), primary_key=True)  # e.g., "plant_001"
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100))  # User-friendly name
    api_key = db.Column(db.String(100), unique=True)
    last_seen = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class SensorReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), db.ForeignKey('device.id'))
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    moisture_voltage = db.Column(db.Float)
    light_lux = db.Column(db.Float)
    water_detected = db.Column(db.Boolean)

class Command(db.Model):
    """Command queue for device control"""
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), db.ForeignKey('device.id'))
    action = db.Column(db.String(50))  # "pump_on", "pump_off", "light_on", "light_off"
    executed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())