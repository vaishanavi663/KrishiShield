import express from "express";
// `fetch` is available globally in modern Node versions (>=18).
// if needed, install node-fetch and uncomment the import below.
 import fetch from "node-fetch";

const router = express.Router();

// current weather – expects ?lat=...&lon=...
router.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'lat and lon query parameters required' });
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Server mis‑configured: missing WEATHER_API_KEY' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ message: `OpenWeather API error: ${response.statusText}` });
    }
    const data = await response.json();

    const weatherData = {
      location: data.name || 'Unknown',
      temperature: data.main?.temp || 0,
      humidity: data.main?.humidity || 0,
      condition: data.weather?.[0]?.description || 'Unknown',
      wind: data.wind?.speed || 0
    };

    res.json(weatherData);

  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ message: "Weather fetch failed: " + error.message });
  }
});

// 3‑day forecast – proxy to OpenWeather "onecall" endpoint
router.get('/weather-forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'lat and lon query parameters required' });
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Server mis‑configured: missing WEATHER_API_KEY' });
    }
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const forecast = (data.daily || []).slice(0, 3).map(d => ({
      day: new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(d.temp.day),
      desc: d.weather?.[0]?.description || '',
      icon: d.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` : '',
      humidity: d.humidity,
      wind: d.wind_speed
    }));

    res.json({ location: data.timezone || '', forecast, insight: 'Stay tuned for updates.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Forecast fetch failed' });
  }
});

export default router;