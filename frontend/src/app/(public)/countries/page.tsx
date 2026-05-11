'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type CountryStatus = 'on-track' | 'in-progress' | 'needs-attention'

interface Country {
  name: string
  slug: string
  status: CountryStatus
  period: string
  reports: number
  indicators: number
}

function statusBadge(status: CountryStatus) {
  if (status === 'on-track') {
    return (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide bg-[#c6ebd7] text-[#002115]">
        <span className="material-symbols-outlined text-[14px]">check_circle</span> On Track
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide bg-[#ffe088] text-[#241a00]">
        <span className="material-symbols-outlined text-[14px]">schedule</span> In Progress
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide bg-[#ffdad6] text-[#93000a]">
      <span className="material-symbols-outlined text-[14px]">warning</span> Needs Attention
    </span>
  )
}

function progressBarColor(status: CountryStatus) {
  if (status === 'on-track') return '#00170d'
  if (status === 'in-progress') return '#735c00'
  return '#ba1a1a'
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetch('/api/public/countries', { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then(setCountries)
      .catch(() => setCountries([]))
  }, [])

  const filtered = countries.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === '' || country.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 py-10 flex flex-col gap-10">
        <section className="flex flex-col gap-6">
          <div>
            <h1 className="text-[32px] font-bold text-[#1b1c1c] mb-1">Countries</h1>
            <p className="text-[18px] text-[#414844] max-w-2xl">Explore SRHR reporting and progress across SADC member states.</p>
          </div>
          <div className="bg-[#fbf9f8] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.04)] border border-[#00170d]/10 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#414844] mb-1">Search Countries</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727974]">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-[#f5f3f3] border border-[#c1c8c2] rounded focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-colors text-[16px] text-[#1b1c1c] placeholder-[#727974]"
                  placeholder="e.g. Angola, Botswana"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#414844] mb-1">Status</label>
              <select
                className="w-full px-4 py-2 bg-[#f5f3f3] border border-[#c1c8c2] rounded focus:border-[#00170d] outline-none text-[16px] text-[#1b1c1c]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="on-track">On Track</option>
                <option value="in-progress">In Progress</option>
                <option value="needs-attention">Needs Attention</option>
              </select>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((country) => (
            <article
              key={country.slug}
              className="bg-[#fbf9f8] rounded-xl shadow-[0_4px_24px_rgba(0,23,13,0.04)] border border-[#00170d]/10 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,23,13,0.08)]"
            >
              <div className="h-32 bg-[#0b2d20] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2d20] to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <h2 className="text-[24px] font-bold text-white">{country.name}</h2>
                  {statusBadge(country.status)}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-6 flex-grow">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#efeded] p-3 rounded-lg flex flex-col items-center text-center">
                    <span className="text-[20px] font-semibold text-[#00170d]">{country.period}</span>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Latest Period</span>
                  </div>
                  <div className="bg-[#efeded] p-3 rounded-lg flex flex-col items-center text-center">
                    <span className="text-[20px] font-semibold text-[#00170d]">{country.reports}</span>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Reports Pub.</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Indicators Achieved</span>
                    <span className="text-[12px] font-semibold text-[#00170d]">{country.indicators}%</span>
                  </div>
                  <div className="w-full bg-[#eae8e7] rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${country.indicators}%`, backgroundColor: progressBarColor(country.status) }} />
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-[#c1c8c2]/30 flex justify-end">
                  <Link href={`/countries/${country.slug}`} className="text-[#00170d] hover:bg-[#00170d]/5 px-4 py-2 rounded-full text-[14px] font-semibold transition-colors flex items-center gap-2">
                    View Country <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
