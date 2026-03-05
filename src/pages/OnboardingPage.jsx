import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { ArrowRight, Check } from 'lucide-react'

const STEPS = [
  {
    id: 'landType', title: 'What type of land do you farm?',
    hint: 'Select your primary land type to get tailored recommendations',
    options: [
      { value: 'clay',     icon: '🟫', label: 'Clay Soil' },
      { value: 'sandy',    icon: '🟡', label: 'Sandy Soil' },
      { value: 'loamy',    icon: '🟤', label: 'Loamy Soil' },
      { value: 'black',    icon: '⚫', label: 'Black Soil' },
      { value: 'laterite', icon: '🔴', label: 'Red Laterite' },
      { value: 'alluvial', icon: '💧', label: 'Alluvial' },
    ]
  },
  {
    id: 'state', title: 'Which state are you farming in?',
    hint: 'Location helps us factor in regional climate and market data',
    type: 'select',
    options: ['Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','Karnataka','Andhra Pradesh','Tamil Nadu','Kerala','West Bengal','Bihar','Odisha','Assam','Jharkhand','Chhattisgarh','Telangana']
  },
  {
    id: 'requirement', title: 'What are you looking for?',
    hint: "Choose your primary goal — we'll personalise your dashboard",
    options: [
      { value: 'crop',    icon: '🌱', label: 'Best Crop to Grow' },
      { value: 'disease', icon: '🦠', label: 'Disease Check' },
      { value: 'profit',  icon: '💰', label: 'Profit Maximisation' },
      { value: 'risk',    icon: '⛈️', label: 'Risk Assessment' },
      { value: 'report',  icon: '📄', label: 'Health Report' },
      { value: 'full',    icon: '🔬', label: 'Full Analysis' },
    ]
  },
  {
    id: 'farmSize', title: 'What is your farm size?',
    hint: 'This helps estimate yield loss and financial impact accurately',
    options: [
      { value: 'tiny',   icon: '🏠', label: '< 1 Acre' },
      { value: 'small',  icon: '🌿', label: '1–5 Acres' },
      { value: 'medium', icon: '🌾', label: '5–20 Acres' },
      { value: 'large',  icon: '🚜', label: '> 20 Acres' },
    ]
  }
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { updateOnboarding, saveOnboarding, user } = useAppStore()
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({ landType: '', state: '', requirement: '', farmSize: '' })
  const [animating, setAnimating] = useState(false)

  const current = STEPS[step]
  const progress = ((step) / STEPS.length) * 100

  const select = (val) => setSelections(s => ({ ...s, [current.id]: val }))

  const next = async () => {
    if (!selections[current.id]) return
    if (step < STEPS.length - 1) {
      setAnimating(true)
      setTimeout(() => { setStep(s => s+1); setAnimating(false) }, 200)
    } else {
      updateOnboarding(selections)
      if (user) {
        try {
          await saveOnboarding(selections)
        } catch (err) {
          console.error('failed to save onboarding data', err)
        }
      }
      navigate('/app/home')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-800 via-forest-700 to-forest-600 flex items-center justify-center px-4 py-12 font-body">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-forest-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-forest-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🌾</div>
          <div className="font-display text-white text-2xl font-bold">Set up your farm profile</div>
          <div className="text-forest-300 text-sm mt-1">Step {step + 1} of {STEPS.length}</div>
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-forest-900/40 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-forest-400 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Step breadcrumbs */}
        <div className="flex justify-between mb-6 px-1">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-xs font-medium transition-all ${i < step ? 'text-forest-300' : i === step ? 'text-white' : 'text-forest-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                i < step ? 'bg-forest-400 border-forest-400 text-white' :
                i === step ? 'bg-white border-white text-forest-700' :
                'bg-transparent border-forest-600 text-forest-600'
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="hidden sm:block">{i === 0 ? 'Land' : i === 1 ? 'State' : i === 2 ? 'Goal' : 'Size'}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className={`bg-white rounded-3xl p-8 shadow-2xl transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <h2 className="font-display text-xl font-bold text-forest-800 mb-1">{current.title}</h2>
          <p className="text-forest-500 text-sm mb-6">{current.hint}</p>

          {current.type === 'select' ? (
            <select
              className="input-field mb-6 text-sm"
              value={selections[current.id]}
              onChange={e => select(e.target.value)}>
              <option value="">-- Select State --</option>
              {current.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {current.options.map(opt => (
                <button key={opt.value}
                  onClick={() => select(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 text-center ${
                    selections[current.id] === opt.value
                      ? 'border-forest-500 bg-forest-50 shadow-sm'
                      : 'border-forest-100 hover:border-forest-300 bg-white'
                  }`}>
                  <span className="text-2xl">{opt.icon}</span>
                  <span className={`text-xs font-semibold leading-tight ${selections[current.id] === opt.value ? 'text-forest-700' : 'text-forest-500'}`}>
                    {opt.label}
                  </span>
                  {selections[current.id] === opt.value && (
                    <div className="w-4 h-4 bg-forest-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <button onClick={next}
            disabled={!selections[current.id]}
            className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-md hover:shadow-lg">
            {step === STEPS.length - 1 ? 'Go to Dashboard 🚀' : 'Continue'}
            {step < STEPS.length - 1 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
