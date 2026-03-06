import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight, Leaf, Zap } from 'lucide-react'
import FarmSummaryCards from './FarmSummaryCards'
import WeatherForecastCard from "./WeatherForecastCard";
import WhatShouldIDoToday from "./WhatShouldIDoToday";


const yieldData = [
  { month: 'Sep', yield: 92, target: 95 },
  { month: 'Oct', yield: 88, target: 95 },
  { month: 'Nov', yield: 76, target: 90 },
  { month: 'Dec', yield: 82, target: 90 },
  { month: 'Jan', yield: 78, target: 88 },
  { month: 'Feb', yield: 86, target: 90 },
]

const riskData = [{ name: 'Safe Zone', value: 58, fill: '#52b788' }]

export default function HomePage() {
  const navigate = useNavigate()
  const { user, onboarding } = useAppStore()
  const { t } = useTranslation()

  const hour = new Date().getHours()
  let greeting
  if (hour < 12) {
    greeting = t('goodMorning')
  } else if (hour < 17) {
    greeting = t('goodAfternoon')
  } else {
    greeting = t('goodEvening')
  }

  const recentAlerts = [
    { icon: '🦠', type: 'danger',  title: 'Leaf Blight Detected',           desc: 'Moderate severity at 22% — apply treatment within 48h', time: '2h ago' },
    { icon: '⛈️', type: 'warning', title: 'Rainfall Variability Detected',  desc: '+12% above seasonal average', time: '5h ago' },
    { icon: '💰', type: 'success', title: 'Market Price Opportunity',        desc: 'Maize prices projected +8–12% in Q2', time: '1d ago' },
    { icon: '🌡️', type: 'warning', title: 'Temperature Anomaly',            desc: '2°C above optimal for Maize pollination', time: '1d ago' },
  ]

  const quickActions = [
    { icon: '🌱', label: t('analyzeCrop'), path: '/app/crop-planner', color: 'bg-forest-500' },
    { icon: '📷', label: t('scanCrop'),    path: '/app/scan-crop',    color: 'bg-earth-500' },
    { icon: '🧪', label: t('riskSimulator'),    path: '/app/simulator',    color: 'bg-blue-500' },
    { icon: '📄', label: t('healthReport'),        path: '/app/report',       color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-800">
            {greeting}, {user?.username || 'Farmer'}! 🌞
          </h1>
          <p className="text-forest-500 text-sm mt-0.5">
            {user?.state || 'Maharashtra'} · {onboarding.landType ? onboarding.landType.replace(/^\w/, c => c.toUpperCase()) + ' ' + t('soilType') : 'Loamy ' + t('soilType')} · {onboarding.farmSize ? onboarding.farmSize + ' ' + t('farmSize') : '5–20 ' + t('farmSize')}
          </p>
        </div>
        <button onClick={() => navigate('/app/crop-planner')}
          className="btn-primary flex items-center gap-2 text-sm">
          <Zap size={15} /> {t('newAnalysis')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-forest-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('topCrop')}</div>
          <div className="text-lg font-display font-bold text-forest-700">🌽 Maize</div>
          <div className="text-xs text-forest-400 mt-1">{t('confidence')}: 87% · {t('roi')}: ₹28K–₹35K</div>
        </div>
        <div className="stat-card border-l-4 border-earth-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('riskLevel')}</div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={18} className="text-earth-500" />
            <span className="text-lg font-display font-bold text-earth-600">{t('medium')}</span>
          </div>
          <div className="text-xs text-forest-400 mt-1">{t('rainfallDeviation')}: +12%</div>
        </div>
        <div className="stat-card border-l-4 border-red-400">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('diseaseAlert')}</div>
          <div className="text-base font-display font-bold text-red-600">Leaf Blight</div>
          <div className="text-xs text-forest-400 mt-1">{t('severity')}: {t('medium')} 22%</div>
        </div>
        <div className="stat-card border-l-4 border-forest-300">
          <div className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-2">{t('estimatedYieldLoss')}</div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={18} className="text-red-400" />
            <span className="text-lg font-display font-bold text-forest-800">14%</span>
          </div>
          <div className="text-xs text-forest-400 mt-1">Financial impact: ~₹4,200</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <button key={a.path} onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-2.5 bg-white hover:bg-forest-50 border border-forest-100 hover:border-forest-300 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group">
            <div className={`w-11 h-11 ${a.color} rounded-xl flex items-center justify-center text-xl shadow-sm`}>
              {a.icon}
            </div>
            <span className="text-xs font-semibold text-forest-600 group-hover:text-forest-800 text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
     {/* Farm Summary Cards */}
<div className="lg:col-span-2">
  <FarmSummaryCards />
</div>

        {/* Risk gauge */}
        <div className="card flex flex-col">
          <h3 className="font-semibold text-forest-800 flex items-center gap-2 mb-4">
            <AlertTriangle size={17} className="text-earth-500" /> {t('riskOverview')}
          </h3>
          <div className="flex justify-center mb-4">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={riskData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f0faf4' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="font-display font-bold text-earth-600 text-xl">58</span>
                <span className="text-forest-500 text-xs">/ 100</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            {[
              [t('rainfallDeviation'), '+12%', 'bm'],
              [t('temperature'), t('optimal'), 'bl'],
              [t('marketTrend'), 'Neutral', 'bm'],
              [t('pestPressure'), t('medium'), 'bm']
            ].map(([k,v,c]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span className="text-forest-500">{k}</span>
                <span className={c === 'bl' ? 'badge-low' : 'badge-medium'}>{v}</span>
              </div>
            ))}
          </div>
        </div>``
      </div>

<div className="min-h-screen bg-[#f0f9f4] p-6 space-y-8">

  {/* What Should I Do Today Section */}
  <WhatShouldIDoToday />

  {/* Weather Forecast Section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <WeatherForecastCard />
  </div>

</div>
      {/* Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-800">Recent Alerts & Insights</h3>
          <button onClick={() => navigate('/app/insights')} className="text-forest-500 hover:text-forest-700 text-xs font-semibold flex items-center gap-1">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {recentAlerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
              a.type === 'danger'  ? 'bg-red-50 border-red-100' :
              a.type === 'warning' ? 'bg-earth-50 border-earth-100' :
              'bg-forest-50 border-forest-100'
            }`}>
              <span className="text-xl mt-0.5 shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-forest-800">{a.title}</div>
                <div className="text-forest-500 text-xs mt-0.5">{a.desc}</div>
              </div>
              <span className="text-xs text-forest-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
