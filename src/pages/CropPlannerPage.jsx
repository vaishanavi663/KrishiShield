import { useState } from 'react'
import { useAppStore, api } from '../store/useAppStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Sprout, Loader2, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const confData = (recs) => recs.map(r => ({ name: r.name, confidence: r.confidence }))

export default function CropPlannerPage() {
  const { setCropRecommendation, cropRecommendation } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
  nitrogen: 82, phosphorous: 47, potassium: 43, ph: 6.5,
  temperature: 27, humidity: 62, rainfall: 210, season: 'Kharif',
  farmSize: '', soilType: 'Loamy', irrigation: 'Rainfed', previousCrop: ''
})

  const { t } = useTranslation()
  const set = (k, v) => setForm(s => ({ ...s, [k]: v }))

  const analyze = async () => {
    setLoading(true)
    try {
      const result = await api.analyzeCrop(form)
      setCropRecommendation(result)

      // build extended output based on form and recommendation
      const top = result.recommendations?.[0] || { name: 'Unknown', confidence: 0 }
      const alternatives = (result.recommendations || []).slice(1,3).map(r=>r.name)
      const reason = `Based on soil (N${form.nitrogen},P${form.phosphorous},K${form.potassium}), weather and ${form.season} season.`

      // dummy profit calc
      const yieldPerAcre = 20 + Math.random()*10 // quintals
      const pricePerQuintal = 2000 + Math.random()*500
      const revenue = yieldPerAcre * pricePerQuintal
      const cost = 10000 + Math.random()*5000
      const profitPerAcre = revenue - cost

      const riskLevel = ['Low','Medium','High'][Math.floor(Math.random()*3)]
      const riskReason = riskLevel === 'High' ? 'Low rainfall expected' : riskLevel === 'Medium' ? 'Temperature swings' : 'Conditions normal'

      const sowingWindow = form.season === 'Kharif' ? 'June – July' : form.season === 'Rabi' ? 'October – November' : 'March – April'
      const fertilizerPlan = { day0: 'NPK 20-20-20 50kg', day20: 'Urea 50kg', day40: 'DAP 30kg' }
      const water = { total: '500 mm', frequency: 'Once a week' }
      const seedVarieties = [top.name + ' Hybrid', top.name + ' Local']
      const rotationAdvice = form.previousCrop ? `After ${form.previousCrop}, consider legumes like soybean or chickpea.` : 'Rotate with legumes to replenish nitrogen.'
      const market = { price: `${pricePerQuintal.toFixed(0)} ₹/qtl`, trend: ['Rising','Stable','Falling'][Math.floor(Math.random()*3)] }
      const smartInsights = [
        'Ensure irrigation before flowering stage.',
        'Monitor for pests weekly.',
        'Adjust fertilizer if pH is high.'
      ]

      setExtra({
        farm: {
          size: form.farmSize,
          soilType: form.soilType,
          irrigation: form.irrigation,
          previousCrop: form.previousCrop
        },
        recommendation: { top: top.name, alternatives, confidence: top.confidence, reason },
        profit: { yieldPerAcre: yieldPerAcre.toFixed(1), pricePerQuintal: pricePerQuintal.toFixed(0), revenue: revenue.toFixed(0), cost: cost.toFixed(0), profitPerAcre: profitPerAcre.toFixed(0) },
        risk: { level: riskLevel, reason: riskReason },
        sowingWindow,
        fertilizerPlan,
        water,
        seedVarieties,
        rotationAdvice,
        market,
        smartInsights
      })
    } finally {
      setLoading(false)
    }
  }

  const recs = cropRecommendation?.recommendations || []
  const riskColors = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' }
  const riskIcons  = { low: '🟢', medium: '🟡', high: '🔴' }

  const [extra, setExtra] = useState(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-800 flex items-center gap-2">
          <Sprout className="text-forest-500" /> {t('Smart Crop Recommendation Engine')}
        </h1>
        <p className="text-forest-500 text-sm mt-1">{t('Enter your soil & weather data to get AI-powered crop recommendations')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Soil Parameters */}
        <div className="card">
          <h3 className="font-semibold text-forest-800 mb-4 pb-3 border-b border-forest-100">{t('🧪 Soil Parameters')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['nitrogen',     'Nitrogen (N) kg/ha', 0, 300],
              ['phosphorous',  'Phosphorous (P) kg/ha', 0, 150],
              ['potassium',    'Potassium (K) kg/ha', 0, 150],
              ['ph',           'pH Level', 0, 14, 0.1],
            ].map(([k, label, min, max, step = 1]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{label}</label>
                <input type="number" className="input-field text-sm" min={min} max={max} step={step}
                  value={form[k]} onChange={e => set(k, +e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Weather Parameters */}
        <div className="card">
          <h3 className="font-semibold text-forest-800 mb-4 pb-3 border-b border-forest-100">{t('🌤️ Weather Parameters')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['temperature', 'Temperature (°C)', -10, 60],
              ['humidity',    'Humidity (%)', 0, 100],
              ['rainfall',    'Rainfall (mm)', 0, 1000],
            ].map(([k, label, min, max]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t(label)}</label>
                <input type="number" className="input-field text-sm" min={min} max={max}
                  value={form[k]} onChange={e => set(k, +e.target.value)} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('Season')}</label>
              <select className="input-field text-sm" value={form.season} onChange={e => set('season', e.target.value)}>
                {['Kharif','Rabi','Zaid'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Farm Context Inputs */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('Farm Size (acres)')}</label>
              <input type="number" className="input-field text-sm" min={0} value={form.farmSize}
                onChange={e => set('farmSize', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('Soil Type')}</label>
              <select className="input-field text-sm" value={form.soilType}
                onChange={e => set('soilType', e.target.value)}>
                {['Sandy','Loamy','Clay','Silty'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('Irrigation')}</label>
              <select className="input-field text-sm" value={form.irrigation}
                onChange={e => set('irrigation', e.target.value)}>
                {['Rainfed','Borewell','Canal','Drip'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-600 uppercase tracking-wider mb-1.5">{t('Previous Crop')}</label>
              <input type="text" className="input-field text-sm" value={form.previousCrop}
                onChange={e => set('previousCrop', e.target.value)} />
            </div>
          </div>
          <button onClick={analyze} disabled={loading}
            className="mt-4 btn-primary w-full flex items-center justify-center gap-2 text-sm">
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> {t('Analyzing with AI...')}</>
              : t('🔍 Analyze & Recommend')
            }
          </button>
        </div>
      </div>

      {/* Results */}
      {recs.length > 0 && (
        <div className="space-y-5 animate-fade-up">
          <h3 className="font-display text-xl font-bold text-forest-800">{t('🎯 Top Crop Recommendations')}</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {recs.map((r, i) => (
              <div key={i} className={`card relative overflow-hidden hover:-translate-y-1 transition-all ${i === 0 ? 'ring-2 ring-forest-400 shadow-md' : ''}`}>
                {i === 0 && (
                  <div className="absolute top-0 right-0 bg-forest-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    {t('Best Match')}
                  </div>
                )}
                <div className="text-3xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <div className="font-display font-bold text-forest-800 text-xl mb-1">{r.name}</div>
                <div className="text-forest-500 text-sm mb-3">Confidence: <span className="font-bold text-forest-700">{r.confidence}%</span></div>

                {/* Confidence bar */}
                <div className="h-2 bg-forest-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-forest-500 rounded-full transition-all duration-700"
                    style={{ width: `${r.confidence}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={riskColors[r.risk]}>{riskIcons[r.risk]} {t(r.risk.charAt(0).toUpperCase() + r.risk.slice(1) + ' Risk')}</span>
                  <span className="text-xs text-forest-500 font-medium">{r.roi}/acre</span>
                </div>
              </div>
            ))}
          </div>

          {/* Confidence Chart */}
          <div className="card">
            <h4 className="font-semibold text-forest-800 mb-4">📊 Confidence Comparison</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={confData(recs)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0faf4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Confidence']} />
                <Bar dataKey="confidence" fill="#52b788" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insight */}
          {cropRecommendation?.insight && (
            <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <div className="font-semibold text-forest-800 text-sm mb-0.5">Smart Insight</div>
                <div className="text-forest-600 text-sm">{cropRecommendation.insight}</div>
              </div>
            </div>
          )}

          {/* Extended farmer information */}
          {extra && (
            <div className="space-y-6">
              {/* Farm context summary */}
              <div className="card">
                <h4 className="font-semibold text-forest-800 mb-2">Farm Context</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-forest-600">
                  <div><strong>Size:</strong> {extra.farm.size || '-'} acres</div>
                  <div><strong>Soil:</strong> {extra.farm.soilType}</div>
                  <div><strong>Irrigation:</strong> {extra.farm.irrigation}</div>
                  <div><strong>Previous crop:</strong> {extra.farm.previousCrop || 'None'}</div>
                </div>
              </div>

              {/* Crop recommendation details */}
              <div className="card">
                <h4 className="font-semibold text-forest-800 mb-2">Recommendation Details</h4>
                <div className="text-sm text-forest-600">
                  <div><strong>Top crop:</strong> {extra.recommendation.top} ({extra.recommendation.confidence}%)</div>
                  <div><strong>Alternatives:</strong> {extra.recommendation.alternatives.join(', ') || '-'}</div>
                  <div><strong>Reason:</strong> {extra.recommendation.reason}</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {/* Profit estimation */}
                <div className="card">
                  <h4 className="font-semibold text-forest-800 mb-2">Profit Estimation</h4>
                  <div className="text-sm text-forest-600 space-y-1">
                    <div>Yield/acre: {extra.profit.yieldPerAcre} qtl</div>
                    <div>Price/qtl: {extra.profit.pricePerQuintal} ₹</div>
                    <div>Revenue: {extra.profit.revenue} ₹</div>
                    <div>Cost: {extra.profit.cost} ₹</div>
                    <div className="font-semibold">Profit/acre: {extra.profit.profitPerAcre} ₹</div>
                  </div>
                </div>

                {/* Risk & sowing & fertilizer & water */}
                <div className="space-y-4">
                  <div className="card">
                    <h4 className="font-semibold text-forest-800 mb-2">Risk Level</h4>
                    <div className="text-sm text-forest-600">
                      <span className={riskColors[extra.risk.level.toLowerCase()]}>• {extra.risk.level}</span>
                      <div>{extra.risk.reason}</div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="font-semibold text-forest-800 mb-2">Sowing Window</h4>
                    <div className="text-sm text-forest-600">{extra.sowingWindow}</div>
                  </div>

                  <div className="card">
                    <h4 className="font-semibold text-forest-800 mb-2">Fertilizer Plan</h4>
                    <div className="text-sm text-forest-600">
                      <div>Day 0: {extra.fertilizerPlan.day0}</div>
                      <div>Day 20: {extra.fertilizerPlan.day20}</div>
                      <div>Day 40: {extra.fertilizerPlan.day40}</div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="font-semibold text-forest-800 mb-2">Water Requirement</h4>
                    <div className="text-sm text-forest-600">
                      <div>Total: {extra.water.total}</div>
                      <div>Frequency: {extra.water.frequency}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional advice and market */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="card">
                  <h4 className="font-semibold text-forest-800 mb-2">Seed Varieties</h4>
                  <div className="text-sm text-forest-600">{extra.seedVarieties.join(', ')}</div>
                </div>
                <div className="card">
                  <h4 className="font-semibold text-forest-800 mb-2">Rotation Advice</h4>
                  <div className="text-sm text-forest-600">{extra.rotationAdvice}</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="card">
                  <h4 className="font-semibold text-forest-800 mb-2">Market Price</h4>
                  <div className="text-sm text-forest-600">
                    <div>Avg price: {extra.market.price}</div>
                    <div>Trend: {extra.market.trend}</div>
                  </div>
                </div>
                <div className="card">
                  <h4 className="font-semibold text-forest-800 mb-2">Smart Insights</h4>
                  <ul className="list-disc pl-5 text-sm text-forest-600">
                    {extra.smartInsights.map((i,idx)=><li key={idx}>{i}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
