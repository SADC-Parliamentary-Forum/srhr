'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type AnalysisTab = 'visual' | 'matrix' | 'comparisons' | 'ai'
const TABS: { id: AnalysisTab; label: string; href: string }[] = [
  { id: 'visual', label: 'Visual Explorer', href: '/portal/analysis' },
  { id: 'matrix', label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { id: 'comparisons', label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { id: 'ai', label: 'AI Insights', href: '/portal/analysis/ai-insights' },
]

const COUNTRIES = ['All Countries', 'Kenya', 'Malawi', 'Tanzania', 'Zambia', 'Uganda', 'Zimbabwe']
const OUTCOMES = ['All Outcomes', 'O2 — Legal Frameworks', 'O3 — Budget', 'O4 — Youth Access', 'O5 — GBV']
const THEMES = ['All Themes', 'Maternal Health', 'Youth Health', 'Legislation', 'Financing']
const PERIODS = ['All Periods', 'Q1 2026', 'Q4 2025', 'Q3 2025', 'Annual 2025']

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
  const [country, setCountry] = useState('All Countries')
  const [outcome, setOutcome] = useState('All Outcomes')
  const [theme, setTheme] = useState('All Themes')
  const [period, setPeriod] = useState('All Periods')

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Analysis Workspace</h2>
          <p className="text-on-surface-variant mt-xs">Explore trends, build matrices, and generate AI-powered insights.</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            Save View
          </button>
          <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
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
              pathname === tab.href ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-lg">
        {/* Filter Sidebar */}
        <aside className="w-56 shrink-0 flex flex-col gap-md">
          <h3 className="text-sm font-semibold text-primary">Filters</h3>
          {[
            { label: 'Country / Region', value: country, options: COUNTRIES, setter: setCountry },
            { label: 'Primary Outcome', value: outcome, options: OUTCOMES, setter: setOutcome },
            { label: 'Theme', value: theme, options: THEMES, setter: setTheme },
            { label: 'Date Range', value: period, options: PERIODS, setter: setPeriod },
          ].map(({ label, value, options, setter }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">{label}</label>
              <select value={value} onChange={(e) => setter(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
