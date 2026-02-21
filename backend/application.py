from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Import database and models
from models import db, User, Device, SensorReading, Command

application = Flask(__name__)

# Configuration
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///botanical.db'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with app
db.init_app(application)

# Create tables
with application.app_context():
    db.create_all()

# ========== BASIC ROUTES ==========
@application.route('/')
def home():
    return "Botanical Pi Backend API"

@application.route('/health')
def health():
    return jsonify({"status": "healthy", "database": "connected"})

@application.route('/test-db')
def test_db():
    """Test if database is working"""
    try:
        user_count = User.query.count()
        device_count = Device.query.count()
        return jsonify({
            "status": "success",
            "users": user_count,
            "devices": device_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== AUTH ENDPOINTS ==========
@application.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create new user
        new_user = User(email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': new_user.id,
            'email': new_user.email
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@application.route('/api/auth/login', methods=['POST'])
def login():
    """Login existing user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'email': user.email
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== DEVICE TELEMETRY ==========
@application.route('/api/devices/telemetry', methods=['POST'])
def receive_telemetry():
    """Receive sensor data from Raspberry Pi"""
    try:
        data = request.get_json()
        device_id = data.get('device_id')
        
        # Save sensor reading
        reading = SensorReading(
            device_id=device_id,
            temperature=data.get('environment', {}).get('temperature_c'),
            humidity=data.get('environment', {}).get('humidity'),
            moisture_voltage=data.get('moisture', {}).get('voltage'),
            light_lux=data.get('light', {}).get('lux'),
            water_detected=data.get('water', {}).get('water_detected')
        )
        db.session.add(reading)
        db.session.commit()
        
        return jsonify({'status': 'received', 'reading_id': reading.id}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@application.route('/api/devices/<device_id>/latest', methods=['GET'])
def get_latest_reading(device_id):
    """Get latest sensor data for a device"""
    try:
        reading = SensorReading.query.filter_by(
            device_id=device_id
        ).order_by(SensorReading.timestamp.desc()).first()
        
        if not reading:
            return jsonify({'error': 'No data found'}), 404
        
        return jsonify({
            'device_id': reading.device_id,
            'timestamp': reading.timestamp.isoformat(),
            'temperature': reading.temperature,
            'humidity': reading.humidity,
            'moisture': reading.moisture_voltage,
            'light': reading.light_lux,
            'water_detected': reading.water_detected
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== DEVICE CONTROL ==========
@application.route('/api/devices/<device_id>/control', methods=['POST'])
def control_device(device_id):
    """Queue a command for the device"""
    try:
        data = request.get_json()
        action = data.get('action')  # "pump_on", "pump_off", "light_on", "light_off"
        
        # Create command in queue
        command = Command(
            device_id=device_id,
            action=action,
            executed=False
        )
        db.session.add(command)
        db.session.commit()
        
        return jsonify({
            'status': 'command queued',
            'command_id': command.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@application.route('/api/devices/<device_id>/commands', methods=['GET'])
def get_commands(device_id):
    """Pi polls this to get pending commands"""
    try:
        # Get all unexecuted commands for this device
        commands = Command.query.filter_by(
            device_id=device_id,
            executed=False
        ).all()
        
        # Mark them as executed
        for cmd in commands:
            cmd.executed = True
        db.session.commit()
        
        # Return the commands
        return jsonify([
            {'action': cmd.action, 'id': cmd.id} 
            for cmd in commands
        ]), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    application.run(debug=True, port=5000)