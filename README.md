# 🌾 KrishiShield Frontend

**AI-Powered Crop Decision & Damage Intelligence System**

## Tech Stack
- **React 18** (Vite setup)
- **Tailwind CSS** — custom forest/earth color palette
- **React Router DOM v6** — full client-side routing
- **Zustand** — lightweight global state + localStorage persistence
- **Recharts** — interactive charts (area, bar, line, radial)
- **Axios** — HTTP client (wired up, replace mock `api` with real FastAPI calls)
- **Lucide React** — icon library

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Hero, features, how-it-works, CTA |
| `/login` | LoginPage | Language select, sign-in / register |
| `/onboarding` | OnboardingPage | 4-step farm profile setup |
| `/app/home` | HomePage | Overview dashboard with KPIs & charts |
| `/app/crop-planner` | CropPlannerPage | Soil/weather inputs → AI recommendations |
| `/app/scan-crop` | ScanCropPage | Image upload → disease detection + treatments |
| `/app/simulator` | SimulatorPage | What-If sliders → risk/yield/profit projections |
| `/app/yield` | YieldPage | Crop × severity × area → financial impact |
| `/app/insights` | InsightsPage | Smart AI-generated alerts & insights |
| `/app/report` | ReportPage | Aggregated report + download |

## Project Structure
```
src/
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── OnboardingPage.jsx
│   ├── HomePage.jsx
│   ├── CropPlannerPage.jsx
│   ├── ScanCropPage.jsx
│   ├── SimulatorPage.jsx
│   ├── YieldPage.jsx
│   ├── InsightsPage.jsx
│   └── ReportPage.jsx
├── components/
│   └── layout/
│       └── DashboardLayout.jsx   (sidebar + topbar + Outlet)
├── store/
│   └── useAppStore.js            (Zustand store + mock API)
├── App.jsx                       (React Router setup)
├── main.jsx
└── index.css                     (Tailwind + custom tokens)
```

## Getting Started
```bash
npm install
npm run dev
```

## Backend Setup
A simple Node.js/Express backend has been added under `backend/`.  It uses Sequelize to talk to PostgreSQL (or sqlite by default in development).

1. Copy `backend/.env.example` to `backend/.env` and configure:
   Add your OpenWeatherMap API key as `WEATHER_API_KEY` in the `.env` file (e.g. `WEATHER_API_KEY=abc123...`).
   ```
   DATABASE_URL=postgres://user:pass@localhost:5432/krishishield_db
   PORT=5000
   JWT_SECRET=<some secret string>
   ```
2. From the root of the workspace run:
   ```bash
   cd backend
   npm install
   npm run dev    # starts server with nodemon
   # or `npm start` for production
   ```
3. Ensure the database is reachable.  With sqlite you don't need anything else; with PostgreSQL create the database first.

The frontend already reads `VITE_API_URL` from a `.env` file (see root `.env`) and the `useAppStore` utilities use axios to call the endpoints, so no manual changes are required on the client side.  
For weather features the client will request geolocation and hit `/api/weather` or `/api/weather-forecast`; the server will in turn use `WEATHER_API_KEY` from `backend/.env`.
### Available API Endpoints
- `POST /api/auth/register` – create new user
- `POST /api/auth/login` – obtain JWT token
- `POST /api/analyze-crop` – crop recommendation (requires auth)
- `POST /api/detect-disease` – disease detection (requires auth)
- `GET  /api/weather-forecast` – sample weather data
- `POST /api/yield` – yield & loss calculation
- `GET  /api/profit-report` – profit summary
- `POST /api/simulate` – what‑if simulation

Tokens are stored in `localStorage` by the client; axios automatically attaches them via an interceptor.

## Design System
- **Font**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Forest green (`forest-*`) + Earth amber (`earth-*`)
- **Components**: `.card`, `.btn-primary`, `.badge-low/medium/high`, `.input-field`



- to run the backend --> use node src/index.js (go to backend folder)
- to run frontend --> use npm run dev