'use client'

import Link from 'next/link'

const subTabs = [
  { label: 'Overview', href: '/portal/budget' },
  { label: 'Activities', href: '/portal/budget/activities' },
  { label: 'Countries', href: '/portal/budget/countries' },
  { label: 'No-Spend', href: '/portal/budget/no-spend' },
  { label: 'Variance', href: '/portal/budget/variance' },
  { label: 'Reconciliation', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', href: '/portal/budget/priority-actions' },
]

interface ReconciliationRow {
  code: string
  country: string
  sourceA: string
  sourceB: string
  variance: string
  status: 'Matched' | 'Mismatch'
}

const rows: ReconciliationRow[] = [
  { code: 'ACT-001', country: 'Kenya', sourceA: '$45,000.00', sourceB: '$45,000.00', variance: '$0.00', status: 'Matched' },
  { code: 'ACT-042', country: 'Nigeria', sourceA: '$112,400.00', sourceB: '$121,470.52', variance: '-$9,070.52', status: 'Mismatch' },
  { code: 'ACT-015', country: 'Rwanda', sourceA: '$28,500.00', sourceB: '$28,500.00', variance: '$0.00', status: 'Matched' },
  { code: 'ACT-028', country: 'Tanzania', sourceA: '$67,200.00', sourceB: '$67,200.00', variance: '$0.00', status: 'Matched' },
  { code: 'ACT-033', country: 'Zimbabwe', sourceA: '$34,750.00', sourceB: '$34,750.00', variance: '$0.00', status: 'Matched' },
]

export default function ReconciliationPage() {
  return (
    <div className="space-y-md min-w-0">
      <div className="space-y-sm">
        <h1 className="text-h1 font-h1 text-primary">Reconciliation</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Analyze discrepancies between reported source documents and financial spreadsheets.
        </p>
        <div className="flex flex-wrap gap-sm pb-xs border-b border-outline-variant mt-md">
          {subTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-sm py-xs text-label-lg font-label-lg whitespace-nowrap ${
                tab.label === 'Reconciliation'
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">description</span>
            <h3 className="text-label-lg font-label-lg">Source A Total</h3>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-xs relative z-10">Status Document (Country Activity)</p>
          <div className="text-h2 font-h2 text-primary relative z-10">US$ 1,245,600.00</div>
        </div>

        <div className="bg-surface p-md rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-highest rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-sm mb-sm text-on-surface-variant relative z-10">
            <span className="material-symbols-outlined">table_view</span>
            <h3 className="text-label-lg font-label-lg">Source B Total</h3>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-xs relative z-10">Financial Spreadsheet (Aggregated)</p>
          <div className="text-h2 font-h2 text-primary relative z-10">US$ 1,254,670.52</div>
        </div>

        <div className="bg-error-container p-md rounded-xl border border-error/20 shadow-[0_4px_24px_rgba(186,26,26,0.08)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-error">warning</span>
          </div>
          <div className="flex items-center justify-between mb-sm relative z-10">
            <div className="flex items-center gap-sm text-on-error-container">
              <span className="material-symbols-outlined">balance</span>
              <h3 className="text-label-lg font-label-lg">Total Difference</h3>
            </div>
            <span className="bg-error text-on-error text-label-md font-label-md px-2 py-1 rounded-full">Requires Review</span>
          </div>
          <p className="text-body-sm font-body-sm text-on-error-container/80 mb-xs relative z-10">Unreconciled Variance</p>
          <div className="text-h1 font-h1 text-error relative z-10 flex items-baseline gap-xs">
            US$ 9,070.52
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,23,13,0.04)] overflow-hidden">
        <div className="p-md border-b border-outline-variant/50 flex justify-between items-center flex-wrap gap-sm bg-surface-container-lowest">
          <h3 className="text-h3 font-h3 text-primary">Country Activity Reconciliation</h3>
          <div className="flex gap-sm flex-wrap justify-end">
            <button className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-xs text-label-md font-label-md">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
            <button className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-xs text-label-md font-label-md">
              <span className="material-symbols-outlined text-[18px]">download</span> Export
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                <th className="p-sm border-b border-outline-variant/50 font-semibold">Activity Code</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold">Country</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source A (Doc)</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Source B (Sheet)</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Variance</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-center">Status</th>
                <th className="p-sm border-b border-outline-variant/50 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-body-md font-body-md text-on-surface divide-y divide-outline-variant/20">
              {rows.map((row) => (
                <tr
                  key={row.code}
                  className={`hover:bg-surface-container-lowest transition-colors ${
                    row.status === 'Mismatch' ? 'bg-error-container/10' : ''
                  }`}
                >
                  <td className={`p-sm font-ussd-mono ${row.status === 'Mismatch' ? 'text-error font-bold' : ''}`}>
                    {row.code}
                  </td>
                  <td className={`p-sm ${row.status === 'Mismatch' ? 'font-semibold' : ''}`}>{row.country}</td>
                  <td className={`p-sm text-right ${row.status === 'Mismatch' ? 'font-ussd-mono' : ''}`}>{row.sourceA}</td>
                  <td className={`p-sm text-right ${row.status === 'Mismatch' ? 'font-ussd-mono' : ''}`}>{row.sourceB}</td>
                  <td className={`p-sm text-right ${row.status === 'Mismatch' ? 'text-error font-bold font-ussd-mono' : 'text-on-surface-variant'}`}>
                    {row.variance}
                  </td>
                  <td className="p-sm text-center">
                    {row.status === 'Matched' ? (
                      <span className="inline-flex items-center gap-xs px-2 py-1 bg-primary-container/20 text-primary rounded-full text-label-md font-label-md">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-xs px-2 py-1 bg-error-container text-on-error-container rounded-full text-label-md font-label-md">
                        <span className="material-symbols-outlined text-[14px]">error</span> Mismatch
                      </span>
                    )}
                  </td>
                  <td className="p-sm text-right">
                    {row.status === 'Matched' ? (
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-xs" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    ) : (
                      <button className="text-primary hover:bg-primary/10 transition-colors px-sm py-xs rounded-md border border-primary text-label-md font-label-md">
                        Reconcile
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-sm border-t border-outline-variant/50 bg-surface-container-lowest flex justify-end">
          <p className="text-body-sm font-body-sm text-on-surface-variant">Showing 1 to 5 of 45 entries</p>
        </div>
      </div>
    </div>
  )
}
