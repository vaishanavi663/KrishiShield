import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import CropRecommendation from "../models/cropRecommendation.js";
import DiseaseResult from "../models/diseaseResult.js";
import User from "../models/user.js";

const router = express.Router();

/* ---------------- AUTH MIDDLEWARE ---------------- */

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.sub || payload.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ---------------- TODAY ADVISORY ---------------- */

router.get("/today", auth, async (req, res) => {
  try {
    console.log("Fetching advisory for user:", req.user.id);

    /* ---------- USER ---------- */

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const city = user.state || "Mumbai";

    /* ---------- WEATHER ---------- */

    let weatherData = null;

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

      weatherData = weatherRes.data;
    } catch (err) {
      console.log("Weather API failed:", err.message);
    }

    const temp = weatherData?.main?.temp ?? 30;
    const humidity = weatherData?.main?.humidity ?? 60;
    const rain = weatherData?.weather?.[0]?.main ?? "Clear";

    /* ---------- USER HISTORY ---------- */

    let recentCropRecs = [];
    let recentDiseaseResults = [];

    try {
      recentCropRecs = await CropRecommendation.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
      });
    } catch (err) {
      console.log("CropRecommendation query failed:", err.message);
    }

    try {
      recentDiseaseResults = await DiseaseResult.findAll({
       
        order: [["createdAt", "DESC"]],
        limit: 5,
      });
    } catch (err) {
      console.log("DiseaseResult query failed:", err.message);
    }

    /* ---------- BUILD RECOMMENDATIONS (KEY-BASED FOR i18n) ---------- */

    const recommendations = [];

    /* Temperature based */

    if (temp > 32) {
      recommendations.push({
        titleKey: "irrigationSuggested",
        messageKey: "highTempIrrigation",
        icon: "💧",
        priority: "high",
      });
    }

    /* Humidity based */

    if (humidity > 70) {
      recommendations.push({
        titleKey: "pestMonitoring",
        messageKey: "highHumidityPests",
        icon: "⚠️",
        priority: "medium",
      });
    }

    /* Rain based */

    if (rain === "Rain") {
      recommendations.push({
        titleKey: "avoidFertilizer",
        messageKey: "rainAvoidFert",
        icon: "🌧️",
        priority: "high",
      });
    } else {
      recommendations.push({
        titleKey: "fertilizerWindow",
        messageKey: "fertWindowMsg",
        icon: "🧪",
        priority: "medium",
      });
    }

    /* Crop recommendation suggestion */

    if (recentCropRecs.length > 0) {
      const latest = recentCropRecs[0];
      const crop =
        latest?.result?.recommendations?.[0]?.name || null;

      if (crop) {
        recommendations.push({
          titleKey: "cropPlanningTitle",
          messageKey: "cropPlanningMessage",
          vars: { crop },
          icon: "🌱",
          priority: "low",
        });
      }
    }

    /* Disease suggestion */

    if (recentDiseaseResults.length > 0) {
      const latestDisease = recentDiseaseResults[0];
      const disease = latestDisease?.result;

      if (disease?.severity && disease.severity > 20) {
        recommendations.push({
          titleKey: "diseaseTreatmentTitle",
          messageKey: "diseaseTreatmentMessage",
          vars: { diseaseName: disease.name, severity: disease.severity },
          icon: "🩺",
          priority: "high",
        });
      }
    }

    /* Farm size suggestion */

    if (user.farmSize) {
      const size = parseFloat(user.farmSize);

      if (size > 10) {
        recommendations.push({
          titleKey: "equipmentCheckTitle",
          messageKey: "equipmentCheckMessage",
          icon: "🔧",
          priority: "medium",
        });
      }
    }

    /* ---------- SORT BY PRIORITY ---------- */

    const priorityOrder = { high: 3, medium: 2, low: 1 };

    recommendations.sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    const topRecommendations = recommendations.slice(0, 5);

    /* ---------- RESPONSE ---------- */

    res.json({
      weather: { temp, humidity, rain },
      recommendations: topRecommendations,
    });
  } catch (error) {
    console.error("Advisory route crashed:", error);

    res.status(500).json({
      weather: null,
      recommendations: [],
      error: "Unable to fetch advisory at this time",
    });
  }
});

export default router;