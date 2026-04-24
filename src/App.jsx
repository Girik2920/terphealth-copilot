import { useMemo, useState } from 'react'
import {
  Activity,
  Brain,
  Building2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  WalletCards,
} from 'lucide-react'

const sampleInsuranceText = `UMD Student Health Insurance Plan sample summary:
Primary care visit: low copay
Specialist visit: higher copay
Urgent care: moderate copay
Emergency room: high copay / coinsurance
Mental health outpatient visit: covered with copay
Preventive care: usually covered
Prescriptions: tiered copay
In-network care is cheaper than out-of-network care`

const demoScenarios = [
  'I have a sore throat',
  'I feel burned out',
  'I twisted my ankle',
  'I got a medical bill',
  "I need therapy but I'm worried about cost",
]

const dashboardCards = [
  ['Insurance Decoder', 'Turn SHIP documents into plain-English costs and next steps.', FileText, 'insurance', 'bg-sky-100 text-sky-700'],
  ['Smart Care Navigator', 'Find the cheapest, closest, fastest, best-fit care option.', Stethoscope, 'navigator', 'bg-emerald-100 text-emerald-700'],
  ['Mental Health & Wellness Hub', 'Campus counseling, burnout support, crisis help, and wellness.', Brain, 'wellness', 'bg-violet-100 text-violet-700'],
  ['Nearby Low-Cost Care', 'Mock College Park resources ranked by cost and fit.', MapPin, 'nearby', 'bg-rose-100 text-rose-700'],
]

const resources = [
  ['UMD Health Center', 'Campus clinic', 'Low or free', 'Primary care, illness, prescriptions, vaccines, basic labs', 'Best first stop when symptoms are not an emergency and campus is open.'],
  ['UMD Counseling Center', 'Mental health', 'Often free or low cost', 'Stress, anxiety, burnout, academic pressure, short-term counseling', 'Ask about individual counseling, groups, workshops, and same-day support.'],
  ['Nearby College Park Urgent Care', 'Urgent care', 'Moderate copay', 'After-hours illness, minor injuries, ankle sprains, sore throat', 'Confirm in-network status and copay before booking when possible.'],
  ['Community Free Clinic', 'Free or sliding-scale clinic', 'Low or free', 'Basic care when cost is the main barrier or insurance is confusing', 'May have limited hours and appointment availability.'],
  ['Hospital Emergency Department', 'ER / hospital', 'High copay or coinsurance', 'Chest pain, trouble breathing, severe bleeding, fainting, stroke symptoms, suicidal intent', 'Use for emergencies. Call 911 if immediate help is needed.'],
]

const wellnessResources = [
  'UMD Counseling Center',
  'Behavioral Health Services',
  'Wellness workshops',
  'Stress and burnout support',
  'Crisis support',
  'Peer/community support',
  'International student support',
]

const benefitCards = [
  ['Preventive checkups', 'Often covered before you feel sick.'],
  ['Vaccines', 'Ask about flu, COVID, travel, and routine immunizations.'],
  ['Mental health counseling', 'Covered visits or campus options may reduce cost.'],
  ['Telehealth', 'Good for quick questions, refills, and low-acuity care.'],
  ['Prescription discounts', 'Tiered copays and generic medications can lower bills.'],
  ['Annual screenings', 'Preventive labs and screenings may be included.'],
  ['Campus wellness programs', 'Workshops, coaching, and group support can be free.'],
]

const costRows = [
  ['UMD Health Center', '$0-low', 'Best first stop for non-emergency student care.'],
  ['Urgent Care', '$$ moderate copay', 'Good after hours for minor illness or injury.'],
  ['Emergency Room', '$$$ high', 'Use only for emergencies or severe symptoms.'],
  ['Free/community clinic', '$0-low', 'Helpful when cost or insurance access is a barrier.'],
]

function App() {
  const [activeTab, setActiveTab] = useState('navigator')
  const [concern, setConcern] = useState('')
  const [insuranceText, setInsuranceText] = useState(sampleInsuranceText)
  const [aiResponse, setAiResponse] = useState('')
  const [aiMode, setAiMode] = useState('mock-ready')
  const [loading, setLoading] = useState(false)

  const currentPrompt = useMemo(() => {
    if (activeTab === 'insurance') return insuranceText
    if (activeTab === 'benefits') return 'Find hidden benefits in the UMD SHIP-like plan.'
    return concern
  }, [activeTab, concern, insuranceText])

  async function askCopilot(mode, overridePrompt) {
    const prompt = overridePrompt ?? currentPrompt
    if (!prompt.trim()) return
    setLoading(true)
    setAiResponse('')
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, prompt, insuranceText }),
      })
      const data = await response.json()
      setAiResponse(data.answer)
      setAiMode(data.mode)
    } catch {
      setAiMode('offline-mock')
      setAiResponse('1. Best option\nUMD Health Center is the best starting point for non-emergency symptoms.\n\n2. Why\nThe local demo backend is not reachable, so this is an offline fallback response.\n\n3. Estimated cost\nUsually low or free for many student services.\n\n4. Backup options\nUse urgent care for after-hours needs. Use the ER or call 911 for emergencies.\n\n5. Questions to ask before booking\nAsk whether the visit is in-network, what the copay is, and whether labs or prescriptions cost extra.\n\n6. Safety disclaimer\nThis app is not medical advice. For emergencies call 911 or go to the ER.')
    } finally {
      setLoading(false)
    }
  }

  function runScenario(text) {
    setActiveTab('navigator')
    setConcern(text)
    askCopilot('navigator', text)
  }

  return (
    <main className="min-h-screen bg-[#f6fbfc]">
      <Hero onScenario={runScenario} />
      <section className="mx-auto -mt-10 grid w-[min(1180px,calc(100%-32px))] gap-4 md:grid-cols-4">
        {dashboardCards.map(([title, description, Icon, tab, accent]) => (
          <button key={title} onClick={() => setActiveTab(tab)} className="group rounded-lg border border-slate-200 bg-white p-5 text-left shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:border-teal-300">
            <span className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ${accent}`}>
              <Icon size={23} />
            </span>
            <h3 className="text-base font-bold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-teal-700">
              Open <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 py-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'navigator' && <NavigatorPanel concern={concern} setConcern={setConcern} loading={loading} onSubmit={() => askCopilot('navigator')} onScenario={runScenario} />}
          {activeTab === 'insurance' && <InsurancePanel insuranceText={insuranceText} setInsuranceText={setInsuranceText} loading={loading} onSubmit={() => askCopilot('insurance')} />}
          {activeTab === 'wellness' && <WellnessPanel />}
          {activeTab === 'nearby' && <NearbyPanel />}
          {activeTab === 'benefits' && <BenefitsPanel loading={loading} onSubmit={() => askCopilot('benefits')} />}
        </div>
        <CopilotPanel loading={loading} aiResponse={aiResponse} aiMode={aiMode} />
      </section>
    </main>
  )
}

function Hero({ onScenario }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <img src="/images/terphealth-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,30,45,.94),rgba(8,30,45,.76)_42%,rgba(8,30,45,.22))]" />
      <div className="relative mx-auto min-h-[560px] w-[min(1180px,calc(100%-32px))] py-8">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/20"><HeartPulse size={24} /></span>
            <div>
              <p className="text-lg font-black tracking-wide">TerpHealth Copilot</p>
              <p className="text-xs text-teal-100">Student healthcare navigation MVP</p>
            </div>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-teal-50 backdrop-blur">
            This app is not medical advice. For emergencies call 911 or go to the ER.
          </div>
        </nav>
        <div className="mt-20 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/30 bg-teal-100/15 px-4 py-2 text-sm font-semibold text-teal-50"><Sparkles size={16} /> TurboTax + Google Maps for student healthcare</div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white sm:text-6xl">Understand care, coverage, and cost before you book.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-100">A campus-ready AI navigator for UMD students, international students, and anyone trying to decode SHIP benefits, find care, and avoid surprise bills.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {demoScenarios.map((scenario) => (
              <button key={scenario} onClick={() => onScenario(scenario)} className="rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/22">{scenario}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [['navigator', 'Navigator'], ['insurance', 'Insurance'], ['wellness', 'Wellness'], ['nearby', 'Nearby Care'], ['benefits', 'Hidden Benefits']]
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-slate-100 p-1">
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setActiveTab(id)} className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition ${activeTab === id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}>{label}</button>
      ))}
    </div>
  )
}

function NavigatorPanel({ concern, setConcern, loading, onSubmit, onScenario }) {
  return (
    <div>
      <PanelHeader icon={Stethoscope} title="Smart Care Navigator" text="Describe what is going on. The copilot ranks options by cheapest, closest, fastest, and best fit." />
      <textarea value={concern} onChange={(event) => setConcern(event.target.value)} placeholder="Example: I have a sore throat and I am not sure if I should go to the health center or urgent care." className="mt-5 min-h-36 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100" />
      <div className="mt-4 flex flex-wrap gap-2">
        {demoScenarios.map((scenario) => <button key={scenario} onClick={() => onScenario(scenario)} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-100 hover:text-teal-800">{scenario}</button>)}
      </div>
      <PrimaryButton loading={loading} onClick={onSubmit} label="Get care recommendation" />
      <CostEstimator />
    </div>
  )
}

function InsurancePanel({ insuranceText, setInsuranceText, loading, onSubmit }) {
  return (
    <div>
      <PanelHeader icon={ShieldCheck} title="Insurance Upload / Decoder" text="Paste insurance text or use the included UMD SHIP-like sample. PDF upload is shown for MVP demo flow." />
      <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-teal-300 bg-teal-50 p-4 text-sm text-teal-900">
        <span className="flex items-center gap-3"><ClipboardCheck size={20} /> Optional PDF upload UI for demo</span>
        <input type="file" accept="application/pdf" className="max-w-48 text-xs" />
      </label>
      <textarea value={insuranceText} onChange={(event) => setInsuranceText(event.target.value)} className="mt-4 min-h-64 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100" />
      <PrimaryButton loading={loading} onClick={onSubmit} label="Decode insurance in plain English" />
    </div>
  )
}

function WellnessPanel() {
  return (
    <div>
      <PanelHeader icon={Brain} title="Mental Health & Wellness Hub" text="A quick campus-style map for support before stress becomes a crisis." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {wellnessResources.map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Brain size={18} /></div>
            <h3 className="font-bold text-slate-950">{item}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Ask about appointments, groups, workshops, crisis response, and low-cost care paths.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function NearbyPanel() {
  return (
    <div>
      <PanelHeader icon={Building2} title="Nearby Low-Cost Care" text="Mock College Park and Maryland resources for a hackathon-ready local demo." />
      <div className="mt-5 space-y-3">
        {resources.map(([name, type, cost, when, notes]) => (
          <div key={name} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-black text-slate-950">{name}</h3><p className="mt-1 text-sm font-semibold text-teal-700">{type}</p></div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{cost}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700"><strong>When to use:</strong> {when}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function BenefitsPanel({ loading, onSubmit }) {
  return (
    <div>
      <PanelHeader icon={WalletCards} title="Hidden Benefits Finder" text="Benefits students may already have but often miss in the plan summary." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {benefitCards.map(([title, text]) => <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
      </div>
      <PrimaryButton loading={loading} onClick={onSubmit} label="Ask AI to find hidden benefits" />
    </div>
  )
}

function CostEstimator() {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center gap-2"><Activity size={19} className="text-teal-700" /><h3 className="font-black text-slate-950">Cost estimator</h3></div>
      <div className="grid gap-3">
        {costRows.map(([place, cost, note]) => <div key={place} className="grid gap-2 rounded-lg bg-white p-3 sm:grid-cols-[150px_130px_1fr]"><strong className="text-slate-950">{place}</strong><span className="font-bold text-teal-700">{cost}</span><span className="text-sm text-slate-600">{note}</span></div>)}
      </div>
    </div>
  )
}

function CopilotPanel({ loading, aiResponse, aiMode }) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-semibold text-teal-200">AI navigator response</p><h2 className="mt-1 text-2xl font-black">Care plan preview</h2></div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-100">{aiMode.includes('claude') ? 'Claude API' : 'Demo mock'}</span>
      </div>
      <div className="mt-5 min-h-[560px] rounded-lg border border-white/10 bg-white/[0.06] p-4">
        {loading && <div className="flex h-80 flex-col items-center justify-center text-center text-teal-50"><Loader2 className="mb-4 animate-spin" size={34} /><p className="font-bold">Ranking care options and translating insurance jargon...</p><p className="mt-2 max-w-sm text-sm text-slate-300">Cheapest, closest, fastest, and best fit are being weighed for a student-friendly answer.</p></div>}
        {!loading && aiResponse && <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-100">{aiResponse}</pre>}
        {!loading && !aiResponse && <div className="space-y-4 text-sm leading-7 text-slate-200"><p>Start with a sample scenario, paste an insurance summary, or ask the hidden benefits finder. The response will appear here in a judge-friendly format.</p><div className="rounded-lg bg-white/8 p-4"><p className="font-bold text-white">Example format</p><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Best option</li><li>Why</li><li>Estimated cost</li><li>Backup options</li><li>Questions to ask before booking</li><li>Safety disclaimer</li></ol></div><p className="text-teal-100">This app is not medical advice. For emergencies call 911 or go to the ER.</p></div>}
      </div>
    </aside>
  )
}

function PanelHeader({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700"><Icon size={24} /></span>
      <div><h2 className="text-2xl font-black text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>
    </div>
  )
}

function PrimaryButton({ loading, onClick, label }) {
  return (
    <button onClick={onClick} disabled={loading} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70">
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
      {label}
    </button>
  )
}

export default App
