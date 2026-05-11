'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

const subTabs = [
  { label: 'Overview', href: '/portal/budget' },
  { label: 'Activities', href: '/portal/budget/activities' },
  { label: 'Countries', href: '/portal/budget/countries' },
  { label: 'No-Spend', href: '/portal/budget/no-spend' },
  { label: 'Variance', href: '/portal/budget/variance' },
  { label: 'Reconciliation', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', href: '/portal/budget/priority-actions' },
]

type ReconciliationStatus = 'Matched' | 'Mismatch'

interface ReconciliationRow {
  code: string
  country: string
  activity: string
  sourceAValue: number
  sourceBValue: number
  issue: string
  owner: string
  lastUpdated: string
  status: ReconciliationStatus
}

const rows: ReconciliationRow[] = [
  {
    code: 'ACT-001',
    country: 'Kenya',
    activity: 'Regional policy advocacy workshops',
    sourceAValue: 45000,
    sourceBValue: 45000,
    issue: 'No discrepancy detected. Document and sheet totals are aligned.',
    owner: 'Finance Office',
    lastUpdated: '2 hours ago',
    status: 'Matched',
  },
  {
    code: 'ACT-042',
    country: 'Nigeria',
    activity: 'Community mobilisation grant disbursement',
    sourceAValue: 112400,
    sourceBValue: 121470.52,
    issue: 'Spreadsheet includes additional logistics charges not reflected in the uploaded source document.',
    owner: 'Regional Secretariat',
    lastUpdated: '36 minutes ago',
    status: 'Mismatch',
  },
  {
    code: 'ACT-015',
    country: 'Zambia',
    activity: 'Youth SRHR facility support',
    sourceAValue: 28500,
    sourceBValue: 28500,
    issue: 'Matched after final approval of the Q3 support schedule.',
    owner: 'Country Focal Point',
    lastUpdated: 'Yesterday',
    status: 'Matched',
  },
  {
    code: 'ACT-028',
    country: 'Tanzania',
    activity: 'Parliamentary oversight training',
    sourceAValue: 67200,
    sourceBValue: 67200,
    issue: 'No discrepancy detected. Figures cleared in the monthly finance review.',
    owner: 'Finance Office',
    lastUpdated: '4 hours ago',
    status: 'Matched',
  },
  {
    code: 'ACT-033',
    country: 'Zimbabwe',
    activity: 'District implementation monitoring',
    sourceAValue: 34750,
    sourceBValue: 34750,
    issue: 'Matched after bank transfer confirmation was attached.',
    owner: 'Country Focal Point',
    lastUpdated: 'Today',
    status: 'Matched',
  },
  {
    code: 'ACT-051',
    country: 'Malawi',
    activity: 'Evidence dissemination workshop',
    sourceAValue: 18420,
    sourceBValue: 17200,
    issue: 'Document reflects approved catering charges that are not yet booked in the ledger extract.',
    owner: 'Programme Manager',
    lastUpdated: '1 hour ago',
    status: 'Mismatch',
  },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function varianceValue(row: ReconciliationRow) {
  return row.sourceBValue - row.sourceAValue
}

function variancePct(row: ReconciliationRow) {
  if (row.sourceAValue === 0) return 0
  return (varianceValue(row) / row.sourceAValue) * 100
}

export default function ReconciliationPage() {
  const pathname = usePathname()
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [selectedStatus, setSelectedStatus] = useState<'All' | ReconciliationStatus>('Mismatch')
  const [search, setSearch] = useState('')
  const [selectedCode, setSelectedCode] = useState<string>(rows.find((row) => row.status === 'Mismatch')?.code ?? rows[0].code)

  const countries = ['All Countries', ...Array.from(new Set(rows.map((row) => row.country)))]

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesCountry = selectedCountry === 'All Countries' || row.country === selectedCountry
      const matchesStatus = selectedStatus === 'All' || row.status === selectedStatus
      const matchesSearch =
        query.length === 0 ||
        [row.code, row.country, row.activity, row.issue, row.owner].join(' ').toLowerCase().includes(query)

      return matchesCountry && matchesStatus && matchesSearch
    })
  }, [search, selectedCountry, selectedStatus])

  const selectedRow = filteredRows.find((row) => row.code === selectedCode) ?? filteredRows[0] ?? null

  const sourceATotal = filteredRows.reduce((sum, row) => sum + row.sourceAValue, 0)
  const sourceBTotal = filteredRows.reduce((sum, row) => sum + row.sourceBValue, 0)
  const mismatchRows = filteredRows.filter((row) => row.status === 'Mismatch')
  const differenceTotal = mismatchRows.reduce((sum, row) => sum + Math.abs(varianceValue(row)), 0)

  return (
    <div className="space-y-md min-w-0">
      <div className="space-y-sm">
        <h1 className="text-h1 font-h1 text-primary">Reconciliation</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Compare source documents against financial spreadsheet totals and resolve the items that are still out of sync.
        </p>
        <div className="flex flex-wrap gap-sm pb-xs border-b border-outline-variant mt-md">
          {subTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-sm py-xs text-label-lg font-label-lg whitespace-nowrap ${
                pathname === tab.href
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <Link
            href="/portal/budget/ai-insights"
            className="px-sm py-xs text-label-lg font-label-lg text-secondary border border-secondary rounded-full whitespace-nowrap flex items-center gap-xs hover:bg-surface-container-low transition-colors sm:ml-auto"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            AI Insights
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">description</span>
            <h3 className="text-label-lg font-label-lg">Source A Total</h3>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-xs relative z-10">Filtered document totals</p>
          <div className="text-h2 font-h2 text-primary relative z-10">{fmt(sourceATotal)}</div>
        </div>

        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">table_view</span>
            <h3 className="text-label-lg font-label-lg">Source B Total</h3>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-xs relative z-10">Filtered spreadsheet totals</p>
          <div className="text-h2 font-h2 text-primary relative z-10">{fmt(sourceBTotal)}</div>
        </div>

        <div className="bg-error-container p-md rounded-xl border border-error/20 shadow-[0_4px_24px_rgba(186,26,26,0.08)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-error">warning</span>
          </div>
          <div className="flex items-center justify-between mb-sm relative z-10 gap-sm flex-wrap">
            <div className="flex items-center gap-sm text-on-error-container">
              <span className="material-symbols-outlined">balance</span>
              <h3 className="text-label-lg font-label-lg">Open Difference</h3>
            </div>
            <span className="bg-error text-on-error text-label-md font-label-md px-2 py-1 rounded-full">
              {mismatchRows.length} issue{mismatchRows.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-error-container/80 mb-xs relative z-10">Unreconciled variance across the filtered register</p>
          <div className="text-h1 font-h1 text-error relative z-10 flex items-baseline gap-xs flex-wrap">
            {fmt(differenceTotal)}
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] overflow-hidden">
        <div className="p-md border-b border-outline-variant/50 bg-surface-container-lowest flex flex-col gap-md">
          <div className="flex justify-between items-center flex-wrap gap-sm">
            <h3 className="text-h3 font-h3 text-primary">Country Activity Reconciliation</h3>
            <div className="flex gap-sm flex-wrap justify-end">
              <button className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-xs text-label-md font-label-md">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-sm">
            <div className="md:col-span-2 relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity code, country, owner, issue..."
                className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant bg-surface text-sm outline-none focus:border-primary"
              />
            </div>

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
              <option value="Mismatch">Mismatch Only</option>
              <option value="Matched">Matched Only</option>
              <option value="All">All Records</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="overflow-hidden border-r border-outline-variant/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  <th className="p-sm border-b border-outline-variant/50 font-semibold">Activity</th>
                  <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source A</th>
                  <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source B</th>
                  <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Variance</th>
                  <th className="p-sm border-b border-outline-variant/50 font-semibold text-center">Status</th>
                  <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface divide-y divide-outline-variant/20">
                {filteredRows.map((row) => {
                  const variance = varianceValue(row)
                  const percentage = variancePct(row)
                  const active = selectedRow?.code === row.code

                  return (
                    <tr
                      key={row.code}
                      onClick={() => setSelectedCode(row.code)}
                      className={`cursor-pointer transition-colors ${
                        row.status === 'Mismatch' ? 'bg-error-container/10 hover:bg-error-container/15' : 'hover:bg-surface-container-lowest'
                      } ${active ? 'ring-1 ring-inset ring-primary/20 bg-primary-fixed/10' : ''}`}
                    >
                      <td className="p-sm">
                        <div className="min-w-0">
                          <p className={`font-mono text-sm ${row.status === 'Mismatch' ? 'text-error font-bold' : 'text-on-surface'}`}>{row.code}</p>
                          <p className="font-semibold text-on-surface">{row.country}</p>
                          <p className="text-xs text-on-surface-variant truncate">{row.activity}</p>
                        </div>
                      </td>
                      <td className="p-sm text-right text-sm">{fmt(row.sourceAValue)}</td>
                      <td className="p-sm text-right text-sm">{fmt(row.sourceBValue)}</td>
                      <td className={`p-sm text-right ${row.status === 'Mismatch' ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                        <div>{variance >= 0 ? '+' : '-'}{fmt(Math.abs(variance))}</div>
                        <div className="text-[11px] font-medium">{percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%</div>
                      </td>
                      <td className="p-sm text-center">
                        {row.status === 'Matched' ? (
                          <span className="inline-flex items-center gap-xs px-2 py-1 bg-primary-container/20 text-primary rounded-full text-label-md font-label-md">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-xs px-2 py-1 bg-error-container text-on-error-container rounded-full text-label-md font-label-md">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            Mismatch
                          </span>
                        )}
                      </td>
                      <td className="p-sm text-right">
                        <button className={`px-sm py-xs rounded-md border text-label-md font-label-md transition-colors ${
                          row.status === 'Mismatch'
                            ? 'text-primary border-primary hover:bg-primary/10'
                            : 'text-on-surface-variant border-outline-variant hover:bg-surface-container-low'
                        }`}>
                          {row.status === 'Mismatch' ? 'Reconcile' : 'View'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredRows.length === 0 && (
              <div className="px-md py-xl text-center text-sm text-on-surface-variant">
                No reconciliation rows match the current filters.
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest p-md flex flex-col gap-md">
            {selectedRow ? (
              <>
                <div className="flex items-start justify-between gap-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Selected Record</p>
                    <h4 className="text-xl font-bold text-on-surface mt-xs">{selectedRow.code}</h4>
                    <p className="text-sm text-on-surface-variant">{selectedRow.country} • {selectedRow.activity}</p>
                  </div>
                  <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-xs font-semibold ${
                    selectedRow.status === 'Mismatch'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-primary-container/20 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {selectedRow.status === 'Mismatch' ? 'error' : 'check_circle'}
                    </span>
                    {selectedRow.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div className="rounded-lg bg-surface p-md border border-outline-variant/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Source A</p>
                    <p className="text-lg font-bold text-on-surface mt-xs">{fmt(selectedRow.sourceAValue)}</p>
                  </div>
                  <div className="rounded-lg bg-surface p-md border border-outline-variant/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Source B</p>
                    <p className="text-lg font-bold text-on-surface mt-xs">{fmt(selectedRow.sourceBValue)}</p>
                  </div>
                </div>

                <div className={`rounded-xl p-md border ${
                  selectedRow.status === 'Mismatch'
                    ? 'bg-error-container/20 border-error/20'
                    : 'bg-primary-container/10 border-primary/10'
                }`}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Issue Summary</p>
                  <p className="text-sm text-on-surface mt-sm">{selectedRow.issue}</p>
                </div>

                <div className="space-y-sm">
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-on-surface-variant">Difference</span>
                    <span className={`font-bold ${selectedRow.status === 'Mismatch' ? 'text-error' : 'text-primary'}`}>
                      {varianceValue(selectedRow) >= 0 ? '+' : '-'}{fmt(Math.abs(varianceValue(selectedRow)))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-on-surface-variant">Variance %</span>
                    <span className={`font-bold ${selectedRow.status === 'Mismatch' ? 'text-error' : 'text-primary'}`}>
                      {variancePct(selectedRow) >= 0 ? '+' : ''}{variancePct(selectedRow).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-on-surface-variant">Owner</span>
                    <span className="font-semibold text-on-surface">{selectedRow.owner}</span>
                  </div>
                  <div className="flex items-center justify-between gap-sm text-sm">
                    <span className="text-on-surface-variant">Last Updated</span>
                    <span className="font-semibold text-on-surface">{selectedRow.lastUpdated}</span>
                  </div>
                </div>

                <div className="pt-sm border-t border-outline-variant/30 flex flex-col gap-sm">
                  <button className={`w-full px-md py-sm rounded-lg text-sm font-semibold transition-colors ${
                    selectedRow.status === 'Mismatch'
                      ? 'bg-primary text-on-primary hover:opacity-90'
                      : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low'
                  }`}>
                    {selectedRow.status === 'Mismatch' ? 'Open Reconciliation Workflow' : 'View Matched Record'}
                  </button>
                  <button className="w-full px-md py-sm rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                    Add Review Note
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-on-surface-variant">Select a reconciliation row to inspect its details.</div>
            )}
          </div>
        </div>

        <div className="p-sm border-t border-outline-variant/50 bg-surface-container-lowest flex justify-between items-center gap-sm flex-wrap">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing {filteredRows.length} of {rows.length} reconciliation records
          </p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            {mismatchRows.length} mismatch{mismatchRows.length === 1 ? '' : 'es'} require review
          </p>
        </div>
      </div>
    </div>
  )
}
