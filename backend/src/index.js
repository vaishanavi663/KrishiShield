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
import advisoryRoutes from "./routes/advisoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//what should i do
app.use("/api/advisory", advisoryRoutes);


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

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `❌ Port ${PORT} is already in use. ` +
          'Make sure no other instance of the backend is running, or set a different PORT in your environment.'
        );
      } else {
        console.error('❌ Server failed to start due to an unexpected error:', err);
      }
      process.exit(1);
    });

  } catch (err) {
    console.error('❌ Unable to start server', err);
  }
})();