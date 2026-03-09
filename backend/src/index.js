import dotenv from 'dotenv';
// environment variables must be loaded before anything else
dotenv.config();

// Fix "self-signed certificate in certificate chain" when behind proxy/antivirus (dev only)
if (process.env.ALLOW_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';
import weatherRoutes from './routes/weather.js';
import smsRoutes from './routes/sms.js';

// import models so sequelize registers them
import './models/user.js';
import './models/cropRecommendation.js';
import './models/diseaseResult.js';
import advisoryRoutes from "./routes/advisoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("OK");
});

//what should i do
app.use("/api/advisory", advisoryRoutes);


// expose weather endpoints first so that /api/weather* works
app.use('/api', weatherRoutes);

// root test route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "KrishiShield API",
  });
});
app.use('/api/auth', authRoutes);
app.use('/api', analysisRoutes);
app.use('/api/sms', smsRoutes);

const PORT = process.env.PORT || 8080;

(async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Unable to start server", err);
  }
})();


process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});