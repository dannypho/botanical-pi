# Backend — Botanical Pi API

Flask REST API deployed on AWS Elastic Beanstalk. Handles user authentication, sensor data storage, and device command queuing.

---

## Tech Stack
- Python 3.11
- Flask
- Flask-SQLAlchemy (SQLite)
- AWS Elastic Beanstalk

---

## Local Development

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Run locally
```bash
python application.py
```
Server runs at `http://localhost:5000`

---

## AWS Deployment

### Check status
```bash
eb status
```

### Deploy updates
```bash
eb deploy
```

### Live URL
```
http://botanical-pi-env.eba-npauivb3.us-east-1.elasticbeanstalk.com
```

---

## API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{ "status": "healthy", "database": "connected" }
```

---

### Auth

#### Register
```
POST /api/auth/register
```
Body:
```json
{ "email": "user@email.com", "password": "yourpassword" }
```
Response:
```json
{ "user_id": 1, "email": "user@email.com" }
```

#### Login
```
POST /api/auth/login
```
Body:
```json
{ "email": "user@email.com", "password": "yourpassword" }
```
Response:
```json
{ "user_id": 1, "email": "user@email.com" }
```

---

### Telemetry

#### Send sensor data (Pi → Cloud)
```
POST /api/devices/telemetry
```
Body:
```json
{
  "device_id": "plant_001",
  "environment": { "temperature_c": 22.0, "humidity": 65.0 },
  "moisture": { "voltage": 2.1 },
  "light": { "lux": 450 },
  "water": { "water_detected": false }
}
```
Response:
```json
{ "status": "received", "reading_id": 1 }
```

#### Get latest sensor reading
```
GET /api/devices/<device_id>/latest
```
Response:
```json
{
  "device_id": "plant_001",
  "timestamp": "2026-02-21T10:44:08",
  "temperature": 22.0,
  "humidity": 65.0,
  "moisture": 2.1,
  "light": 450.0,
  "water_detected": false
}
```

---

### Device Control

#### Queue a command
```
POST /api/devices/<device_id>/control
```
Body:
```json
{ "action": "pump_on" }
```
Available actions: `pump_on`, `pump_off`, `light_on`, `light_off`

Response:
```json
{ "status": "command queued", "command_id": 1 }
```

#### Get pending commands (Pi polls this)
```
GET /api/devices/<device_id>/commands
```
Response:
```json
[{ "action": "pump_on", "id": 1 }]
```
Note: Commands are marked as executed once fetched.

---

## File Structure
```
backend/
├── application.py    # Flask app and all API routes
├── models.py         # SQLAlchemy database models
├── requirements.txt  # Python dependencies
└── .gitignore
```
