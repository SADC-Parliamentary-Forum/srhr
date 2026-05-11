'use client'

import Link from 'next/link'
import { useState } from 'react'

const SADC_COUNTRIES = [
  'Angola', 'Botswana', 'Comoros', 'DRC', 'Eswatini', 'Lesotho',
  'Madagascar', 'Malawi', 'Mauritius', 'Mozambique', 'Namibia',
  'Seychelles', 'South Africa', 'Tanzania', 'Zambia', 'Zimbabwe',
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

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', organization: '', country: '',
    role_requested: '', reason: '', password: '',
  })
  const [submitted, setSubmitted] = useState(false)
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
      setSubmitted(true)
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8] p-5">
        <div className="max-w-md w-full bg-white rounded-xl shadow-[0_8px_30px_rgba(0,23,13,0.06)] border border-[#c1c8c2]/30 p-10 text-center">
          <div className="w-16 h-16 bg-[#c6ebd7] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-[#00170d]">check_circle</span>
          </div>
          <h2 className="text-[24px] font-bold text-[#1b1c1c] mb-3">Request Received</h2>
          <p className="text-[16px] text-[#414844] leading-relaxed">
            Your registration request has been received. You will be notified once your access is approved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block px-6 py-3 bg-[#00170d] text-white rounded-full text-[14px] font-semibold hover:bg-[#0b2d20] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:flex w-5/12 bg-[#00170d] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#00170d]/90" />
        <div className="relative z-20 flex items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-[#fed65b]">public</span>
          <span className="text-[20px] font-semibold text-white">SADC PF SRHR Portal</span>
        </div>
        <div className="relative z-20 max-w-md">
          <h1 className="text-[40px] font-extrabold text-white mb-6 leading-tight">Join the Project</h1>
          <p className="text-[18px] text-[#abcfbb] leading-relaxed">
            Bridge the gap between traditional community collaboration and modern digital insights. Secure your
            access to collective growth and unwavering stability.
          </p>
        </div>
        <div className="relative z-20">
          <p className="text-[14px] text-[#c6ebd7]">Empowering regional health initiatives.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-5 md:p-10 bg-[#fbf9f8]">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,23,13,0.06)] border border-[#c1c8c2]/30 p-8">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#1b1c1c]">Create an Account</h2>
              <p className="text-[14px] text-[#414844] mt-1">Submit your details to request access to the portal.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] rounded-lg text-[14px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                    Full name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                    Email <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      required
                      placeholder="jane@organisation.org"
                      className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                    Country <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </span>
                    <select
                      value={form.country}
                      onChange={(e) => update('country', e.target.value)}
                      required
                      className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-8 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a country</option>
                      {SADC_COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#414844] pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                    </span>
                  </div>
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                    Organisation <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                      <span className="material-symbols-outlined text-[20px]">domain</span>
                    </span>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => update('organization', e.target.value)}
                      required
                      placeholder="Your Institution"
                      className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                    Role requested <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                    </span>
                    <select
                      value={form.role_requested}
                      onChange={(e) => update('role_requested', e.target.value)}
                      required
                      className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-8 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a role</option>
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#414844] pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                  Reason for access
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => update('reason', e.target.value)}
                  placeholder="Briefly describe why you need access to this portal..."
                  rows={3}
                  className="w-full bg-white border border-[#c1c8c2] rounded-lg p-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all resize-none placeholder:text-[#727974]"
                />
              </div>

              {/* Password */}
              <div className="md:max-w-sm">
                <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 uppercase tracking-wide">
                  Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                    minLength={12}
                    placeholder="Min. 12 characters"
                    className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#fed65b] text-[#574500] hover:bg-[#e9c349] disabled:opacity-60 transition-colors rounded-full py-3 px-6 text-[14px] font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? 'Submitting…' : 'Register Request'}
                  {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                </button>
              </div>
            </form>

            <p className="text-center text-[14px] text-[#414844] mt-6">
              Already have access?{' '}
              <Link href="/login" className="text-[#00170d] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
