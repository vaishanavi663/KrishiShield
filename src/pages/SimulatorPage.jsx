import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { FlaskConical, TrendingDown, TrendingUp } from 'lucide-react'
import { api } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'

function calcRisk(rain, price, sev, tempDev) {
  let score = 0
  if (rain < 100 || rain > 400) score += 2; else if (rain < 150 || rain > 300) score += 1
  if (sev > 30) score += 2; else if (sev > 15) score += 1
  if (Math.abs(tempDev) > 5) score += 2; else if (Math.abs(tempDev) > 2) score += 1
  if (price < 1000) score += 1
  return score
}

function buildProjection(rain, price, sev) {
  return ['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => {
    const decay = sev / 100 * (0.6 + i * 0.04)
    const rainBonus = (rain - 150) / 500 * 0.2
    const base = 55 * (1 - decay + rainBonus)
    return { month: m, yield: Math.max(10, Math.round(base * 10) / 10), revenue: Math.round(base * price / 10) }
  })
}

export default function SimulatorPage() {
  const { t } = useTranslation()
  const [rain,    setRain]    = useState(210)
  const [price,   setPrice]   = useState(1850)
  const [sev,     setSev]     = useState(22)
  const [tempDev, setTempDev] = useState(2)
  const [results, setResults] = useState(null)

  useEffect(() => {
    api.simulate({ rain, price, sev, tempDev })
      .then(data => setResults(data))
      .catch(console.error);
  }, [rain, price, sev, tempDev])

  const projection = buildProjection(rain, price, sev)
  const riskColor  = results?.riskLabel === 'High' ? 'text-red-600' : results?.riskLabel === 'Medium' ? 'text-earth-600' : 'text-forest-600'
  const riskBadge  = results?.riskLabel === 'High' ? 'badge-high' : results?.riskLabel === 'Medium' ? 'badge-medium' : 'badge-low'

  const SliderInput = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-forest-700">{label}</label>
        <span className="font-mono font-bold text-forest-800 text-sm bg-forest-100 px-2 py-0.5 rounded-lg">
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-2 bg-forest-200 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-forest-500 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
      <div className="flex justify-between text-xs text-forest-400">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <FlaskConical className="text-forest-500" /> {t('What-If Risk Simulator')}
        </h1>
        <p className="text-forest-500 text-sm mt-1">{t('Adjust parameters to simulate risk scenarios and plan ahead')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Sliders */}
        <div className="card space-y-6">
          <h3 className="font-semibold text-forest-800 pb-3 border-b border-forest-100">{t('⚙️ Adjust Parameters')}</h3>
          <SliderInput label="🌧️ Rainfall (mm)" value={rain}    onChange={setRain}    min={50}  max={500} unit=" mm" />
          <SliderInput label="💰 Market Price (₹/q)" value={price} onChange={setPrice} min={500} max={5000} unit=" ₹" />
          <SliderInput label="🦠 Disease Severity (%)" value={sev}  onChange={setSev}   min={0}   max={100} unit="%" />
          <SliderInput label="🌡️ Temp Deviation (°C)" value={tempDev} onChange={setTempDev} min={-10} max={10} step={1} unit="°C" />
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className={`card border ${results.riskLabel === 'High' ? 'border-red-200 bg-red-50' : results.riskLabel === 'Medium' ? 'border-earth-200 bg-earth-50' : 'border-forest-200 bg-forest-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-forest-800">{t('📊 Simulation Results')}</h3>
                <span className={riskBadge}>{results.riskLabel} Risk</span>
              </div>
              <div className="space-y-3">
                {[
                  [t('Risk Score'),         `${results.riskScore}/8`,              riskColor],
                  [t('Yield Impact'),       `-${results.yieldLoss}%`,              'text-red-600'],
                  [t('Actual Yield'),       `${results.yieldAmt} q/acre`,          'text-forest-700'],
                  [t('Profit Projection'),  `₹${results.profit.toLocaleString('en-IN')}`, 'text-forest-700'],
                  [t('Irrigation Needed'),  results.irr,                           'text-forest-700'],
                  [t('Fertiliser Adj.'),    results.fertAdj,                       'text-forest-700'],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/60 last:border-0 text-sm">
                    <span className="text-forest-500">{t(k)}</span>
                    <span className={`font-bold ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div className="bg-white border border-forest-200 rounded-2xl p-4 text-sm text-forest-600">
              💡 {results.riskLabel === 'High'
                ? t('🚨 High risk detected! Consider drought-resistant varieties and immediate pest management.')
                : results.riskLabel === 'Medium'
                ? t('⚠️ Moderate risk. Monitor rainfall closely and prepare irrigation backup.')
                : t('✅ Favourable conditions. Proceed with planned crop cycle and maintain current practices.')}
            </div>
          </div>
        )}
      </div>

      {/* Projection chart */}
      <div className="card">
        <h3 className="font-semibold text-forest-800 mb-4">{t('📈 6-Month Yield Projection')}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={projection} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0faf4" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v, n) => [n === 'yield' ? `${v} q` : `₹${v}`, n === 'yield' ? 'Yield' : 'Revenue (K)']} />
            <ReferenceLine y={55} stroke="#b7e4c7" strokeDasharray="4 2" label={{ value: 'Target', fill: '#74c69d', fontSize: 11 }} />
            <Line type="monotone" dataKey="yield" stroke="#52b788" strokeWidth={2.5} dot={{ r: 4, fill: '#52b788' }} name="yield" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
