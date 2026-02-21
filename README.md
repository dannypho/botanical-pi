# Botanical Pi

A smart plant monitoring system that lets users remotely monitor and control their plants from anywhere with internet access.

Developed as part of the **UTA Senior Design course (CSE 4316 & 4317)**.

---

## Features
- **Real-time Sensor Monitoring** — soil moisture, water level, ambient light, temperature & humidity
- **Remote Control** — trigger pump and grow light from anywhere via web dashboard
- **Data Logging** — sensor readings stored in a cloud database
- **Multi-user Support** — each user manages their own device via account login

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           USER (anywhere)               │
│     Opens web browser on phone/laptop   │
└─────────────────────────────────────────┘
                    ↕ Internet
┌─────────────────────────────────────────┐
│         CLOUD BACKEND (AWS)             │
│  - Stores user accounts                 │
│  - Stores sensor data history           │
│  - Manages device commands              │
└─────────────────────────────────────────┘
                    ↕ Internet/WiFi
┌─────────────────────────────────────────┐
│      RASPBERRY PI (at plant location)   │
│  - Reads sensors every 5 seconds        │
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
- **SQLite** (cloud database via SQLAlchemy)
- **AWS Elastic Beanstalk** (cloud deployment)
- **React** (web dashboard)

---

## Project Structure

```
botanical-pi/
├── backend/     # Flask REST API deployed on AWS Elastic Beanstalk
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
http://botanical-pi-env.eba-npauivb3.us-east-1.elasticbeanstalk.com
```
