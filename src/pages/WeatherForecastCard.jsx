import { Cloud, Droplets, Wind } from "lucide-react";
import { useEffect, useState } from 'react';
import { api } from '../store/useAppStore';

export default function WeatherForecastCard() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // try to get the user's current position first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lon } }) => {
          api.weatherForecast(lat, lon)
            .then(data => setForecast(data))
            .catch(console.error)
            .finally(() => setLoading(false));
        },
        (err) => {
          console.error('geolocation failed', err);
          setLoading(false);
        }
      );
    } else {
      api.weatherForecast()
        .then(data => setForecast(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        Loading weather...
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        Unable to load weather information.
      </div>
    );
  }

  const today = forecast.forecast?.[0] || {};
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#1f5f3d] text-lg font-semibold">
        <Cloud className="w-5 h-5" />
        Weather Forecast
      </div>

      <div className="bg-[#f0f9f4] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">{today.day || 'Tomorrow'}</span>
          <div className="flex items-center gap-2">
            {/* icon might be an emoji or a url */}
            {today.icon && today.icon.startsWith('http') ? (
              <img src={today.icon} alt="" className="w-6 h-6" />
            ) : (
              <span className="text-2xl">{today.icon || '🌤'}</span>
            )}
            <span className="text-xl font-bold text-[#1f5f3d]">{today.temp}°C</span>
          </div>
        </div>

        <p className="text-gray-700 font-medium mb-3">{today.desc || ''}</p>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#16a34a]" />
            {today.humidity || ''}% Humidity
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#16a34a]" />
            {today.wind || ''} km/h
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {forecast.insight || 'Stay tuned for updates.'}
      </div>
    </div>
  );
}
