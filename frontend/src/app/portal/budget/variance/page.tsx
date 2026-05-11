'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const subTabs = [
  { label: 'Overview', href: '/portal/budget' },
  { label: 'Activities', href: '/portal/budget/activities' },
  { label: 'Countries', href: '/portal/budget/countries' },
  { label: 'No-Spend', href: '/portal/budget/no-spend' },
  { label: 'Variance', href: '/portal/budget/variance' },
  { label: 'Reconciliation', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', href: '/portal/budget/priority-actions' },
]

const variances = [
  {
    country: 'Nigeria',
    code: 'ACT-9021',
    approved: 150000,
    actual: 185500,
    variancePct: 23.6,
    type: 'over',
    explanation: 'Unexpected logistical costs during Q2.',
  },
  {
    country: 'Kenya',
    code: 'ACT-8843',
    approved: 200000,
    actual: 165000,
    variancePct: -17.5,
    type: 'under',
    explanation: '',
  },
  {
    country: 'Rwanda',
    code: 'ACT-7712',
    approved: 80000,
    actual: 80000,
    variancePct: 0,
    type: 'on-target',
    explanation: '',
  },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function VariancePage() {
  const pathname = usePathname()
  const [explanations, setExplanations] = useState<Record<string, string>>(
    Object.fromEntries(variances.map((v) => [v.code, v.explanation]))
  )
  const [countryFilter, setCountryFilter] = useState('All Countries')
  const [varianceFilter, setVarianceFilter] = useState('Variance > 10%')

  return (
    <div className="p-lg flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-sm font-bold text-on-surface">Variance Analysis</h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Identify budget deviations across all programme activities. Under- and over-utilised budgets require formal narrative explanations for audit compliance.
          </p>
        </div>
        <button className="flex items-center gap-sm rounded-full border border-outline-variant px-lg py-sm text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors shrink-0 self-start">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Audit Report
        </button>
      </div>

      {/* Sub-nav tabs */}
      <div className="border-b border-outline-variant flex gap-xs overflow-x-auto">
        {subTabs.map((tab) => {
          const active = tab.href === '/portal/budget' ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-md py-sm text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                active
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Under-utilised */}
        <div className="relative bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant overflow-hidden">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-[20px]">arrow_downward</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Under-utilised Budget</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">$1.2M</p>
          <p className="text-label-sm text-on-surface-variant">14.5% of total approved</p>
          <span
            className="material-symbols-outlined absolute -bottom-2 -right-2 text-[72px] text-primary-container opacity-40 select-none pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            trending_down
          </span>
        </div>

        {/* Over-utilised */}
        <div className="relative bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant overflow-hidden">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-error-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-error-container text-[20px]">arrow_upward</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Over-utilised Budget</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">$450K</p>
          <p className="text-label-sm text-error font-medium">Critical attention needed</p>
          <span
            className="material-symbols-outlined absolute -bottom-2 -right-2 text-[72px] text-error-container opacity-50 select-none pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            trending_up
          </span>
        </div>

        {/* Activities Behind Schedule */}
        <div className="relative bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant overflow-hidden">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px]">warning</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Activities Behind Schedule</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">12</p>
          <p className="text-label-sm text-on-surface-variant">Across 4 countries</p>
          <span
            className="material-symbols-outlined absolute -bottom-2 -right-2 text-[72px] text-secondary-container opacity-40 select-none pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            schedule
          </span>
        </div>
      </div>

      {/* Detailed Variance Register */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
        {/* Table header / filters */}
        <div className="px-lg py-md border-b border-outline-variant flex flex-wrap items-center gap-md">
          <div className="flex-1">
            <h3 className="text-title-md font-semibold text-on-surface">Detailed Variance Register</h3>
          </div>
          <div className="flex items-center gap-sm flex-wrap">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-surface-container rounded-lg px-md py-xs text-sm text-on-surface border border-outline-variant outline-none focus:border-primary"
            >
              <option>All Countries</option>
              <option>Nigeria</option>
              <option>Kenya</option>
              <option>Rwanda</option>
            </select>
            <select
              value={varianceFilter}
              onChange={(e) => setVarianceFilter(e.target.value)}
              className="bg-surface-container rounded-lg px-md py-xs text-sm text-on-surface border border-outline-variant outline-none focus:border-primary"
            >
              <option>Variance &gt; 10%</option>
              <option>All Variances</option>
              <option>Over-utilised</option>
              <option>Under-utilised</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container">
                <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Country</th>
                <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Activity Code</th>
                <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Approved Budget</th>
                <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Actual Spend</th>
                <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Variance %</th>
                <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Type</th>
                <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Required Explanation</th>
              </tr>
            </thead>
            <tbody>
              {variances.map((row) => {
                const rowBg =
                  row.type === 'over'
                    ? 'bg-error-container/20'
                    : row.type === 'under'
                      ? 'bg-secondary-container/10'
                      : ''
                return (
                  <tr key={row.code} className={`border-b border-outline-variant last:border-0 hover:opacity-90 transition-opacity ${rowBg}`}>
                    <td className="px-md py-md font-semibold text-on-surface">{row.country}</td>
                    <td className="px-md py-md font-mono text-on-surface">{row.code}</td>
                    <td className="px-md py-md text-right text-on-surface">{fmt(row.approved)}</td>
                    <td className="px-md py-md text-right text-on-surface font-medium">{fmt(row.actual)}</td>
                    <td className="px-md py-md text-right font-bold">
                      <span className={row.type === 'over' ? 'text-error' : row.type === 'under' ? 'text-secondary' : 'text-on-surface'}>
                        {row.variancePct > 0 ? '+' : ''}{row.variancePct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-md py-md">
                      {row.type === 'over' && (
                        <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-error-container text-on-error-container">Over-utilised</span>
                      )}
                      {row.type === 'under' && (
                        <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">Under-utilised</span>
                      )}
                      {row.type === 'on-target' && (
                        <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-primary-container/20 text-on-primary-container">On Target</span>
                      )}
                    </td>
                    <td className="px-md py-md min-w-[200px]">
                      <input
                        type="text"
                        value={explanations[row.code] ?? ''}
                        onChange={(e) => setExplanations((prev) => ({ ...prev, [row.code]: e.target.value }))}
                        placeholder="Enter explanation..."
                        className="w-full bg-surface-container rounded-lg px-sm py-xs text-sm text-on-surface border border-outline-variant outline-none focus:border-primary placeholder:text-on-surface-variant"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
