'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:flex w-5/12 bg-[#00170d] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#00170d]/90" />
        <div className="relative z-20 flex items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-[#fed65b]">public</span>
          <span className="text-[20px] font-semibold text-white">SADC PF SRHR Portal</span>
        </div>
        <div className="relative z-20 max-w-md">
          <h1 className="text-[40px] font-extrabold text-white mb-6 leading-tight">Welcome Back</h1>
          <p className="text-[18px] text-[#abcfbb] leading-relaxed">
            Secure access to regional SRHR governance data, reports, indicators, and parliamentary insights across
            the SADC region.
          </p>
        </div>
        <div className="relative z-20">
          <p className="text-[14px] text-[#c6ebd7]">Empowering regional health initiatives.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-5 md:p-10 bg-[#fbf9f8]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,23,13,0.06)] border border-[#c1c8c2]/30 p-8">
            <div className="mb-8">
              <h2 className="text-[24px] font-bold text-[#1b1c1c]">Welcome back</h2>
              <p className="text-[14px] text-[#414844] mt-1">Enter your credentials to access your dashboard.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] rounded-lg text-[14px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 tracking-wide uppercase">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#1b1c1c] mb-1 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#414844]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#c1c8c2] rounded-lg py-3 pl-10 pr-3 text-[16px] text-[#1b1c1c] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all placeholder:text-[#727974]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#c1c8c2] text-[#00170d] w-4 h-4"
                  />
                  <span className="text-[14px] text-[#414844]">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-semibold text-[#00170d] hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00170d] text-white hover:bg-[#0b2d20] disabled:opacity-60 transition-colors rounded-full py-3 px-6 text-[14px] font-semibold flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                {loading ? 'Signing in…' : 'Login securely'}
                {!loading && <span className="material-symbols-outlined text-[20px]">login</span>}
              </button>
            </form>

            <p className="text-center text-[14px] text-[#414844] mt-6">
              Don&apos;t have access?{' '}
              <Link href="/register" className="text-[#00170d] font-semibold hover:underline">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
