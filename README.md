# Botanical Pi

A multithreaded program running on a Raspberry Pi 4 that:
- Hosts a backend using **Flask**
- Continuously reads data from sensors (soil moisture, light level, water tank level, temperature/humidity)
- Automates plant care by activating a water pump and grow lights when needed
- Provides a **web interface** for users to monitor plant conditions and control the system remotely

This project was developed as part of the **UTA Senior Design course (CSE 4316 & 4317)**.


## Features
- **Real-time Sensor Monitoring** – soil moisture, water level, ambient light, temperature/humidity
- **Automatic Watering** – pump activates when moisture is below threshold
- **Grow Light Control** – turn lights on/off or automate via schedule
- **Data Logging** – SQLite database to store readings and pump history
- **Web Dashboard** – monitor status and trigger actions from any device on the network


## Tech Stack
- **Raspberry Pi 4** (running Raspbian OS)
- **Python 3**
- **Flask** (backend server)
- **SQLite** (data logging)
- **HTML/CSS/JS** (frontend)

