<div align="center">

# 🌾 KrishiShield
### *AI-Powered Crop Decision & Damage Intelligence System*

<br/>

> **Turning uncertainty into confidence. Turning data into decisions. Because every crop matters.**

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br/>

</div>

---

## 🧠 What is KrishiShield?

**KrishiShield** is a full-stack, AI-powered web application designed to revolutionize how farmers make decisions about their crops. From disease detection to financial impact forecasting, KrishiShield acts as a **digital shield** for every farmer — giving them the intelligence they need to protect their harvest and maximize their income.

Whether it's identifying crop diseases from a single photo, recommending the best crop based on soil and weather, or simulating what-if scenarios for risk planning — **KrishiShield has it all, in one place.**

---

## 🤖 AI & ML at the Core

> KrishiShield is not just a web app — it's a **full AI inference pipeline** trained on real agricultural data.

### 🌿 PlantVillage Dataset
| Detail | Value |
|--------|-------|
| 📦 **Dataset** | PlantVillage |
| 🖼️ **Total Images** | 54,000+ labeled crop images |
| 🌾 **Coverage** | 38 disease classes across multiple crops |
| 🧪 **Use Case** | Training & inference for crop disease detection |

### 🧠 AI Model — MobileNetV2
| Detail | Value |
|--------|-------|
| 🏗️ **Architecture** | MobileNet V2 (1.0, 224×224) |
| 🤗 **Hosted On** | Hugging Face |
| 🔗 **Model ID** | `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` |
| ⚡ **Inference** | Real-time via Hugging Face Inference API |

### 🔬 How the Disease Detection Pipeline Works

```
User uploads crop image
        ↓
Frontend sends image to KrishiShield Backend
        ↓
Backend extracts image features & patterns
        ↓
Image sent to Hugging Face Inference API
(MobileNetV2 model trained on 54,000+ PlantVillage images)
        ↓
Model matches patterns → returns disease class + confidence score
        ↓
Backend generates complete diagnosis report:
  ✅ Disease name & description
  ✅ Fertiliser & treatment recommendations
  ✅ Severity risk level (Low / Medium / High)
        ↓
If risk is HIGH → Twilio SMS alert sent to farmer 📲
        ↓
Full report displayed on frontend dashboard
```

### 📲 Twilio SMS Alerts
When the AI detects a **high-severity** crop disease, KrishiShield automatically fires an **SMS alert** to the farmer via the **Twilio API** — so they can act immediately, even without being on the app.

```
🚨 KRISHISHIELD ALERT
Disease Detected: Tomato Late Blight
Severity: HIGH RISK
Immediate Action Required.
Check your KrishiShield dashboard for treatment details.
```

---

## 🚨 The Problem We're Solving

> 🌍 Millions of farmers lose their harvests every year due to **late disease detection**, **poor crop planning**, and **lack of access to expert agricultural advice.**

- ❌ No real-time disease alerts
- ❌ No data-driven crop recommendations
- ❌ No way to forecast financial damage before it happens
- ❌ Agricultural expertise is expensive and inaccessible

**KrishiShield changes that.**

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🌱 **AI Crop Planner** | Enter soil & weather conditions → get instant AI-powered crop recommendations |
| 🔬 **Crop Disease Scanner** | Upload a photo → MobileNetV2 AI (54k+ images) detects disease, severity & suggests fertiliser/treatment |
| 📲 **Twilio SMS Alerts** | Auto-sends SMS to farmer when high-severity disease is detected — real-time, no app needed |
| 📊 **What-If Simulator** | Adjust risk factors with sliders → simulate yield, profit & risk projections |
| 💰 **Yield & Loss Calculator** | Calculate exact financial impact based on crop type, damage severity & area |
| 🔔 **Smart Insights & Alerts** | AI-generated real-time alerts for upcoming risks, weather changes & actions |
| 📋 **Downloadable Reports** | Aggregated farm intelligence report — downloadable anytime |
| 🔐 **Auth & Farm Profiles** | Secure login with JWT + personalized 4-step farm onboarding |
| 🌦️ **Live Weather Integration** | Real-time weather data via OpenWeatherMap API |

---

## 🖥️ Pages & Routes

```
/                    →  Landing Page         (Hero, Features, How it Works, CTA)
/login               →  Login Page           (Language select, Sign in / Register)
/onboarding          →  Onboarding Page      (4-step farm profile setup)
/app/home            →  Dashboard            (KPIs, charts, farm overview)
/app/crop-planner    →  Crop Planner         (AI crop recommendations)
/app/scan-crop       →  Scan Crop            (Image upload + disease detection)
/app/simulator       →  What-If Simulator    (Risk/yield/profit projections)
/app/yield           →  Yield Calculator     (Financial damage estimation)
/app/insights        →  Smart Insights       (AI alerts & suggestions)
/app/report          →  Report Page          (Full report + download)
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **React 18** (Vite) | UI framework |
| **Tailwind CSS** | Styling with custom forest/earth palette |
| **React Router DOM v6** | Client-side routing |
| **Zustand** | Global state management + localStorage persistence |
| **Recharts** | Interactive area, bar, line & radial charts |
| **Axios** | HTTP client with JWT interceptor |
| **Lucide React** | Icon library |

### Backend
| Tech | Purpose |
|------|---------|
| **Node.js + Express** | REST API server |
| **Sequelize ORM** | Database management |
| **PostgreSQL / SQLite** | Primary database |
| **JWT** | Secure authentication |
| **OpenWeatherMap API** | Live weather data |
| **Hugging Face Inference API** | MobileNetV2 crop disease detection |
| **Twilio API** | SMS alerts for high-severity disease detection |
| **PlantVillage Dataset** | 54,000+ labeled crop disease images |

---

## 📁 Project Structure

```
KrishiShield/
├── 📂 src/
│   ├── 📂 pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── OnboardingPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── CropPlannerPage.jsx
│   │   ├── ScanCropPage.jsx
│   │   ├── SimulatorPage.jsx
│   │   ├── YieldPage.jsx
│   │   ├── InsightsPage.jsx
│   │   └── ReportPage.jsx
│   ├── 📂 components/
│   │   └── layout/
│   │       └── DashboardLayout.jsx
│   ├── 📂 store/
│   │   └── useAppStore.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── 📂 backend/
│   └── src/
│       └── index.js
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (or SQLite for local dev)
- OpenWeatherMap API Key

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/vaishanavi663/KrishiShield.git
cd KrishiShield
```

---

### 2️⃣ Setup the Frontend

```bash
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

---

### 3️⃣ Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/krishishield_db
PORT=5000
JWT_SECRET=your_secret_key_here
WEATHER_API_KEY=your_openweathermap_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

> 💡 For local development, SQLite works out of the box — no PostgreSQL setup needed!

Start the backend:

```bash
node src/index.js
```

Backend runs at `http://localhost:5000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `POST` | `/api/analyze-crop` | AI crop recommendation | ✅ |
| `POST` | `/api/detect-disease` | Crop disease detection | ✅ |
| `GET` | `/api/weather-forecast` | Live weather data | ✅ |
| `POST` | `/api/yield` | Yield & loss calculation | ✅ |
| `GET` | `/api/profit-report` | Profit summary report | ✅ |
| `POST` | `/api/simulate` | What-if simulation | ✅ |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary Font** | Playfair Display (headings) |
| **Body Font** | DM Sans |
| **Primary Color** | Forest Green (`forest-*`) |
| **Accent Color** | Earth Amber (`earth-*`) |
| **Theme** | Nature-inspired, clean & modern |

---

## 🌟 Why KrishiShield?

```
🌾  Built FOR farmers, not just about farming
🤖  MobileNetV2 AI trained on 54,000+ real crop images
📲  Twilio SMS alerts — farmer notified even without the app
🌍  Designed for Indian agricultural conditions
🔬  Full AI inference pipeline — from image to diagnosis report
🔒  Secure, private, and farmer-first
```

---

## 🙌 Contributing

Contributions are welcome! If you'd like to improve KrishiShield:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### 🌾 KrishiShield — *Shielding Every Farmer. Empowering Every Harvest.*

<br/>

Made with ❤️ for the farmers of India

</div>
