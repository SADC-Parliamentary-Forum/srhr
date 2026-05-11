'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface Report {
  id: number
  title: string
  description: string
  type: string
  country: string
  date: string
  size: string
  download_url?: string | null
}

type ReportsResponse = {
  reports: Report[]
  countries: string[]
  years: string[]
}

function typeBadge(type: string) {
  return (
    <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#c6ebd7] text-[#002115]">{type}</span>
  )
}

export default function ReportsPage() {
  const [allReports, setAllReports] = useState<Report[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [year, setYear] = useState('')
  const [types, setTypes] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/public/reports', { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then((data: ReportsResponse) => {
        setAllReports(Array.isArray(data.reports) ? data.reports : [])
        setAvailableCountries(Array.isArray(data.countries) ? data.countries : [])
        setAvailableYears(Array.isArray(data.years) ? data.years : [])
      })
      .catch(() => {
        setAllReports([])
        setAvailableCountries([])
        setAvailableYears([])
      })
  }, [])

  const toggleType = (type: string) => {
    setTypes((prev) => prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type])
  }

  const filtered = useMemo(() => {
    return allReports.filter((report) => {
      const haystack = [report.title, report.description ?? '', report.country ?? ''].join(' ').toLowerCase()
      const matchesSearch = haystack.includes(search.toLowerCase())
      const matchesCountry = country === '' || report.country === country
      const matchesYear = year === '' || report.date.includes(year)
      const matchesType = types.length === 0 || types.includes(report.type)
      return matchesSearch && matchesCountry && matchesYear && matchesType
    })
  }, [allReports, country, search, types, year])

  const reportTypes = ['Annual Report', 'Monthly Update', 'Research Brief', 'Regional Synthesis', 'Quarterly Update', 'Annual', 'Quarterly', 'Brief', 'Research']

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-5 py-10 flex flex-col gap-10">
        <section className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold text-[#00170d]">Reports Library</h1>
          <p className="text-[18px] text-[#414844] max-w-3xl">Explore our collection of regional reports, research briefs, and reporting updates.</p>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-[#efeded] rounded-lg p-6 shadow-sm border border-[#c1c8c2]/10">
              <label className="text-[14px] font-semibold text-[#00170d] mb-2 block">Search Reports</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#414844]">search</span>
                <input
                  className="w-full bg-white border border-[#c1c8c2] rounded pl-10 py-3 text-[14px] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none transition-all"
                  placeholder="Keywords, titles..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-[#efeded] rounded-lg p-6 shadow-sm border border-[#c1c8c2]/10 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[20px] font-semibold text-[#00170d]">Filters</h3>
                <button
                  className="text-[12px] font-semibold text-[#00170d] underline hover:text-[#446555]"
                  onClick={() => { setCountry(''); setYear(''); setTypes([]) }}
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#414844]">Country</label>
                <select className="w-full bg-white border border-[#c1c8c2] rounded px-3 py-3 text-[14px] focus:border-[#00170d] outline-none cursor-pointer" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="">All Countries</option>
                  {availableCountries.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#414844]">Report Type</label>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                  {reportTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer hover:bg-[#eae8e7] p-1 rounded transition-colors">
                      <input className="rounded border-[#c1c8c2] text-[#00170d] focus:ring-[#00170d] h-4 w-4" type="checkbox" checked={types.includes(type)} onChange={() => toggleType(type)} />
                      <span className="text-[14px]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#414844]">Year</label>
                <select className="w-full bg-white border border-[#c1c8c2] rounded px-3 py-3 text-[14px] focus:border-[#00170d] outline-none cursor-pointer" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">All Years</option>
                  {availableYears.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </aside>

          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-3 rounded border border-[#c1c8c2]/20 shadow-sm">
              <span className="text-[14px] text-[#414844]">
                Showing <strong className="text-[#00170d]">{filtered.length}</strong> reports
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((report) => (
                <article key={report.id} className="bg-white rounded-xl p-6 flex flex-col gap-6 border border-[#c1c8c2]/20 hover:shadow-[0_4px_20px_rgba(0,23,13,0.08)] transition-shadow relative group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1 flex-wrap">
                      {typeBadge(report.type)}
                      <span className="text-[12px] font-semibold bg-[#efeded] text-[#414844] px-3 py-1 rounded-full border border-[#c1c8c2]/30">{report.country}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-grow">
                    <h3 className="text-[20px] font-semibold text-[#00170d] line-clamp-2">{report.title}</h3>
                    <p className="text-[14px] text-[#414844] line-clamp-3">{report.description}</p>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-[#c1c8c2]/20">
                    <div className="flex items-center gap-3 text-[14px] text-[#414844] flex-wrap">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      <span>Published: {report.date}</span>
                      <span className="mx-1">-</span>
                      <span>{report.size}</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Link href={`/reports/${report.id}`} className="flex-1 min-w-[160px] border border-[#00170d] text-[#00170d] text-[12px] font-semibold py-3 rounded flex items-center justify-center gap-1 hover:bg-[#f5f3f3] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Report
                      </Link>
                      {report.download_url ? (
                        <a
                          href={report.download_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 min-w-[160px] bg-[#00170d] text-white text-[12px] font-semibold py-3 rounded flex items-center justify-center gap-1 hover:bg-[#446555] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Download PDF
                        </a>
                      ) : (
                        <Link href={`/reports/${report.id}`} className="flex-1 min-w-[160px] bg-[#00170d] text-white text-[12px] font-semibold py-3 rounded flex items-center justify-center gap-1 hover:bg-[#446555] transition-colors">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                          Open Summary
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
