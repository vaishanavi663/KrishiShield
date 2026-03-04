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

## Connecting to FastAPI Backend
Replace mock functions in `src/store/useAppStore.js`:

```js
// Replace this:
export const api = {
  analyzeCrop: async (params) => { ... mock ... }
}

// With real Axios calls:
import axios from 'axios'
const BASE = 'http://localhost:8000'

export const api = {
  analyzeCrop: (params) => axios.post(`${BASE}/crop/recommend`, params).then(r => r.data),
  detectDisease: (file) => {
    const fd = new FormData(); fd.append('file', file)
    return axios.post(`${BASE}/disease/detect`, fd).then(r => r.data)
  },
}
```

## Backend Expected Endpoints
- `POST /crop/recommend` → `{ recommendations, riskScore, insight }`
- `POST /disease/detect` → `{ name, confidence, severity, level, treatments }`
- `GET /report/{userId}` → full report data

## Design System
- **Font**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Forest green (`forest-*`) + Earth amber (`earth-*`)
- **Components**: `.card`, `.btn-primary`, `.badge-low/medium/high`, `.input-field`
