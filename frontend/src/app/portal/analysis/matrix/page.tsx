'use client'

import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { label: 'Visual Explorer', href: '/portal/analysis' },
  { label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { label: 'AI Insights', href: '/portal/analysis/ai-insights' },
]

const rows = ['Malawi', 'Kenya', 'Tanzania', 'Zambia', 'Uganda', 'Zimbabwe']
const cols = ['O2.1', 'O2.2', 'O3.1', 'O3.2', 'O4.1', 'O4.2', 'O5.1', 'O5.2']

const cellData: Record<string, number> = {
  'Malawi-O2.1': 4, 'Malawi-O2.2': 7, 'Malawi-O3.1': 11.2, 'Malawi-O3.2': 6, 'Malawi-O4.1': 82, 'Malawi-O4.2': 15, 'Malawi-O5.1': 280, 'Malawi-O5.2': 45,
  'Kenya-O2.1': 6, 'Kenya-O2.2': 9, 'Kenya-O3.1': 13.5, 'Kenya-O3.2': 8, 'Kenya-O4.1': 91, 'Kenya-O4.2': 22, 'Kenya-O5.1': 195, 'Kenya-O5.2': 38,
  'Tanzania-O2.1': 3, 'Tanzania-O2.2': 5, 'Tanzania-O3.1': 9.8, 'Tanzania-O3.2': 4, 'Tanzania-O4.1': 68, 'Tanzania-O4.2': 12, 'Tanzania-O5.1': 340, 'Tanzania-O5.2': 52,
  'Zambia-O2.1': 5, 'Zambia-O2.2': 8, 'Zambia-O3.1': 10.1, 'Zambia-O3.2': 5, 'Zambia-O4.1': 75, 'Zambia-O4.2': 18, 'Zambia-O5.1': 220, 'Zambia-O5.2': 41,
  'Uganda-O2.1': 2, 'Uganda-O2.2': 4, 'Uganda-O3.1': 8.5, 'Uganda-O3.2': 3, 'Uganda-O4.1': 60, 'Uganda-O4.2': 10, 'Uganda-O5.1': 380, 'Uganda-O5.2': 60,
  'Zimbabwe-O2.1': 7, 'Zimbabwe-O2.2': 10, 'Zimbabwe-O3.1': 14.2, 'Zimbabwe-O3.2': 9, 'Zimbabwe-O4.1': 88, 'Zimbabwe-O4.2': 20, 'Zimbabwe-O5.1': 160, 'Zimbabwe-O5.2': 30,
}

const maxVals: Record<string, number> = {}
cols.forEach((col) => {
  maxVals[col] = Math.max(...rows.map((r) => cellData[`${r}-${col}`] ?? 0))
})

function getHeatmapBg(val: number, max: number): string {
  const ratio = max > 0 ? val / max : 0
  if (ratio >= 0.8) return 'bg-primary text-on-primary'
  if (ratio >= 0.6) return 'bg-primary-container text-on-primary-container'
  if (ratio >= 0.4) return 'bg-inverse-primary text-primary'
  if (ratio >= 0.2) return 'bg-primary-fixed text-on-primary-fixed'
  return 'bg-primary-fixed/30 text-primary'
}

export default function MatrixBuilderPage() {
  const [rowDim, setRowDim] = useState('Country')
  const [colDim, setColDim] = useState('Indicator Code')
  const [metric, setMetric] = useState('Reported Value')
  const [comparison, setComparison] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Matrix Builder</h2>
          <p className="text-on-surface-variant mt-xs">Build pivot tables with heat-map visualization.</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Configure View
          </button>
          <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-outline-variant flex gap-lg text-sm font-semibold">
        {TABS.map((tab) => (
          <Link key={tab.label} href={tab.href} className={`pb-sm border-b-2 transition-colors whitespace-nowrap ${tab.href === '/portal/analysis/matrix' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-md flex-wrap bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm">
        <div className="flex items-center gap-sm">
          <label className="text-xs font-semibold text-on-surface-variant">Row</label>
          <select value={rowDim} onChange={(e) => setRowDim(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
            <option>Country</option>
            <option>Outcome</option>
            <option>Period</option>
          </select>
        </div>
        <div className="flex items-center gap-sm">
          <label className="text-xs font-semibold text-on-surface-variant">Column</label>
          <select value={colDim} onChange={(e) => setColDim(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
            <option>Indicator Code</option>
            <option>Period</option>
            <option>Country</option>
          </select>
        </div>
        <div className="flex items-center gap-sm">
          <label className="text-xs font-semibold text-on-surface-variant">Value</label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
            <option>Reported Value</option>
            <option>% of Target</option>
            <option>Trend</option>
          </select>
        </div>
        <label className="flex items-center gap-sm cursor-pointer ml-auto">
          <input type="checkbox" checked={comparison} onChange={(e) => setComparison(e.target.checked)} className="text-primary rounded" />
          <span className="text-sm font-semibold text-on-surface">Comparison Mode</span>
        </label>
      </div>

      {/* Heat Map Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm sticky left-0 bg-surface-container-low z-10 min-w-[100px]">
                  {rowDim}
                </th>
                {cols.map((col) => (
                  <th key={col} className="text-center text-xs font-semibold text-on-surface-variant px-md py-sm min-w-[80px]">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row} className="border-t border-outline-variant/20">
                  <td className="px-md py-sm text-sm font-semibold text-on-surface sticky left-0 bg-surface-container-lowest z-10">{row}</td>
                  {cols.map((col) => {
                    const key = `${row}-${col}`
                    const val = cellData[key] ?? 0
                    const isHovered = hovered === key
                    return (
                      <td
                        key={col}
                        className="text-center px-xs py-sm relative"
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <span className={`text-xs font-semibold px-sm py-xs rounded-lg inline-block cursor-default transition-transform ${getHeatmapBg(val, maxVals[col])} ${isHovered ? 'scale-110' : ''}`}>
                          {val}
                        </span>
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs rounded-lg px-sm py-xs whitespace-nowrap z-20 shadow-lg mb-xs pointer-events-none">
                            {row}: {col} = {val}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
