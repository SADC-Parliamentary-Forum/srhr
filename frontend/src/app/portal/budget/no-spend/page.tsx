'use client'

import { useState } from 'react'
import BudgetSubnav from '../_components/BudgetSubnav'

const dormantCountries = [
  { country: 'Angola', allocated: 45000, spend: 0 },
  { country: 'South Africa', allocated: 38000, spend: 0 },
  { country: 'Madagascar', allocated: 22000, spend: 0 },
  { country: 'Mozambique', allocated: 18000, spend: 0 },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function NoSpendPage() {
  const [exportMessage, setExportMessage] = useState<string | null>(null)
  const dormantAllocation = dormantCountries.reduce((sum, row) => sum + row.allocated, 0)

  function exportNoSpendData() {
    downloadCsv('budget-no-spend.csv', [
      ['Country', 'Allocated Budget', 'Recorded Spend', 'Status'],
      ...dormantCountries.map((row) => [row.country, fmt(row.allocated), fmt(row.spend), 'No Activity']),
      ['Total', fmt(dormantAllocation), fmt(0), 'Dormant allocation'],
    ])

    setExportMessage('No-spend data exported.')
    window.setTimeout(() => setExportMessage(null), 2500)
  }

  return (
    <div className="p-lg flex flex-col gap-lg min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-sm font-bold text-on-surface">Regional Budget Reports</h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Countries with recorded zero expenditure during the current financial period. Immediate follow-up is required to unlock dormant allocations.
          </p>
        </div>
        <div className="flex gap-sm flex-wrap shrink-0 self-start">
          <button className="flex items-center gap-sm bg-primary text-secondary-fixed rounded-full px-lg py-sm text-sm font-semibold hover:opacity-90 transition-opacity">
            Request Country Update
          </button>
          <button
            onClick={exportNoSpendData}
            className="flex items-center gap-sm rounded-full border border-outline-variant px-lg py-sm text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export No-Spend Data
          </button>
        </div>
      </div>

      {exportMessage ? (
        <div className="rounded-xl border border-primary/15 bg-primary-fixed/10 px-md py-sm text-sm text-[#00170d]">
          {exportMessage}
        </div>
      ) : null}

      {/* Sub-tabs */}
      <BudgetSubnav />

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left: Summary card */}
        <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-lg border border-outline-variant flex flex-col gap-md">
          <p className="text-label-md font-semibold text-on-surface-variant">Recorded Spend (Target: &gt;$0)</p>
          <p className="text-display-lg font-bold text-primary">US$ 0</p>
          <div className="border-t border-outline-variant pt-md flex flex-col gap-sm">
            <p className="text-body-sm text-on-surface-variant">Across 4 unutilized countries</p>
            <span className="self-start inline-flex items-center gap-xs bg-error-container text-on-error-container px-md py-xs rounded-full text-xs font-semibold">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              Critical Alert
            </span>
          </div>
          <div className="bg-error-container/20 rounded-lg p-md text-body-sm text-on-surface-variant">
            Combined dormant allocation of{' '}
            <span className="font-semibold text-on-surface">{fmt(dormantAllocation)}</span>{' '}
            remains untouched. Immediate intervention recommended.
          </div>
        </div>

        {/* Right: Dormant Allocations table */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant bg-surface-container">
            <h3 className="text-title-md font-semibold text-on-surface">Dormant Allocations</h3>
            <p className="text-label-sm text-on-surface-variant">Countries with zero expenditure recorded</p>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Country</th>
                  <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Allocated Budget</th>
                  <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Recorded Spend</th>
                  <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {dormantCountries.map((row) => (
                  <tr key={row.country} className="border-b border-outline-variant last:border-0 bg-error-container/5 hover:bg-error-container/10 transition-colors">
                    <td className="px-md py-md font-semibold text-on-surface">{row.country}</td>
                    <td className="px-md py-md text-right text-on-surface">{fmt(row.allocated)}</td>
                    <td className="px-md py-md text-right font-bold text-error">US$ 0.00</td>
                    <td className="px-md py-md">
                      <span className="inline-flex items-center gap-xs bg-error-container text-on-error-container px-md py-xs rounded-full text-xs font-semibold">
                        <span
                          className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          money_off
                        </span>
                        No Activity
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-outline-variant bg-surface-container">
                  <td className="px-md py-sm font-bold text-on-surface">Total</td>
                  <td className="px-md py-sm text-right font-bold text-on-surface">{fmt(dormantAllocation)}</td>
                  <td className="px-md py-sm text-right font-bold text-error">US$ 0.00</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
