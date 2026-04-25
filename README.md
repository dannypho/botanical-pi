# Botanical Pi

A smart plant monitoring system that lets users remotely monitor and control their plants from anywhere with internet access.

Developed as part of the **UTA Senior Design course (CSE 4316 & 4317)**.

---

## Features
- **Real-time Sensor Monitoring** — soil moisture, water level, ambient light, temperature & humidity
- **Remote Control** — trigger pump and grow light from anywhere via web dashboard
- **Data Logging** — sensor readings stored in a cloud database
- **User Authentication** — secure login to access the dashboard

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           USER (anywhere)               │
│     Opens web browser on phone/laptop   │
└─────────────────────────────────────────┘
                    ↕ Internet
┌─────────────────────────────────────────┐
│         CLOUD BACKEND (Render)          │
│  - Stores user accounts                 │
│  - Stores sensor data history           │
│  - Manages device commands              │
└─────────────────────────────────────────┘
                    ↕ Internet/WiFi
┌─────────────────────────────────────────┐
│      RASPBERRY PI (at plant location)   │
│  - Reads sensors every 1 second        │
│  - Controls pump and grow light         │
│  - Sends data to cloud                  │
│  - Polls cloud for commands             │
└─────────────────────────────────────────┘
                    ↕ GPIO pins
┌─────────────────────────────────────────┐
│           PHYSICAL HARDWARE             │
│  - DHT22 Temperature/Humidity sensor    │
│  - ADS1115 Soil moisture sensor         │
│  - BH1750 Light sensor                  │
│  - Water level sensor                   │
│  - Water pump + reservoir               │
│  - Grow light                           │
└─────────────────────────────────────────┘
```

---

## Tech Stack
- **Raspberry Pi 4** (Raspbian OS)
- **Python 3**
- **Flask** (cloud REST API)
- **SQLite** (database, non-persistent)
- **Render** (cloud deployment — backend and frontend)
- **React** (web dashboard)

---

## Project Structure

```
botanical-pi/
├── backend/     # Flask REST API deployed on Render
├── device/      # Raspberry Pi scripts for sensors and actuators
├── frontend/    # React web dashboard
└── README.md
```

See each folder's `README.md` for setup and running instructions.

---

## Team Members
| Name                |
|---------------------|
| Danny Pho           |
| Benjamin Circe      |
| Oghenerukevwe Onedo |
| Edosa Aigbuza       |
| Eric Prachan        |

---

## Live Backend
```
https://botanical-pi-uxw8.onrender.com/
```
