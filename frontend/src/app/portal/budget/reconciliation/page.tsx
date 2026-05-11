'use client'

import { useMemo, useState } from 'react'
import BudgetSubnav from '../_components/BudgetSubnav'

type ReconciliationStatus = 'Matched' | 'Mismatch'

interface ReconciliationRow {
  code: string
  country: string
  sourceAValue: number
  sourceBValue: number
  owner: string
  lastUpdated: string
  status: ReconciliationStatus
}

const rows: ReconciliationRow[] = [
  { code: 'ACT-001', country: 'Kenya', sourceAValue: 45000, sourceBValue: 45000, owner: 'Finance Office', lastUpdated: '2 hours ago', status: 'Matched' },
  { code: 'ACT-042', country: 'Nigeria', sourceAValue: 112400, sourceBValue: 121470.52, owner: 'Regional Secretariat', lastUpdated: '36 minutes ago', status: 'Mismatch' },
  { code: 'ACT-015', country: 'Zambia', sourceAValue: 28500, sourceBValue: 28500, owner: 'Country Focal Point', lastUpdated: 'Yesterday', status: 'Matched' },
  { code: 'ACT-028', country: 'Tanzania', sourceAValue: 67200, sourceBValue: 67200, owner: 'Finance Office', lastUpdated: '4 hours ago', status: 'Matched' },
  { code: 'ACT-033', country: 'Zimbabwe', sourceAValue: 34750, sourceBValue: 34750, owner: 'Country Focal Point', lastUpdated: 'Today', status: 'Matched' },
  { code: 'ACT-051', country: 'Malawi', sourceAValue: 18420, sourceBValue: 17200, owner: 'Programme Manager', lastUpdated: '1 hour ago', status: 'Mismatch' },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function varianceValue(row: ReconciliationRow) {
  return row.sourceAValue - row.sourceBValue
}

export default function ReconciliationPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [selectedStatus, setSelectedStatus] = useState<'All' | ReconciliationStatus>('All')

  const countries = ['All Countries', ...Array.from(new Set(rows.map((row) => row.country)))]

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesCountry = selectedCountry === 'All Countries' || row.country === selectedCountry
      const matchesStatus = selectedStatus === 'All' || row.status === selectedStatus
      const matchesSearch =
        query.length === 0 || [row.code, row.country, row.owner].join(' ').toLowerCase().includes(query)

      return matchesCountry && matchesStatus && matchesSearch
    })
  }, [search, selectedCountry, selectedStatus])

  const sourceATotal = filteredRows.reduce((sum, row) => sum + row.sourceAValue, 0)
  const sourceBTotal = filteredRows.reduce((sum, row) => sum + row.sourceBValue, 0)
  const totalDifference = filteredRows.reduce((sum, row) => sum + Math.abs(varianceValue(row)), 0)

  return (
    <div className="space-y-md min-w-0">
      <div className="space-y-sm">
        <h1 className="text-h1 font-h1 text-primary">Reconciliation</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Analyze discrepancies between reported source documents and financial spreadsheets.
        </p>

        <BudgetSubnav />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">description</span>
            <h3 className="font-label-lg text-label-lg">Source A Total</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs relative z-10">Status Document (Country Activity)</p>
          <div className="font-h2 text-h2 text-primary relative z-10">{fmt(sourceATotal)}</div>
        </div>

        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">table_view</span>
            <h3 className="font-label-lg text-label-lg">Source B Total</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs relative z-10">Financial Spreadsheet (Aggregated)</p>
          <div className="font-h2 text-h2 text-primary relative z-10">{fmt(sourceBTotal)}</div>
        </div>

        <div className="bg-error-container p-md rounded-xl border border-error/20 shadow-[0_4px_24px_rgba(186,26,26,0.08)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-error">warning</span>
          </div>
          <div className="flex items-center justify-between mb-sm relative z-10 gap-sm flex-wrap">
            <div className="flex items-center gap-sm text-on-error-container">
              <span className="material-symbols-outlined">balance</span>
              <h3 className="font-label-lg text-label-lg">Total Difference</h3>
            </div>
            <span className="bg-error text-on-error font-label-md text-label-md px-2 py-1 rounded-full">Requires Review</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-error-container/80 mb-xs relative z-10">Unreconciled Variance</p>
          <div className="font-h1 text-h1 text-error relative z-10 flex items-baseline gap-xs flex-wrap">
            {fmt(totalDifference)}
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] overflow-hidden">
        <div className="p-md border-b border-outline-variant/50 flex justify-between items-center flex-wrap gap-sm bg-surface-container-lowest">
          <h3 className="font-h3 text-h3 text-primary">Country Activity Reconciliation</h3>
          <div className="flex gap-sm flex-wrap">
            <button
              onClick={() => setFiltersOpen((current) => !current)}
              className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-xs font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-xs font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="p-md border-b border-outline-variant/50 bg-surface-container-lowest">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code, country or owner"
                className="px-md py-sm rounded-lg border border-outline-variant bg-surface text-sm outline-none focus:border-primary"
              />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-md py-sm rounded-lg border border-outline-variant bg-surface text-sm outline-none focus:border-primary"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'All' | ReconciliationStatus)}
                className="px-md py-sm rounded-lg border border-outline-variant bg-surface text-sm outline-none focus:border-primary"
              >
                <option value="All">All Records</option>
                <option value="Mismatch">Mismatch Only</option>
                <option value="Matched">Matched Only</option>
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                <th className="p-sm border-b border-outline-variant/50 font-semibold">Activity Code</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold">Country</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source A (Doc)</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source B (Sheet)</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Variance</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-center">Status</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/20">
              {filteredRows.map((row) => {
                const variance = varianceValue(row)
                const mismatch = row.status === 'Mismatch'

                return (
                  <tr
                    key={row.code}
                    className={`hover:bg-surface-container-lowest transition-colors ${mismatch ? 'bg-error-container/10' : ''}`}
                  >
                    <td className={`p-sm font-ussd-mono ${mismatch ? 'text-error font-bold' : ''}`}>{row.code}</td>
                    <td className={`p-sm ${mismatch ? 'font-semibold' : ''}`}>
                      <div className="flex flex-col">
                        <span>{row.country}</span>
                        <span className="text-xs text-on-surface-variant">{row.owner} • {row.lastUpdated}</span>
                      </div>
                    </td>
                    <td className={`p-sm text-right ${mismatch ? 'font-ussd-mono' : ''}`}>{fmt(row.sourceAValue)}</td>
                    <td className={`p-sm text-right ${mismatch ? 'font-ussd-mono' : ''}`}>{fmt(row.sourceBValue)}</td>
                    <td className={`p-sm text-right ${mismatch ? 'text-error font-bold font-ussd-mono' : 'text-on-surface-variant'}`}>
                      {variance >= 0 ? '+' : '-'}{fmt(Math.abs(variance))}
                    </td>
                    <td className="p-sm text-center">
                      {mismatch ? (
                        <span className="inline-flex items-center gap-xs px-2 py-1 bg-error-container text-on-error-container rounded-full font-label-md text-label-md">
                          <span className="material-symbols-outlined text-[14px]">error</span> Mismatch
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-xs px-2 py-1 bg-primary-container/20 text-primary rounded-full font-label-md text-label-md">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Matched
                        </span>
                      )}
                    </td>
                    <td className="p-sm text-right">
                      {mismatch ? (
                        <button className="text-primary hover:bg-primary/10 transition-colors px-sm py-xs rounded-md border border-primary font-label-md text-label-md">
                          Reconcile
                        </button>
                      ) : (
                        <button className="text-on-surface-variant hover:text-primary transition-colors p-xs" title="View Details">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-sm border-t border-outline-variant/50 bg-surface-container-lowest flex justify-between items-center gap-sm flex-wrap">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Showing 1 to {filteredRows.length} of {rows.length} entries
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {filteredRows.filter((row) => row.status === 'Mismatch').length} mismatches in current view
          </p>
        </div>
      </div>
    </div>
  )
}
