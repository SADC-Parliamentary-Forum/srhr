'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

interface CountryData {
  name: string
  slug: string
  status: string
  period: string
  reports: number
  indicators: number
  onTrack: number
  atRisk: number
  narrative: string
  latestReport: string
  reportDate: string
  indicator_rows: Array<{ id: string; outcome: string; name: string; status: string; trend: string }>
  recent_activity: Array<{ icon: string; title: string; desc: string; time: string }>
}

function statusBadge(status: string) {
  if (status === 'on-track') return 'bg-[#c6ebd7] text-[#002115]'
  if (status === 'in-progress') return 'bg-[#ffe088] text-[#241a00]'
  return 'bg-[#ffdad6] text-[#93000a]'
}

function indicatorStatusBadge(status: string) {
  if (status === 'achieved') return 'bg-[#e6f4ea] text-[#137333]'
  if (status === 'on-track') return 'bg-[#e8f0fe] text-[#1a73e8]'
  return 'bg-[#fce8e6] text-[#c5221f]'
}

export default function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [country, setCountry] = useState<CountryData | null>(null)

  useEffect(() => {
    fetch(`/api/public/countries/${slug}`, { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then(setCountry)
      .catch(() => setCountry(null))
  }, [slug])

  if (!country) {
    return <div className="min-h-screen bg-[#fbf9f8] flex items-center justify-center text-[#414844]">Loading country data...</div>
  }

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 py-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 text-[#727974] text-[12px] font-semibold">
            <Link href="/countries" className="hover:text-[#00170d] transition-colors">Countries</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#1b1c1c]">{country.name}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[40px] font-extrabold text-[#00170d]">{country.name}</h1>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold ${statusBadge(country.status)}`}>
                <span className="material-symbols-outlined text-[14px]">flag</span>
                {country.status}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              <div className="bg-[#efeded] rounded-lg p-3 min-w-[120px]">
                <span className="text-[12px] font-semibold text-[#727974] uppercase tracking-wider">Latest Period</span>
                <div className="text-[20px] font-semibold text-[#1b1c1c]">{country.period}</div>
              </div>
              <div className="bg-[#efeded] rounded-lg p-3 min-w-[120px]">
                <span className="text-[12px] font-semibold text-[#727974] uppercase tracking-wider">Reports</span>
                <div className="text-[20px] font-semibold text-[#1b1c1c]">{country.reports}</div>
              </div>
              <div className="bg-[#efeded] rounded-lg p-3 min-w-[120px]">
                <span className="text-[12px] font-semibold text-[#727974] uppercase tracking-wider">Indicators</span>
                <div className="text-[20px] font-semibold text-[#1b1c1c]">{country.indicators}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 bg-[#efeded] rounded-xl p-6 shadow-sm border border-[#00170d]/5">
            <h2 className="text-[20px] font-semibold text-[#00170d] mb-3">Country Snapshot</h2>
            <p className="text-[16px] text-[#414844] leading-relaxed">{country.narrative}</p>
          </section>
          <section className="bg-[#00170d] text-white rounded-xl p-6 shadow-sm">
            <h2 className="text-[20px] font-semibold mb-3">Latest Report</h2>
            <h3 className="text-[14px] font-semibold mb-1">{country.latestReport}</h3>
            <p className="text-[14px] text-white/80">Published: {country.reportDate}</p>
          </section>
        </div>

        <section className="bg-white rounded-xl border border-[#c1c8c2]/20 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#c1c8c2] bg-[#f5f3f3]">
            <h3 className="text-[20px] font-semibold text-[#00170d]">Indicator Progress</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f3f3] border-b border-[#c1c8c2]">
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">ID</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Outcome</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Indicator</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Status</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c8c2]/30">
                {country.indicator_rows.map((indicator) => (
                  <tr key={indicator.id} className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="py-3 px-4 text-[14px] font-semibold text-[#727974]">{indicator.id}</td>
                    <td className="py-3 px-4 text-[14px] text-[#414844]">{indicator.outcome}</td>
                    <td className="py-3 px-4 text-[14px] text-[#1b1c1c] font-medium">{indicator.name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${indicatorStatusBadge(indicator.status)}`}>
                        {indicator.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[14px] font-semibold text-[#414844]">{indicator.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-[#efeded] rounded-xl p-6 shadow-sm border border-[#00170d]/5">
          <h2 className="text-[20px] font-semibold text-[#00170d] mb-6">Recent Activity</h2>
          <ul className="flex flex-col divide-y divide-[#c1c8c2]/50">
            {country.recent_activity.map((item) => (
              <li key={`${item.title}-${item.time}`} className="py-3 first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-[#727974] text-[20px] mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#1b1c1c]">{item.title}</h4>
                    <p className="text-[14px] text-[#727974]">{item.desc}</p>
                    <span className="text-[12px] text-[#727974] mt-1 block">{item.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
