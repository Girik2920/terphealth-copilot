import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  HeartPulse,
  Loader2,
  MapPin,
  MessageSquareText,
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
  ['Insurance Decoder', 'Plain-English costs, copays, prescriptions, and network rules.', FileText, 'insurance', 'bg-sky-50 text-sky-700 ring-sky-100'],
  ['Smart Care Navigator', 'Rank care options by cost, fit, speed, and student context.', Stethoscope, 'navigator', 'bg-emerald-50 text-emerald-700 ring-emerald-100'],
  ['Mental Health Hub', 'Counseling, crisis support, burnout help, and workshops.', Brain, 'wellness', 'bg-violet-50 text-violet-700 ring-violet-100'],
  ['Nearby Low-Cost Care', 'Campus, urgent care, free clinic, and ER guidance.', MapPin, 'nearby', 'bg-red-50 text-red-700 ring-red-100'],
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
    <main className="min-h-screen bg-[#f4f8f9] text-slate-950">
      <Header />
      <Hero onScenario={runScenario} />
      <section className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-3 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map(([title, description, Icon, tab, accent]) => (
          <button
            key={title}
            onClick={() => setActiveTab(tab)}
            className={`group flex min-h-[158px] flex-col justify-between rounded-lg border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
              activeTab === tab ? 'border-teal-500 ring-2 ring-teal-100' : 'border-slate-200'
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${accent}`}>
              <Icon size={22} />
            </span>
            <div>
              <h3 className="text-base font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          </button>
        ))}
      </section>

      <section className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-6 pb-12 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-[min(1160px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
            <HeartPulse size={22} />
          </span>
          <div>
            <p className="text-lg font-black tracking-tight">TerpHealth Copilot</p>
            <p className="text-xs font-medium text-slate-500">UMD student healthcare navigator</p>
          </div>
        </div>
        <div className="flex max-w-full items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 sm:text-sm">
          <AlertTriangle size={16} className="shrink-0" />
          <span>This app is not medical advice. For emergencies call 911 or go to the ER.</span>
        </div>
      </div>
    </header>
  )
}

function Hero({ onScenario }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:py-14">
        <div className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">
            <Sparkles size={16} />
            TurboTax + Google Maps for student healthcare
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
            Understand care, coverage, and cost before you book.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            A calm first stop for UMD students who need to decode SHIP-like benefits, choose the right care setting, and avoid avoidable bills.
          </p>
          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario}
                onClick={() => onScenario(scenario)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"
              >
                <span className="min-w-0">{scenario}</span>
                <ArrowRight size={16} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-[#f7fbfb] p-4 shadow-sm">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Care route</p>
                <p className="mt-1 font-black">Sore throat, not emergency</p>
              </div>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Low cost</span>
            </div>
            <div className="mt-4 space-y-3">
              <RouteStep icon={Stethoscope} label="Best first stop" value="UMD Health Center" tone="teal" />
              <RouteStep icon={Clock3} label="After hours" value="Nearby urgent care" tone="sky" />
              <RouteStep icon={WalletCards} label="Avoid unless emergency" value="ER: high cost" tone="red" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Metric value="$0-low" label="Campus care" />
            <Metric value="$$" label="Urgent care" />
            <Metric value="911" label="Emergency" />
          </div>
        </div>
      </div>
    </section>
  )
}

function RouteStep({ icon: Icon, label, value, tone }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700',
    sky: 'bg-sky-50 text-sky-700',
    red: 'bg-red-50 text-red-700',
  }
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="truncate text-sm font-black text-slate-950">{value}</p>
      </div>
    </div>
  )
}

function Metric({ value, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  )
}

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [['navigator', 'Navigator'], ['insurance', 'Insurance'], ['wellness', 'Wellness'], ['nearby', 'Nearby Care'], ['benefits', 'Hidden Benefits']]
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">
      {tabs.map(([id, label]) => (
        <button key={id} onClick={() => setActiveTab(id)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition ${activeTab === id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{label}</button>
      ))}
    </div>
  )
}

function NavigatorPanel({ concern, setConcern, loading, onSubmit, onScenario }) {
  return (
    <div>
      <PanelHeader icon={Stethoscope} title="Smart Care Navigator" text="Describe what is going on. The copilot ranks options by cost, distance, speed, and clinical fit without trying to diagnose." />
      <textarea value={concern} onChange={(event) => setConcern(event.target.value)} placeholder="Example: I have a sore throat and I am not sure if I should go to the health center or urgent care." className="mt-5 min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" />
      <div className="mt-4 flex flex-wrap gap-2">
        {demoScenarios.map((scenario) => <button key={scenario} onClick={() => onScenario(scenario)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">{scenario}</button>)}
      </div>
      <PrimaryButton loading={loading} onClick={onSubmit} label="Get care recommendation" />
      <CostEstimator />
    </div>
  )
}

function InsurancePanel({ insuranceText, setInsuranceText, loading, onSubmit }) {
  return (
    <div>
      <PanelHeader icon={ShieldCheck} title="Insurance Decoder" text="Paste insurance text or use the included SHIP-like sample to translate benefits into student-friendly language." />
      <label className="mt-5 flex cursor-pointer flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-3 font-semibold"><ClipboardCheck size={20} className="text-teal-700" /> Optional PDF upload UI for demo</span>
        <input type="file" accept="application/pdf" className="max-w-full text-xs" />
      </label>
      <textarea value={insuranceText} onChange={(event) => setInsuranceText(event.target.value)} className="mt-4 min-h-64 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" />
      <PrimaryButton loading={loading} onClick={onSubmit} label="Decode insurance in plain English" />
    </div>
  )
}

function WellnessPanel() {
  return (
    <div>
      <PanelHeader icon={Brain} title="Mental Health & Wellness Hub" text="A campus-style map for support before stress becomes a crisis." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {wellnessResources.map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <CheckCircle2 size={20} className="text-violet-700" />
            <h3 className="mt-3 font-bold text-slate-950">{item}</h3>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0"><h3 className="font-black text-slate-950">{name}</h3><p className="mt-1 text-sm font-semibold text-teal-700">{type}</p></div>
              <span className="w-fit rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{cost}</span>
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
        {benefitCards.map(([title, text]) => <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
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
        {costRows.map(([place, cost, note]) => <div key={place} className="grid gap-2 rounded-lg border border-slate-100 bg-white p-3 sm:grid-cols-[150px_130px_1fr]"><strong className="text-slate-950">{place}</strong><span className="font-bold text-teal-700">{cost}</span><span className="text-sm text-slate-600">{note}</span></div>)}
      </div>
    </div>
  )
}

function CopilotPanel({ loading, aiResponse, aiMode }) {
  return (
    <aside className="min-w-0 rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-sm lg:sticky lg:top-5 lg:self-start">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0"><p className="text-sm font-semibold text-teal-200">Copilot response</p><h2 className="mt-1 text-2xl font-black tracking-tight">Care plan preview</h2></div>
        <span className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-teal-100">{aiMode.includes('claude') ? 'Claude API' : 'Demo mock'}</span>
      </div>
      <div className="mt-5 min-h-[520px] overflow-auto rounded-lg border border-white/10 bg-white/[0.06] p-4">
        {loading && <div className="flex h-80 flex-col items-center justify-center text-center text-teal-50"><Loader2 className="mb-4 animate-spin" size={34} /><p className="font-bold">Ranking care options...</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">Cost, speed, campus fit, and safety routing are being weighed for a student-friendly answer.</p></div>}
        {!loading && aiResponse && <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-100">{aiResponse}</pre>}
        {!loading && !aiResponse && <div className="space-y-4 text-sm leading-7 text-slate-200"><p>Start with a sample scenario, paste an insurance summary, or ask the hidden benefits finder.</p><div className="rounded-lg border border-white/10 bg-white/8 p-4"><p className="font-bold text-white">Response format</p><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Best option</li><li>Why</li><li>Estimated cost</li><li>Backup options</li><li>Questions to ask before booking</li><li>Safety disclaimer</li></ol></div><p className="text-teal-100">This app is not medical advice. For emergencies call 911 or go to the ER.</p></div>}
      </div>
    </aside>
  )
}

function PanelHeader({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100"><Icon size={24} /></span>
      <div className="min-w-0"><h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>
    </div>
  )
}

function PrimaryButton({ loading, onClick, label }) {
  return (
    <button onClick={onClick} disabled={loading} className="mt-5 inline-flex max-w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70">
      {loading ? <Loader2 className="animate-spin" size={18} /> : <MessageSquareText size={18} />}
      <span>{label}</span>
    </button>
  )
}

export default App
