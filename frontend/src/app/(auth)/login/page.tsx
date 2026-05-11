'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PublicHeader } from '@/components/layout/PublicHeader'

const SADC_COUNTRIES = [
  'Angola', 'Botswana', 'DRC', 'Eswatini', 'Lesotho',
  'Madagascar', 'Malawi', 'Mauritius', 'Mozambique', 'Namibia',
  'South Africa', 'Tanzania', 'Zambia', 'Zimbabwe',
]

const ROLES = [
  { value: 'srhr_researcher', label: 'SRHR Researcher' },
  { value: 'me_officer', label: 'M&E Officer' },
  { value: 'programme_manager', label: 'Programme Manager' },
  { value: 'finance_officer', label: 'Finance Officer' },
  { value: 'country_reviewer', label: 'Country Reviewer' },
  { value: 'communications_user', label: 'Communications User' },
  { value: 'partner_viewer', label: 'Partner / Donor Viewer' },
]

function InputField({
  icon, type = 'text', value, onChange, placeholder, required = false, minLength,
}: {
  icon: string; type?: string; value: string; onChange: (v: string) => void
  placeholder: string; required?: boolean; minLength?: number
}) {
  return (
    <div className="relative" suppressHydrationWarning>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844] pointer-events-none">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-2 focus:ring-[#00170d]/20 outline-none transition-all placeholder:text-[#727974]"
      />
    </div>
  )
}

function SelectField({
  icon, value, onChange, children, required = false,
}: {
  icon: string; value: string; onChange: (v: string) => void
  children: React.ReactNode; required?: boolean
}) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844] pointer-events-none">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-8 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-2 focus:ring-[#00170d]/20 outline-none transition-all appearance-none cursor-pointer"
      >
        {children}
      </select>
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#414844] pointer-events-none">
        <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
      </span>
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold text-[#1b1c1c] mb-1.5 uppercase tracking-widest">
      {children}{required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
    </label>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] rounded-lg text-[14px] flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
      {message}
    </div>
  )
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.message ?? 'Invalid credentials. Please try again.')
        return
      }
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('srhr_token', data.token)
        window.location.href = '/portal/dashboard'
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      <div>
        <FieldLabel>Email</FieldLabel>
        <InputField icon="mail" type="email" value={email} onChange={setEmail} placeholder="Enter your email" required />
      </div>

      <div>
        <FieldLabel>Password</FieldLabel>
        <InputField icon="lock" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-[#c1c8c2] text-[#00170d] w-4 h-4 accent-[#00170d]"
          />
          <span className="text-[14px] text-[#414844]">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-[12px] font-semibold text-[#00170d] hover:underline underline-offset-4">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00170d] text-white hover:bg-[#0b2d20] disabled:opacity-60 transition-colors rounded-full py-3.5 px-6 text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm"
      >
        {loading
          ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Signing in…</>
          : <><span>Sign in securely</span><span className="material-symbols-outlined text-[20px]">login</span></>
        }
      </button>
    </form>
  )
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: '', email: '', organization: '', country: '',
    role_requested: '', reason: '', password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.message ?? 'Something went wrong. Please try again.')
        return
      }
      onSuccess()
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Full name</FieldLabel>
          <InputField icon="person" value={form.name} onChange={(v) => update('name', v)} placeholder="Jane Doe" required />
        </div>
        <div>
          <FieldLabel required>Email</FieldLabel>
          <InputField icon="mail" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="jane@organisation.org" required />
        </div>
        <div>
          <FieldLabel required>Country</FieldLabel>
          <SelectField icon="location_on" value={form.country} onChange={(v) => update('country', v)} required>
            <option value="" disabled>Select a country</option>
            {SADC_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectField>
        </div>
        <div>
          <FieldLabel required>Organisation</FieldLabel>
          <InputField icon="domain" value={form.organization} onChange={(v) => update('organization', v)} placeholder="Your Institution" required />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel required>Role requested</FieldLabel>
          <SelectField icon="badge" value={form.role_requested} onChange={(v) => update('role_requested', v)} required>
            <option value="" disabled>Select a role</option>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </SelectField>
        </div>
      </div>

      <div>
        <FieldLabel>Reason for access</FieldLabel>
        <textarea
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
          placeholder="Briefly describe why you need access to this portal…"
          rows={3}
          className="w-full bg-white border border-[#c1c8c2] rounded-lg p-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-2 focus:ring-[#00170d]/20 outline-none transition-all resize-none placeholder:text-[#727974]"
        />
      </div>

      <div>
        <FieldLabel required>Password</FieldLabel>
        <InputField icon="lock" type="password" value={form.password} onChange={(v) => update('password', v)} placeholder="Min. 12 characters" required minLength={12} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#fed65b] text-[#574500] hover:bg-[#e9c349] disabled:opacity-60 transition-colors rounded-full py-3.5 px-6 text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm"
      >
        {loading
          ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Submitting…</>
          : <><span>Submit access request</span><span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
        }
      </button>
    </form>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-[#c6ebd7] rounded-full flex items-center justify-center mx-auto mb-5">
        <span className="material-symbols-outlined text-[32px] text-[#00170d]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h3 className="text-[22px] font-bold text-[#1b1c1c] mb-2">Request Received</h3>
      <p className="text-[15px] text-[#414844] mb-6">
        Your access request has been submitted. You will be notified once it&apos;s approved by an administrator.
      </p>
      <button
        onClick={onBack}
        className="text-[14px] font-semibold text-[#00170d] hover:underline underline-offset-4"
      >
        ← Back to login
      </button>
    </div>
  )
}

// Tiny component that reads searchParams and calls back — isolated inside Suspense
function SearchParamTabReader({ onRegister }: { onRegister: () => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get('tab') === 'register') onRegister()
  }, [searchParams, onRegister])
  return null
}

// ─── Main page ────────────────────────────────────────────────────────────────
function LoginPageInner() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [registered, setRegistered] = useState(false)

  const leftCopy = tab === 'login'
    ? { heading: 'Welcome back', body: 'Secure access to regional SRHR governance data, reports, indicators, and parliamentary insights across the SADC region.' }
    : { heading: 'Join the Project', body: 'Bridge the gap between community collaboration and digital insights. Request access to contribute to collective growth across the SADC region.' }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8]">
      <Suspense fallback={null}>
        <SearchParamTabReader onRegister={() => setTab('register')} />
      </Suspense>
      <PublicHeader />

      <div className="flex flex-1">
        {/* Left Brand Panel — hidden on mobile */}
        <div className="hidden lg:flex w-5/12 xl:w-2/5 bg-[#00170d] flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0">
          {/* Decorative radial */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #fed65b, transparent 55%), radial-gradient(circle at 80% 10%, #abcfbb, transparent 50%)' }}
          />

          {/* Top brand text */}
          <div className="relative z-10">
            <div className="text-[16px] font-extrabold text-[#fed65b] tracking-wide">SADC PF</div>
            <div className="text-[12px] font-semibold text-[#abcfbb] tracking-wide">SRHR Portal</div>
          </div>

          {/* Centre copy */}
          <div className="relative z-10">
            <h2 className="text-[38px] xl:text-[44px] font-extrabold text-white mb-5 leading-tight">
              {leftCopy.heading}
            </h2>
            <p className="text-[17px] text-[#abcfbb] leading-relaxed">
              {leftCopy.body}
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { icon: 'public', label: '16 Member States' },
                { icon: 'description', label: '243 Policies Tracked' },
                { icon: 'groups', label: 'Secure & Compliant' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-[#0b2d20] rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-[#fed65b] text-[16px]">{item.icon}</span>
                  <span className="text-[13px] font-semibold text-[#c6ebd7]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10">
            <p className="text-[13px] text-[#749684]">© 2026 SADC Parliamentary Forum · Empowering regional health initiatives</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-start justify-center p-5 sm:p-8 lg:p-10 overflow-y-auto">
          <div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,23,13,0.08)] border border-[#c1c8c2]/30 overflow-hidden">

              {/* Tab switcher */}
              <div className="flex border-b border-[#c1c8c2]/40">
                {(['login', 'register'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setRegistered(false) }}
                    className={`flex-1 py-4 text-[14px] font-bold tracking-wide transition-all ${
                      tab === t
                        ? 'text-[#00170d] border-b-2 border-[#00170d] bg-white'
                        : 'text-[#727974] hover:text-[#414844] bg-[#fbf9f8]'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Request Access'}
                  </button>
                ))}
              </div>

              {/* Form body */}
              <div className="p-6 sm:p-8">
                {tab === 'login' && (
                  <>
                    <div className="mb-6">
                      <h1 className="text-[22px] font-bold text-[#1b1c1c]">Welcome back</h1>
                      <p className="text-[14px] text-[#414844] mt-1">Enter your credentials to access your dashboard.</p>
                    </div>
                    <LoginForm />
                  </>
                )}

                {tab === 'register' && !registered && (
                  <>
                    <div className="mb-6">
                      <h1 className="text-[22px] font-bold text-[#1b1c1c]">Create an account</h1>
                      <p className="text-[14px] text-[#414844] mt-1">Submit your details to request portal access.</p>
                    </div>
                    <RegisterForm onSuccess={() => setRegistered(true)} />
                  </>
                )}

                {tab === 'register' && registered && (
                  <SuccessScreen onBack={() => { setRegistered(false); setTab('login') }} />
                )}
              </div>

              {/* Footer hint */}
              {!registered && (
                <div className="px-8 pb-6 text-center">
                  <p className="text-[13px] text-[#414844]">
                    {tab === 'login'
                      ? <>No account yet?{' '}
                          <button onClick={() => setTab('register')} className="text-[#00170d] font-semibold hover:underline underline-offset-4">
                            Request access
                          </button>
                        </>
                      : <>Already have access?{' '}
                          <button onClick={() => setTab('login')} className="text-[#00170d] font-semibold hover:underline underline-offset-4">
                            Sign in
                          </button>
                        </>
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function LoginPage() {
  return <LoginPageInner />
}
