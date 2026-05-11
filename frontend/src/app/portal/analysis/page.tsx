'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type AnalysisTab = 'visual' | 'matrix' | 'comparisons' | 'ai'
const TABS: { id: AnalysisTab; label: string; href: string }[] = [
  { id: 'visual', label: 'Visual Explorer', href: '/portal/analysis' },
  { id: 'matrix', label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { id: 'comparisons', label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { id: 'ai', label: 'AI Insights', href: '/portal/analysis/ai-insights' },
]

interface MetadataCountry {
  id: number
  name: string
}

interface MetadataPeriod {
  id: number
  name: string
  label?: string
}

interface EvidenceMetadata {
  countries: MetadataCountry[]
  periods: MetadataPeriod[]
  indicators: unknown[]
  evidence_types: unknown[]
}

const OUTCOMES = ['All Outcomes', 'O2 — Legal Frameworks', 'O3 — Budget', 'O4 — Youth Access', 'O5 — GBV']
const THEMES = ['All Themes', 'Maternal Health', 'Youth Health', 'Legislation', 'Financing']

const chartBentos = [
  { title: 'SRHR Progress by Outcome', icon: 'bar_chart', desc: 'Bar Chart' },
  { title: 'Trend Over Time', icon: 'show_chart', desc: 'Line Chart' },
  { title: 'SADC Regional Map', icon: 'map', desc: 'Choropleth Map — countries shaded by score' },
  { title: 'Key Insights', icon: 'lightbulb', desc: 'Top findings', isInsights: true },
]

const insights = [
  { label: 'Malawi leads in budget allocation (+4%)', color: 'bg-primary-fixed text-on-primary-fixed' },
  { label: 'Youth access declining in 3 countries', color: 'bg-error-container text-on-error-container' },
  { label: 'Legal frameworks improved SADC-wide', color: 'bg-primary-fixed text-on-primary-fixed' },
]

export default function AnalysisPage() {
  const pathname = usePathname()

  const [countries, setCountries] = useState<string[]>(['All Countries'])
  const [periods, setPeriods] = useState<string[]>(['All Periods'])
  const [metaLoading, setMetaLoading] = useState(true)

  const [country, setCountry] = useState('All Countries')
  const [outcome, setOutcome] = useState('All Outcomes')
  const [theme, setTheme] = useState('All Themes')
  const [period, setPeriod] = useState('All Periods')

  useEffect(() => {
    const token = getToken()
    if (!token) { setMetaLoading(false); return }
    api.get<EvidenceMetadata>('/portal/evidence/metadata', token)
      .then((meta) => {
        if (meta.countries?.length) {
          setCountries(['All Countries', ...meta.countries.map((c) => c.name)])
        }
        if (meta.periods?.length) {
          setPeriods(['All Periods', ...meta.periods.map((p) => p.label ?? p.name)])
        }
      })
      .catch(() => {/* keep defaults */})
      .finally(() => setMetaLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#00170d]">Analysis Workspace</h2>
          <p className="text-on-surface-variant mt-xs">Explore trends, build matrices, and generate AI-powered insights.</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-[#00170d] transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            Save View
          </button>
          <button className="px-md py-sm rounded-full bg-[#fed65b] text-[#00170d] text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-outline-variant flex gap-lg text-sm font-semibold">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`pb-sm border-b-2 transition-colors whitespace-nowrap ${
              pathname === tab.href ? 'border-[#00170d] text-[#00170d]' : 'border-transparent text-on-surface-variant hover:text-[#00170d]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-lg">
        {/* Filter Sidebar */}
        <aside className="w-56 shrink-0 flex flex-col gap-md">
          <h3 className="text-sm font-semibold text-[#00170d]">Filters</h3>
          {metaLoading ? (
            <div className="flex items-center gap-xs text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              Loading filters…
            </div>
          ) : (
            <>
              {[
                { label: 'Country / Region', value: country, options: countries, setter: setCountry },
                { label: 'Primary Outcome', value: outcome, options: OUTCOMES, setter: setOutcome },
                { label: 'Theme', value: theme, options: THEMES, setter: setTheme },
                { label: 'Date Range', value: period, options: periods, setter: setPeriod },
              ].map(({ label, value, options, setter }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">{label}</label>
                  <select value={value} onChange={(e) => setter(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-[#00170d]">
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </>
          )}

          {/* Active filter summary */}
          {(country !== 'All Countries' || outcome !== 'All Outcomes' || theme !== 'All Themes' || period !== 'All Periods') && (
            <div className="mt-sm p-sm bg-surface-container rounded-lg">
              <p className="text-xs font-semibold text-[#00170d] mb-xs">Active Filters</p>
              <div className="flex flex-col gap-xs">
                {country !== 'All Countries' && <span className="text-xs text-on-surface-variant">{country}</span>}
                {outcome !== 'All Outcomes' && <span className="text-xs text-on-surface-variant">{outcome}</span>}
                {theme !== 'All Themes' && <span className="text-xs text-on-surface-variant">{theme}</span>}
                {period !== 'All Periods' && <span className="text-xs text-on-surface-variant">{period}</span>}
              </div>
              <button onClick={() => { setCountry('All Countries'); setOutcome('All Outcomes'); setTheme('All Themes'); setPeriod('All Periods') }} className="mt-sm text-xs text-error font-semibold hover:underline">
                Clear all
              </button>
            </div>
          )}
        </aside>

        {/* Charts Bento Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-md">
          {chartBentos.map((chart) => (
            <div key={chart.title} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md min-h-[240px] flex flex-col">
              <h3 className="text-base font-semibold text-on-surface mb-md">{chart.title}</h3>
              {chart.isInsights ? (
                <div className="flex-1 flex flex-col gap-sm justify-center">
                  {insights.map((ins) => (
                    <span key={ins.label} className={`text-xs font-semibold px-sm py-xs rounded-full ${ins.color}`}>
                      {ins.label}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex-1 bg-surface-container-low rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center gap-sm">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant">{chart.icon}</span>
                  <p className="text-sm text-on-surface-variant">{chart.desc}</p>
                  {(country !== 'All Countries' || period !== 'All Periods') && (
                    <p className="text-xs text-on-surface-variant/70 text-center px-sm">
                      Filtered: {[country !== 'All Countries' && country, period !== 'All Periods' && period].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
