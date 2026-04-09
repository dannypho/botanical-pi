//const BASE_URL = "http://localhost:5000";
//const BASE_URL = "/api";
const BASE_URL = "https://botanical-pi-uxw8.onrender.com";
const DEVICE_ID = "plant_001";

export async function login(email: string, password: string) {
  const res = await fetch(`api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { user_id, email }
}

export async function getLatestReading() {
  const res = await fetch(`/api/devices/${DEVICE_ID}/latest`);
  if (!res.ok) throw new Error("Failed to fetch sensor data");
  return res.json();
}

export async function controlDevice(action: string) {
  const res = await fetch(`/api/devices/${DEVICE_ID}/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to send command");
  return res.json();
}