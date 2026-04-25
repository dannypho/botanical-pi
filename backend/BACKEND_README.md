# Backend — Botanical Pi API
Flask REST API deployed on Render. Handles user authentication, sensor data storage, and device command queuing.

---

## Tech Stack
- Python 3.11
- Flask
- Flask-SQLAlchemy
- SQLite (non-persistent)
- Render

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

## Deployment
Deployed on Render. Pushes to main branch auto-redeploy via Render's GitHub integration.

### Live URL
```
https://botanical-pi-uxw8.onrender.com
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
{ "action": "pump_run" }
```
Available actions: `pump_run`, `light_on`, `light_off`

Note: `pump_run` triggers the pump for 5 seconds and automatically shuts it off. There is no separate `pump_off` command.

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
[{ "action": "pump_run", "id": 1 }]
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
