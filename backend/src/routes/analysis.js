import express from 'express';
import jwt from 'jsonwebtoken';
import CropRecommendation from '../models/cropRecommendation.js';
import DiseaseResult from '../models/diseaseResult.js';

const router = express.Router();

// simple auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// crop analysis
router.post('/analyze-crop', auth, async (req, res) => {
  try {
    const { nitrogen = 0, phosphorus = 0, potassium = 0, ph = 7, rainfall = 0 } = req.body;
    // dummy logic: pick a crop based on nitrogen value
    const crops = ['Maize', 'Soybean', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Sugarcane', 'Chickpea'];
    const idx = Math.floor((nitrogen / 200) * crops.length) % crops.length;
    const recommendations = [
      { name: crops[idx], confidence: 87, risk: 'low', roi: '₹28,000–₹35,000' },
      { name: crops[(idx + 1) % crops.length], confidence: 74, risk: 'medium', roi: '₹22,000–₹29,000' },
      { name: crops[(idx + 2) % crops.length], confidence: 61, risk: 'high', roi: '₹38,000–₹50,000' }
    ];
    const result = {
      recommendations,
      riskScore: 42,
      rainfallDeviation: '+12%',
      insight: 'Based on provided parameters, the top crop is optimal for this season.'
    };
    // save
    await CropRecommendation.create({
      userId: req.user.id,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      rainfall,
      result
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// disease detection - accepts image file and crop name
// for simplicity we'll pretend we analysed it
router.post('/detect-disease', auth, async (req, res) => {
  try {
    // in a real server you would process req.files or similar
    const crop = req.body.crop || 'Unknown';
    const diseases = [
      { name: 'Leaf Blight (Helminthosporium)', confidence: 91, severity: 22, level: 'moderate' },
      { name: 'Powdery Mildew', confidence: 85, severity: 15, level: 'mild' },
      { name: 'Stem Rot (Fusarium)', confidence: 88, severity: 38, level: 'severe' }
    ];
    const choice = diseases[Math.floor(Math.random() * diseases.length)];
    const result = { crop, ...choice };
    // store
    await DiseaseResult.create({ userId: req.user.id, crop, result, imageUrl: req.body.imageUrl || '' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// the real weather endpoints live in /routes/weather.js
// this route used to return static data and has been removed.

// yield estimation
router.post('/yield', auth, (req, res) => {
  const { crop = 'Maize', area = 1, severity = 0, price = 0 } = req.body;
  // reuse same constants as front-end so results match
  const CROPS = {
    Maize:     { sens: 0.65, base: 55,  price: 1850 },
    Wheat:     { sens: 0.55, base: 45,  price: 2200 },
    Rice:      { sens: 0.70, base: 65,  price: 1950 },
    Soybean:   { sens: 0.60, base: 30,  price: 3800 },
    Cotton:    { sens: 0.75, base: 20,  price: 6500 },
    Sugarcane: { sens: 0.50, base: 400, price: 285  },
    Chickpea:  { sens: 0.55, base: 18,  price: 4800 },
    Groundnut: { sens: 0.60, base: 25,  price: 5200 },
  };
  const cfg = CROPS[crop] || CROPS.Maize;
  const base = cfg.base * area;
  const lp = severity * cfg.sens / 100;
  const actual = +(base * (1 - lp)).toFixed(1);
  const lossQ = +(base - actual).toFixed(1);
  const lossR = Math.round(lossQ * (price || cfg.price) / 10);
  const rev = Math.round(actual * (price || cfg.price) / 10);
  res.json({ crop, area, base, actual, lossQ, lossR, rev, lp: Math.round(lp * 1000) / 10 });
});

// profit report - return dummy values with summary and crop breakdown
router.get('/profit-report', auth, (req, res) => {
  const summary = [
    { title: 'This Month Profit', value: '₹12,450', delta: '+8% vs last month' },
    { title: 'Estimated Annual', value: '₹1,45,200', delta: '+12% YoY' },
    { title: 'Average per Acre', value: '₹6,200', delta: '' },
  ];
  const rows = [
    { crop: 'Wheat', revenue: '₹45,000', cost: '₹20,000', profit: '₹25,000' },
    { crop: 'Rice', revenue: '₹38,000', cost: '₹18,500', profit: '₹19,500' },
    { crop: 'Maize', revenue: '₹22,000', cost: '₹9,000', profit: '₹13,000' },
  ];
  res.json({ summary, rows });
});

// simple simulator sample - compute same metrics as front-end
router.post('/simulate', auth, (req, res) => {
  const { rain = 210, price = 1850, sev = 22, tempDev = 2 } = req.body;
  function calcRisk(rain, price, sev, tempDev) {
    let score = 0;
    if (rain < 100 || rain > 400) score += 2; else if (rain < 150 || rain > 300) score += 1;
    if (sev > 30) score += 2; else if (sev > 15) score += 1;
    if (Math.abs(tempDev) > 5) score += 2; else if (Math.abs(tempDev) > 2) score += 1;
    if (price < 1000) score += 1;
    return score;
  }
  const riskScore = calcRisk(rain, price, sev, tempDev);
  const riskLabel = riskScore >= 5 ? 'High' : riskScore >= 3 ? 'Medium' : 'Low';
  const yieldLoss = Math.round(sev * 0.65 + Math.abs(tempDev) * 0.5);
  const yieldAmt  = +(55 * (1 - yieldLoss / 100)).toFixed(1);
  const profit    = Math.round(yieldAmt * 10 * price / 1000);
  const irr       = rain < 150 ? 'High' : rain < 250 ? 'Moderate' : 'Low';
  const fertAdj   = tempDev > 3 ? '+10% N' : tempDev > 0 ? '+5% N' : 'Normal';
  res.json({ riskScore, riskLabel, yieldLoss, yieldAmt, profit, irr, fertAdj });
});

//onboarding questin saving
router.post('/onboarding', auth, async (req, res) => {
  try {
    const { landType, state, requirement, farmSize } = req.body;

    console.log("Incoming onboarding data:", req.body);

    const record = await CropRecommendation.create({
      userId: req.user.id,
      landType,
      state,
      requirement,
      farmSize
    });

    res.json({
      message: "Onboarding data saved",
      record
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
