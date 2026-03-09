import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { getApiBaseUrl } from '../../config.js'
import {
  LayoutDashboard, Sprout, Camera, FlaskConical,
  TrendingDown, Lightbulb, FileText, LogOut, Globe, ChevronRight,
  AlertTriangle, HelpCircle
} from 'lucide-react'
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const navItems = [
  { to: '/app/home', label: 'overview', icon: LayoutDashboard, section: 'main' },
  { to: '/app/crop-planner', label: 'cropPlanner', icon: Sprout, section: 'main' },
  { to: '/app/scan-crop', label: 'scanCrop', icon: Camera, section: 'main' },

  { to: '/app/simulator', label: 'riskSimulator', icon: FlaskConical, section: 'analysis' },
  { to: '/app/yield', label: 'yieldEstimator', icon: TrendingDown, section: 'analysis' },
  { to: '/app/insights', label: 'smartInsights', icon: Lightbulb, section: 'analysis' },

  { to: '/app/report', label: 'healthReport', icon: FileText, section: 'reports' },
  { to: '/app/profit-reports', label: 'profitReports', icon: TrendingDown, section: 'reports' },

  { to: '/app/disease-alert', label: 'diseaseAlerts', icon: AlertTriangle, section: 'alerts' },
  { to: '/app/help', label: 'help', icon: HelpCircle, section: 'support' },
]

export default function DashboardLayout() {

  const { user, logout, language, setLanguage } = useAppStore()
  const navigate = useNavigate()

  const { t, i18n } = useTranslation()

  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {

        const apiUrl =
          `${getApiBaseUrl()}/weather?lat=${lat}&lon=${lon}`

        fetch(apiUrl)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
          })
          .then(data => {
            setWeather(data)
            setWeatherError(null)
          })
          .catch(err => {
            console.error(err)
            setWeatherError(err.message)
          })
      },
      (err) => {
        setWeatherError(`Location access denied`)
      }
    )
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const languages = [
    { code: 'en', label: '🇬🇧 English', name: 'English' },
    { code: 'hi', label: '🇮🇳 हिंदी', name: 'Hindi' },
    { code: 'mr', label: '🇮🇳 मराठी', name: 'Marathi' },
    { code: 'ta', label: '🇮🇳 தமிழ்', name: 'Tamil' },
    { code: 'te', label: '🇮🇳 తెలుగు', name: 'Telugu' },
    { code: 'bn', label: '🇮🇳 বাংলা', name: 'Bengali' },
    { code: 'gu', label: '🇮🇳 ગુજરાતી', name: 'Gujarati' },
    { code: 'kn', label: '🇮🇳 ಕನ್ನಡ', name: 'Kannada' },
    { code: 'pa', label: '🇮🇳 ਪੰਜਾਬੀ', name: 'Punjabi' },
    { code: 'ml', label: '🇮🇳 മലയാളം', name: 'Malayalam' }
  ]

  const currentLanguage = languages.find(l => l.code === language) || languages[0]
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    setShowLanguageMenu(false)
  }

  return (
    <div className="flex h-screen bg-forest-50 font-body overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-60 bg-forest-800 flex flex-col shrink-0 shadow-xl">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-forest-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-display font-bold text-white text-lg">
                KrishiShield
              </div>
              <div className="text-forest-400 text-xs">
                Crop Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="mx-4 mt-4 mb-2 bg-forest-700/50 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.[0]?.toUpperCase() || 'F'}
          </div>

          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">
              {user?.username || 'Farmer'}
            </div>
            <div className="text-forest-400 text-xs truncate">
              {user?.state || 'Maharashtra'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">

          {navItems.map(({ to, label, icon: Icon }) => (

            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-500 text-white'
                    : 'text-forest-300 hover:bg-forest-700 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              <span>{t(label)}</span>

            </NavLink>

          ))}

        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 border-t border-forest-700 pt-3 space-y-1">

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-forest-700 hover:text-white"
            >
              <Globe size={16} />
              <span className="text-xs">{currentLanguage.label}</span>
              <ChevronRight size={14} className={`ml-auto transition-transform ${showLanguageMenu ? 'rotate-90' : ''}`} />
            </button>

            {showLanguageMenu && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-forest-700 rounded-xl border border-forest-600 shadow-lg z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 text-xs transition ${
                      language === lang.code
                        ? 'bg-forest-500 text-white font-semibold'
                        : 'text-forest-200 hover:bg-forest-600 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-red-900/40 hover:text-red-400"
          >
            <LogOut size={16} />
            <span>{t("logout")}</span>
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <header className="sticky top-0 bg-white border-b px-8 py-3 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm text-forest-600">
            <span className="font-medium text-forest-800">KrishiShield</span>
            <ChevronRight size={14} />
            <span>{t("dashboard")}</span>
          </div>

        </header>

        {/* Weather error */}
        {weatherError && (
          <div className="px-8 pt-4">
            <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-3 text-sm">
              Weather unavailable: {weatherError}
            </div>
          </div>
        )}

        {/* Weather Card */}
        {weather && (
          <div className="px-8 pt-6">

            <div className="bg-gradient-to-r from-forest-500 to-emerald-400 text-white rounded-2xl shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="text-4xl">🌤</div>

                <div>
                  <div className="text-lg font-semibold">
                    {weather.location}
                  </div>

                  <div className="text-sm capitalize">
                    {weather.condition}
                  </div>
                </div>

              </div>

              <div className="mt-4 md:mt-0 text-center">

                <div className="text-3xl font-bold">
                  {Math.round(weather.temperature)}°C
                </div>

                <div className="text-xs opacity-80">
                  {t("weather")}
                </div>

              </div>

              <div className="flex gap-6 mt-4 md:mt-0 text-sm">

                <div className="flex flex-col items-center">
                  <span>💧</span>
                  <span>{weather.humidity}%</span>
                  <span className="text-xs">{t("humidity")}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span>💨</span>
                  <span>{weather.windSpeed} m/s</span>
                  <span className="text-xs">{t("wind")}</span>
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