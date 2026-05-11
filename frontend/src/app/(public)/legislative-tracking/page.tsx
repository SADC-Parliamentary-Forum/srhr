'use client'

import { useState } from 'react'

interface Legislation {
  country: string
  abbr: string
  policy: string
  domain: string
  stage: string
  lastAction: string
}

const legislation: Legislation[] = [
  { country: 'Zambia', abbr: 'ZM', policy: 'Comprehensive Safe Motherhood Act', domain: 'Maternal Health', stage: 'Parl. Review', lastAction: '12 Oct 2023' },
  { country: 'Botswana', abbr: 'BW', policy: 'Adolescent Sexual Reproductive Health Bill', domain: 'CSE', stage: 'Consultation', lastAction: '05 Oct 2023' },
  { country: 'South Africa', abbr: 'ZA', policy: 'Reproductive Rights Amendment Bill', domain: 'Maternal Health', stage: 'Passed', lastAction: '28 Sep 2023' },
  { country: 'Namibia', abbr: 'NA', policy: 'GBV Prevention and Response Act', domain: 'Gender-Based Violence', stage: 'Implementation', lastAction: '15 Sep 2023' },
  { country: 'Malawi', abbr: 'MW', policy: 'National Reproductive Health Policy Framework', domain: 'CSE', stage: 'Drafting', lastAction: '08 Sep 2023' },
  { country: 'Tanzania', abbr: 'TZ', policy: 'Maternal and Child Health Services Bill', domain: 'Maternal Health', stage: 'Consultation', lastAction: '02 Sep 2023' },
  { country: 'Eswatini', abbr: 'SZ', policy: 'Youth Sexual Health Access Act', domain: 'CSE', stage: 'Passed', lastAction: '25 Aug 2023' },
  { country: 'Angola', abbr: 'AO', policy: 'Family Planning Commodities Security Policy', domain: 'Maternal Health', stage: 'Implementation', lastAction: '18 Aug 2023' },
  { country: 'Zimbabwe', abbr: 'ZW', policy: 'Adolescent-Friendly Services Regulations', domain: 'CSE', stage: 'Drafting', lastAction: '10 Aug 2023' },
  { country: 'Lesotho', abbr: 'LS', policy: 'GBV Survivor Support Framework', domain: 'Gender-Based Violence', stage: 'Parl. Review', lastAction: '03 Aug 2023' },
]

const pipeline = [
  { count: '12', label: 'Drafting', color: '#e4e2e2', activeColor: '#00170d' },
  { count: '08', label: 'Consultation', color: '#fed65b', activeColor: '#735c00' },
  { count: '05', label: 'Parliamentary Review', color: '#abcfbb', activeColor: '#0b2d20' },
  { count: '14', label: 'Passed', color: '#00170d', activeColor: '#0b2d20' },
  { count: '21', label: 'Implementation', color: null, activeColor: null },
]

function stageBadge(stage: string) {
  const styles: Record<string, { bg: string; color: string }> = {
    'Drafting': { bg: '#e4e2e2', color: '#414844' },
    'Consultation': { bg: '#fed65b', color: '#745c00' },
    'Parl. Review': { bg: '#abcfbb', color: '#2d4d3e' },
    'Passed': { bg: '#c6ebd7', color: '#002115' },
    'Implementation': { bg: '#0b2d20', color: '#abcfbb' },
  }
  const s = styles[stage] ?? { bg: '#efeded', color: '#414844' }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{stage}</span>
  )
}

export default function LegislativeTrackingPage() {
  const [countryFilter, setCountryFilter] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const filtered = legislation.filter((l) => {
    const matchesCountry = countryFilter === '' || l.country.toLowerCase().includes(countryFilter.toLowerCase())
    const matchesDomain = domainFilter === '' || l.domain === domainFilter
    const matchesStage = stageFilter === '' || l.stage === stageFilter
    return matchesCountry && matchesDomain && matchesStage
  })

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-5 py-10 flex flex-col gap-10">
        <section className="flex flex-col gap-6">
          <div>
            <h1 className="text-[32px] font-bold text-[#00170d]">Legislative Tracker</h1>
            <p className="text-[18px] text-[#414844] mt-1">Monitor the progression of SRHR policies across member states.</p>
          </div>

          <div className="bg-[#fbf9f8] rounded-xl shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)] border border-[#00170d]/10 p-6 flex flex-wrap items-end gap-6">
            <div className="flex-grow min-w-[200px] flex flex-col gap-1">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Country</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-[#f5f3f3] border border-[#c1c8c2] rounded-lg px-3 py-2 text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d]"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                >
                  <option value="">All Member States</option>
                  {Array.from(new Set(legislation.map((l) => l.country))).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#414844] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="flex-grow min-w-[200px] flex flex-col gap-1">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Policy Domain</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-[#f5f3f3] border border-[#c1c8c2] rounded-lg px-3 py-2 text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#00170d]"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                >
                  <option value="">All Domains</option>
                  <option>Maternal Health</option>
                  <option>Comprehensive Sexuality Education</option>
                  <option>Gender-Based Violence</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#414844] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="flex-grow min-w-[150px] flex flex-col gap-1">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Status</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-[#f5f3f3] border border-[#c1c8c2] rounded-lg px-3 py-2 text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#00170d]"
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                >
                  <option value="">Any Stage</option>
                  <option>Drafting</option>
                  <option>Consultation</option>
                  <option>Parl. Review</option>
                  <option>Passed</option>
                  <option>Implementation</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#414844] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="flex-grow min-w-[250px] flex flex-col gap-1">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Date Range</label>
              <div className="flex gap-2 items-center">
                <input className="w-full bg-[#f5f3f3] border border-[#c1c8c2] rounded-lg px-3 py-2 text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#00170d]" type="date" />
                <span className="text-[#414844]">-</span>
                <input className="w-full bg-[#f5f3f3] border border-[#c1c8c2] rounded-lg px-3 py-2 text-[16px] text-[#1b1c1c] focus:outline-none focus:border-[#00170d]" type="date" />
              </div>
            </div>

            <button
              className="bg-[#00170d] text-white text-[14px] font-semibold px-6 py-2 rounded-lg hover:bg-[#0b2d20] transition-colors flex items-center gap-1 h-[42px]"
              onClick={() => { setCountryFilter(''); setDomainFilter(''); setStageFilter('') }}
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Clear Filters
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[20px] font-semibold text-[#00170d]">Policy Pipeline</h2>
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            {pipeline.map((stage, i) => (
              <div
                key={stage.label}
                className={`flex-1 rounded-xl shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer transition-colors ${i === 4 ? 'bg-[#0b2d20]' : 'bg-[#fbf9f8] border border-[#00170d]/10 hover:border-[#00170d]/30'}`}
              >
                {i < 4 && (
                  <div
                    className="absolute top-0 left-0 w-full h-1 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: stage.color ?? '#00170d' }}
                  />
                )}
                <span className="text-[40px] font-extrabold leading-none" style={{ color: i === 4 ? '#fed65b' : '#00170d' }}>{stage.count}</span>
                <span className="text-[12px] font-semibold uppercase tracking-wider mt-1" style={{ color: i === 4 ? '#abcfbb' : '#414844' }}>{stage.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <section className="lg:col-span-3 bg-[#fbf9f8] rounded-xl shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)] border border-[#00170d]/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#c1c8c2] flex justify-between items-center bg-white">
              <h3 className="text-[20px] font-semibold text-[#00170d]">Active Legislation</h3>
              <button className="text-[#00170d] text-[12px] font-semibold hover:underline flex items-center gap-1">
                Export CSV <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f3f3] border-b border-[#c1c8c2]">
                    <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844] w-1/5">Country</th>
                    <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844] w-2/5">Policy Name</th>
                    <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Stage</th>
                    <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844]">Last Action</th>
                    <th className="py-3 px-4 text-[12px] font-semibold uppercase tracking-wider text-[#414844] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-[#1b1c1c]">
                  {filtered.map((item) => (
                    <tr key={item.policy} className="border-b border-[#c1c8c2] hover:bg-white transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0b2d20] flex items-center justify-center text-[#fed65b] text-[12px] font-bold">{item.abbr}</div>
                          <span className="font-medium">{item.country}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 pr-10">
                        <span className="block font-medium text-[#00170d]">{item.policy}</span>
                        <span className="block text-[#414844] text-[12px] mt-0.5">{item.domain}</span>
                      </td>
                      <td className="py-4 px-4">{stageBadge(item.stage)}</td>
                      <td className="py-4 px-4 text-[#414844]">{item.lastAction}</td>
                      <td className="py-4 px-4 text-right">
                        <button aria-label="View Details" className="text-[#00170d] hover:bg-[#efeded] p-2 rounded-full transition-colors">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-[#414844]">
                        <span className="material-symbols-outlined text-[48px] text-[#c1c8c2] block mb-3">search_off</span>
                        No legislation matches the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="bg-[#00170d] rounded-xl p-6 text-white">
              <h3 className="text-[20px] font-semibold mb-1">Regional Summary</h3>
              <p className="text-[14px] text-[#abcfbb] mb-4">Across all 16 SADC member states</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Active Policies', value: '60' },
                  { label: 'Passed This Year', value: '14' },
                  { label: 'Under Review', value: '5' },
                  { label: 'In Consultation', value: '8' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center border-b border-[#0b2d20] pb-3 last:border-0 last:pb-0">
                    <span className="text-[14px] text-[#abcfbb]">{item.label}</span>
                    <span className="text-[20px] font-bold text-[#fed65b]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f5f3f3] rounded-xl p-6 border border-[#c1c8c2]/30">
              <h3 className="text-[20px] font-semibold text-[#00170d] mb-4">Top Active Domains</h3>
              {[
                { name: 'Maternal Health', count: 24, pct: 40 },
                { name: 'CSE', count: 18, pct: 30 },
                { name: 'GBV Prevention', count: 12, pct: 20 },
                { name: 'Budget Policy', count: 6, pct: 10 },
              ].map((d) => (
                <div key={d.name} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] font-semibold text-[#1b1c1c]">{d.name}</span>
                    <span className="text-[12px] font-semibold text-[#727974]">{d.count}</span>
                  </div>
                  <div className="w-full bg-[#eae8e7] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#00170d]" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
