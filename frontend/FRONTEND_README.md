# Botanical Pi — Frontend

A React + TypeScript dashboard for **Botanical Pi**, an automated plant monitoring and care system. This frontend connects to the backend API to display plant telemetry, control devices, and manage automation.

---

## Table of Contents

- [Tech Stack](#tech-stack)  
- [Folder Structure](#folder-structure)  
- [Getting Started](#getting-started)  
- [Available Scripts](#available-scripts)  
- [Environment & Configuration](#environment--configuration)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Tech Stack

- **React 18** + **TypeScript**  
- **Vite** (build tool & dev server)  
- **TailwindCSS** (styling)  
- **Lucide React** (icons)  
- **Radix UI** (accessible UI components)  

---

## Folder Structure

```
frontend/
├── src/
│   ├── api/                   # Functions to call the backend API
│   ├── components/            # React components (Dashboard, LoginPage, PlantCard, etc.)
│   ├── style/                 # Global styles or Tailwind overrides
│   ├── guidelines/            # Design guidelines or mock data
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── Attributions.md
├── vite.config.ts             # Vite configuration with aliases
├── tsconfig.json              # TypeScript config
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- npm or yarn  

### Install dependencies

```bash
cd frontend
npm install
```

### Run development server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)  

### Build for production

```bash
npm run build
```

The production-ready files will be in the `build/` folder.

### Preview production build

```bash
npm run preview
```

---

## Environment & Configuration

- The frontend uses **TypeScript path aliases** configured in `tsconfig.json`:

```ts
import { login } from "@/api/api";
```

- API endpoint is hardcoded for now:

```ts
const BASE_URL = "http://botanical-pi-env.eba-npauivb3.us-east-1.elasticbeanstalk.com";
```

You can replace it with an `.env` variable if needed.

---

## Usage

1. Open the app in the browser.  
2. Log in using any email/password for demo mode or test credentials:

```
Email: test@botanical.com
Password: test123
```

3. The dashboard displays:

- Plant telemetry: moisture, light, temperature  
- Alerts for critical plants  
- Automation controls: water or light  

4. Click a plant to view detailed controls and status.

---

## Contributing

1. Fork the repository  
2. Create a new branch (`git checkout -b feature-name`)  
3. Make your changes and commit (`git commit -m "Feature: ..."`)  
4. Push to the branch (`git push origin feature-name`)  
5. Open a pull request  

---

## License

This project is **MIT licensed**.

