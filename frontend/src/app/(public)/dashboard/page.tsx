'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type PublicDashboard = {
  regional_progress: number
  country_count: number
  country_total: number
  public_report_count: number
  outcomes: Array<{ code: string; name: string; desc: string; status: string }>
  country_statuses: Array<{ abbr: string; name: string; slug: string; status: string }>
  recent_reports: Array<{ title: string; country: string; type: string; date: string; size: string; download_url?: string }>
}

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState<PublicDashboard | null>(null)

  useEffect(() => {
    fetch('/api/public/dashboard', { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  const outcomes = data?.outcomes ?? []
  const countryStatuses = data?.country_statuses ?? []
  const recentReports = data?.recent_reports ?? []

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-5 py-10 flex flex-col gap-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-[40px] font-extrabold text-[#00170d]">Public SRHR Dashboard</h1>
            <p className="text-[18px] text-[#414844] mt-1">Overview of Regional Sexual and Reproductive Health and Rights Performance.</p>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-semibold px-3 py-2 bg-[#efeded] rounded-full border border-[#c1c8c2] hover:bg-[#e4e2e2] transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF Report
          </button>
        </section>

        <section className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-[0_4px_24px_rgba(0,23,13,0.04)] border border-[#727974]/10 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727974]">search</span>
            <input
              className="w-full bg-white border border-[#c1c8c2] rounded pl-10 pr-3 py-2 text-[14px] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none"
              placeholder="Search keywords..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-[#00170d] rounded-xl p-6 text-white shadow-[0_8px_32px_rgba(0,23,13,0.1)] relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#0b2d20] rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div>
              <h3 className="text-[20px] font-semibold text-[#fed65b]">Regional Progress</h3>
              <p className="text-[14px] text-[#2d4d3e] mt-1 max-w-[80%]">Overall completion rate across SADC member states for the current strategic cycle.</p>
            </div>
            <div className="flex items-end gap-3 mt-10">
              <span className="text-[40px] font-extrabold leading-none">{data?.regional_progress ?? 0}%</span>
              <span className="text-[12px] font-semibold bg-[#fed65b] text-[#745c00] px-2 py-0.5 rounded-full flex items-center gap-0.5 mb-1">
                <span className="material-symbols-outlined text-[12px]">insights</span> Live
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#c1c8c2] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.02)] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h4 className="text-[14px] font-semibold text-[#414844]">Countries Reporting</h4>
              <div className="w-8 h-8 rounded-full bg-[#c6ebd7] flex items-center justify-center text-[#00170d]">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-[32px] font-bold text-[#00170d]">{data?.country_count ?? 0}</span>
              <span className="text-[14px] text-[#727974]"> / {data?.country_total ?? 0}</span>
            </div>
          </div>

          <div className="bg-white border border-[#c1c8c2] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.02)] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h4 className="text-[14px] font-semibold text-[#414844]">Public Reports</h4>
              <div className="w-8 h-8 rounded-full bg-[#ffe088] flex items-center justify-center text-[#735c00]">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-[32px] font-bold text-[#00170d]">{data?.public_report_count ?? 0}</span>
              <span className="text-[14px] text-[#727974]"> Published</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-white border border-[#c1c8c2] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.02)] flex flex-col h-full">
            <h3 className="text-[20px] font-semibold text-[#00170d] mb-3">Outcome Performance</h3>
            <p className="text-[14px] text-[#414844] mb-6 border-b border-[#c1c8c2] pb-3">Status of strategic outcomes across the region.</p>
            <div className="flex flex-col gap-1 flex-1">
              {outcomes.map((outcome) => (
                <div key={outcome.code} className="flex items-center justify-between p-3 hover:bg-[#efeded] transition-colors rounded border border-transparent hover:border-[#c1c8c2]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#0b2d20] text-[#749684] flex items-center justify-center font-bold text-[12px] shrink-0">{outcome.code}</div>
                    <div>
                      <h5 className="text-[14px] font-semibold text-[#00170d]">{outcome.name}</h5>
                      <p className="text-[12px] text-[#727974] line-clamp-1">{outcome.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#efeded] text-[#00170d]">
                    {outcome.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#c1c8c2] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.02)] flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-semibold text-[#00170d]">Country Reporting Status</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
              {countryStatuses.map((country) => (
                <Link
                  key={country.abbr}
                  href={`/countries/${country.slug}`}
                  className="border border-[#c1c8c2] rounded p-3 flex flex-col items-center justify-center text-center hover:shadow-[0_4px_12px_rgba(0,23,13,0.05)] hover:border-[#c6ebd7] transition-all cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 text-[14px]"
                    style={{ backgroundColor: country.status === 'up-to-date' ? '#0b2d20' : '#e4e2e2', color: country.status === 'up-to-date' ? '#fed65b' : '#727974' }}
                  >
                    {country.abbr}
                  </div>
                  <span className="text-[12px] font-semibold text-[#00170d]">{country.name}</span>
                  <span className="text-[10px] mt-1" style={{ color: country.status === 'up-to-date' ? '#137333' : '#c5221f' }}>
                    {country.status === 'up-to-date' ? 'Up to date' : 'Pending'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#c1c8c2] rounded-xl shadow-[0_4px_24px_rgba(0,23,13,0.02)] overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] flex justify-between items-center">
            <h3 className="text-[20px] font-semibold text-[#00170d]">Recent Reports</h3>
            <Link href="/reports" className="text-[12px] font-semibold text-[#00170d] hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f3f3] border-b border-[#c1c8c2]">
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Title</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Country</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Type</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Published</th>
                  <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c8c2]/30">
                {recentReports.map((report) => (
                  <tr key={report.title} className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="py-3 px-4 text-[14px] font-medium text-[#00170d]">{report.title}</td>
                    <td className="py-3 px-4 text-[14px] text-[#414844]">{report.country}</td>
                    <td className="py-3 px-4">
                      <span className="text-[12px] font-semibold bg-[#c6ebd7] text-[#002115] px-2 py-0.5 rounded-full">{report.type}</span>
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#414844]">{report.date}</td>
                    <td className="py-3 px-4 text-right">
                      <a href={report.download_url ?? '#'} className="text-[#00170d] hover:bg-[#f5f3f3] p-1.5 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
