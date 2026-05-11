'use client'

import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { label: 'Visual Explorer', href: '/portal/analysis' },
  { label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { label: 'AI Insights', href: '/portal/analysis/ai-insights' },
]

const AVAILABLE_COUNTRIES = ['Malawi', 'Kenya', 'Tanzania', 'Zambia', 'Uganda', 'Zimbabwe', 'Mozambique', 'Botswana']
const METRICS = ['SRHR Composite Score', 'Maternal Mortality Rate', 'Contraceptive Prevalence', 'Youth Health Access']
const PERIODS = ['Q1 2026', 'Q4 2025', 'Annual 2025']

interface CountryData {
  name: string
  emoji: string
  score: number
  metrics: { label: string; value: string; trend: string; up: boolean }[]
  color: string
}

const countryDataMap: Record<string, CountryData> = {
  Malawi: {
    name: 'Malawi', emoji: '🇲🇼', score: 72,
    metrics: [
      { label: 'Maternal Mortality', value: '380', trend: '-15%', up: true },
      { label: 'Contraceptive Prev.', value: '41%', trend: '+9%', up: true },
      { label: 'Youth Access', value: '68%', trend: '+5%', up: true },
    ],
    color: 'bg-primary',
  },
  Kenya: {
    name: 'Kenya', emoji: '🇰🇪', score: 85,
    metrics: [
      { label: 'Maternal Mortality', value: '195', trend: '-22%', up: true },
      { label: 'Contraceptive Prev.', value: '58%', trend: '+11%', up: true },
      { label: 'Youth Access', value: '82%', trend: '+8%', up: true },
    ],
    color: 'bg-secondary',
  },
  Tanzania: {
    name: 'Tanzania', emoji: '🇹🇿', score: 61,
    metrics: [
      { label: 'Maternal Mortality', value: '340', trend: '-8%', up: true },
      { label: 'Contraceptive Prev.', value: '32%', trend: '+4%', up: true },
      { label: 'Youth Access', value: '54%', trend: '-2%', up: false },
    ],
    color: 'bg-primary-container',
  },
}

export default function ComparisonsPage() {
  const [selected, setSelected] = useState<string[]>(['Malawi', 'Kenya'])
  const [metric, setMetric] = useState(METRICS[0])
  const [period, setPeriod] = useState(PERIODS[0])

  const toggleCountry = (c: string) => {
    if (selected.includes(c)) {
      setSelected((prev) => prev.filter((x) => x !== c))
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, c])
    }
  }

  const displayedData = selected.map((c) => countryDataMap[c]).filter(Boolean)

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Comparison Insights</h2>
          <p className="text-on-surface-variant mt-xs">Compare up to 3 countries across SRHR metrics.</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">description</span>
            Export Report
          </button>
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share View
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-outline-variant flex gap-lg text-sm font-semibold">
        {TABS.map((tab) => (
          <Link key={tab.label} href={tab.href} className={`pb-sm border-b-2 transition-colors whitespace-nowrap ${tab.href === '/portal/analysis/comparisons' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md">
        <div className="flex flex-wrap gap-sm items-center">
          <span className="text-xs font-semibold text-on-surface-variant">Countries (max 3):</span>
          {AVAILABLE_COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCountry(c)}
              className={`px-sm py-xs rounded-full text-sm font-semibold transition-colors ${
                selected.includes(c)
                  ? 'bg-primary text-on-primary'
                  : selected.length >= 3
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-md flex-wrap">
          <div className="flex items-center gap-sm">
            <label className="text-xs font-semibold text-on-surface-variant">Metric</label>
            <select value={metric} onChange={(e) => setMetric(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
              {METRICS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-sm">
            <label className="text-xs font-semibold text-on-surface-variant">Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      {displayedData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {displayedData.map((data) => (
            <div key={data.name} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-md">
              <div className="flex items-center gap-sm">
                <span className="text-4xl">{data.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-primary">{data.name}</h3>
                  <p className="text-xs text-on-surface-variant">SRHR Composite</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-2xl font-black text-primary">{data.score}</span>
                  <span className="text-xs text-on-surface-variant block">/ 100</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className={`${data.color} h-2 rounded-full transition-all`} style={{ width: `${data.score}%` }} />
              </div>
              <div className="flex flex-col gap-sm">
                {data.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">{m.label}</span>
                    <div className="flex items-center gap-xs">
                      <span className="text-sm font-semibold text-on-surface">{m.value}</span>
                      <span className={`text-xs font-semibold flex items-center ${m.up ? 'text-primary' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[12px]">{m.up ? 'arrow_upward' : 'arrow_downward'}</span>
                        {m.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md">compare</span>
          <p>Select countries above to compare</p>
        </div>
      )}

      {/* Grouped Bar Chart Placeholder */}
      {displayedData.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md">
          <h3 className="text-base font-semibold text-primary mb-md">Grouped Comparison: {metric}</h3>
          <div className="bg-surface-container-low rounded-xl border border-dashed border-outline-variant h-48 flex items-center justify-center gap-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">bar_chart</span>
            <p className="text-sm">Grouped Bar Chart — {selected.join(' vs ')}</p>
          </div>
        </div>
      )}

      {/* Insight Callout */}
      {displayedData.length >= 2 && (
        <div className="bg-primary-fixed rounded-xl p-md border border-primary/10 flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary text-[20px] mt-xs shrink-0">lightbulb</span>
          <div>
            <h4 className="text-sm font-bold text-primary mb-xs">Auto-generated Insight</h4>
            <p className="text-sm text-on-surface">
              Kenya outperforms {selected.filter((c) => c !== 'Kenya')[0] ?? 'other countries'} across most SRHR metrics, with particularly strong performance in contraceptive prevalence (+{Math.abs(85 - 72)}pts). Malawi shows faster improvement trends in maternal health (-15% vs -8%).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
