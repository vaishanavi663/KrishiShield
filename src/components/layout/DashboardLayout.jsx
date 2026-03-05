import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import {
  LayoutDashboard, Sprout, Camera, FlaskConical,
  TrendingDown, Lightbulb, FileText, LogOut, Globe, ChevronRight,
  AlertTriangle, HelpCircle
} from 'lucide-react'
import { useState, useEffect } from "react";

const navItems = [
  { to: '/app/home',           label: 'Overview',        icon: LayoutDashboard, section: 'main' },
  { to: '/app/crop-planner',   label: 'Crop Planner',    icon: Sprout,          section: 'main' },
  { to: '/app/scan-crop',      label: 'Scan Crop',       icon: Camera,          section: 'main' },

  { to: '/app/simulator',      label: 'Risk Simulator',  icon: FlaskConical,    section: 'analysis' },
  { to: '/app/yield',          label: 'Yield Estimator', icon: TrendingDown,    section: 'analysis' },
  { to: '/app/insights',       label: 'Smart Insights',  icon: Lightbulb,       section: 'analysis' },

  { to: '/app/report',         label: 'Health Report',   icon: FileText,        section: 'reports' },
  { to: '/app/profit-reports', label: 'Profit Reports',  icon: TrendingDown,    section: 'reports' },

  { to: '/app/disease-alert',  label: 'Disease Alerts',  icon: AlertTriangle,   section: 'alerts' },
  { to: '/app/help',           label: 'Help',            icon: HelpCircle,      section: 'support' },
]

export default function DashboardLayout() {
  const { user, logout, language, setLanguage } = useAppStore()
  const navigate = useNavigate()

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation not available');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        console.log('User location:', { lat, lon });
        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/weather?lat=${lat}&lon=${lon}`;
        console.log('Fetching from:', apiUrl);
        
        fetch(apiUrl)
          .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(data => {
            console.log('Weather data received:', data);
            setWeather(data);
            setWeatherError(null);
          })
          .catch(err => {
            console.error('Weather fetch error:', err);
            setWeatherError(err.message);
          });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setWeatherError(`Location access denied: ${err.message}`);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-forest-50 font-body overflow-hidden">
      {/* ── SIDEBAR ── */}
      <aside className="w-60 bg-forest-800 flex flex-col shrink-0 shadow-xl">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-forest-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-display font-bold text-white text-lg leading-none">KrishiShield</div>
              <div className="text-forest-400 text-xs mt-0.5">Crop Intelligence</div>
            </div>
          </div>
        </div>

        {/* User pill */}
        <div className="mx-4 mt-4 mb-2 bg-forest-700/50 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'F'}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.username || 'Farmer'}</div>
            <div className="text-forest-400 text-xs truncate">{user?.state || 'Maharashtra'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
          {['main','analysis','reports','alerts','support'].map(section => {
            const items = navItems.filter(i => i.section === section)
            if (!items.length) return null
            const sectionTitle = (
              section === 'main' ? 'Main'
              : section === 'analysis' ? 'Analysis'
              : section === 'reports' ? 'Reports'
              : section === 'alerts' ? 'Alerts'
              : 'Support'
            )
            return (
              <div key={section} className="mb-3">
                <div className="text-forest-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  {sectionTitle}
                </div>
                {items.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                        isActive
                          ? 'bg-forest-500 text-white shadow-sm'
                          : 'text-forest-300 hover:bg-forest-700 hover:text-white'
                      }`
                    }>
                    {({ isActive }) => (<>
                      <Icon size={16} className={isActive ? 'text-white' : 'text-forest-400 group-hover:text-white'} />
                      <span className="flex-1">{label}</span>
                      {isActive && <ChevronRight size={12} className="opacity-60" />}
                    </>)}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 border-t border-forest-700 pt-3 space-y-1">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-forest-700 hover:text-white transition-all"
          >
            <Globe size={16} className="text-forest-400" />
            <span>{language === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-red-900/40 hover:text-red-400 transition-all"
          >
            <LogOut size={16} className="text-forest-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-forest-100 px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm text-forest-500">
            <span className="font-medium text-forest-800">KrishiShield</span>
            <ChevronRight size={14} />
            <span className="capitalize text-forest-500" id="page-title">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-forest-500 bg-forest-50 border border-forest-200 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-400 animate-pulse-dot"></span>
              Live Analysis
            </div>
            <NavLink to="/app/report">
              <button className="btn-primary text-sm py-2 px-4">📄 Report</button>
            </NavLink>
          </div>
        </header>

        {/* 🌤 Weather Error */}
        {weatherError && (
          <div className="px-8 pt-4">
            <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-3 text-sm">
              <strong>Weather unavailable:</strong> {weatherError}
            </div>
          </div>
        )}

       {/* 🌤 Weather Card */}
{weather && (
  <div className="px-8 pt-6">
    <div className="bg-gradient-to-r from-forest-500 to-emerald-400 text-white rounded-2xl shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between">

      {/* Location + condition */}
      <div className="flex items-center gap-4">
        <div className="text-4xl">🌤</div>
        <div>
          <div className="text-lg font-semibold">
            {weather.location || "Your Location"}
          </div>
          <div className="text-sm opacity-90 capitalize">
            {weather.condition}
          </div>
        </div>
      </div>

      {/* Temperature */}
      <div className="mt-4 md:mt-0 text-center">
        <div className="text-3xl font-bold">
          {Math.round(weather.temperature)}°C
        </div>
        <div className="text-xs opacity-80">Current Temperature</div>
      </div>

      {/* Details */}
      <div className="flex gap-6 mt-4 md:mt-0 text-sm">

        <div className="flex flex-col items-center">
          <span>💧</span>
          <span className="font-medium">{weather.humidity}%</span>
          <span className="opacity-80 text-xs">Humidity</span>
        </div>

        <div className="flex flex-col items-center">
          <span>💨</span>
          <span className="font-medium">{weather.windSpeed} m/s</span>
          <span className="opacity-80 text-xs">Wind</span>
        </div>

      </div>
    </div>
  </div>
)}

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
