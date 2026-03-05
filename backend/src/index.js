import dotenv from 'dotenv';
// environment variables must be loaded before anything else
dotenv.config();

import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';
import weatherRoutes from './routes/weather.js';

// import models so sequelize registers them
import './models/user.js';
import './models/cropRecommendation.js';
import './models/diseaseResult.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// expose weather endpoints first so that /api/weather* works
app.use('/api', weatherRoutes);

// root test route
app.get('/', (req, res) => {
  res.send('KrishiShield Backend API is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api', analysisRoutes);

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // update database schema automatically
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Unable to start server', err);
  }
})();