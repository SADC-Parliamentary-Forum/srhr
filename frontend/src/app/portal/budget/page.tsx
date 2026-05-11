'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const subTabs = [
  { label: 'Overview', href: '/portal/budget' },
  { label: 'Activities', href: '/portal/budget/activities' },
  { label: 'Countries', href: '/portal/budget/countries' },
  { label: 'No-Spend', href: '/portal/budget/no-spend' },
  { label: 'Variance', href: '/portal/budget/variance' },
  { label: 'Reconciliation', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', href: '/portal/budget/priority-actions' },
]

export default function BudgetOverviewPage() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-lg">
      {/* Page header */}
      <div className="flex flex-col gap-xs">
        <h1 className="text-display-sm font-bold text-on-surface">Budget Analysis</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Comprehensive overview of budget allocation, utilisation rates, and financial performance across all SRHR programme activities and member countries.
        </p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="border-b border-outline-variant flex gap-xs flex-wrap">
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

      {/* Key Finding banner */}
      <div className="flex items-start gap-sm bg-secondary-container text-on-secondary-container rounded-xl p-md">
        <span
          className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <p className="text-sm">
          <span className="font-bold">Key Finding: </span>
          National Activities remain substantially under-utilised, with{' '}
          <span className="font-semibold">US$ 268,239.52</span> still available out of a total allocated budget of US$ 308,652.00.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        {/* Left col — KPI cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-md">
          {/* Total Budget Allocated */}
          <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">account_balance_wallet</span>
              </div>
              <span className="text-label-md text-on-surface-variant font-medium">Total Budget Allocated</span>
            </div>
            <p className="text-display-sm font-bold text-on-surface">US$ 308,652.00</p>
            <p className="text-label-sm text-on-surface-variant">FY 2024 Q3 approved allocation</p>
          </div>

          {/* Current Utilisation */}
          <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">trending_up</span>
              </div>
              <span className="text-label-md text-on-surface-variant font-medium">Current Utilisation</span>
            </div>
            <p className="text-display-sm font-bold text-on-surface">US$ 40,412.48</p>
            <p className="text-label-sm text-on-surface-variant">Total funds utilised to date</p>
          </div>

          {/* Available Balance */}
          <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container text-[20px]">savings</span>
              </div>
              <span className="text-label-md text-on-surface-variant font-medium">Available Balance</span>
            </div>
            <p className="text-display-sm font-bold text-secondary">US$ 268,239.52</p>
            <p className="text-label-sm text-on-surface-variant">Remaining unspent allocation</p>
          </div>

          {/* Overall Spending Rate */}
          <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">data_usage</span>
              </div>
              <span className="text-label-md text-on-surface-variant font-medium">Overall Spending Rate</span>
            </div>
            <p className="text-display-sm font-bold text-on-surface">13.1%</p>
            <p className="text-label-sm text-on-surface-variant">Of total allocation utilised</p>
          </div>
        </div>

        {/* Right col — Gauge + Progress */}
        <div className="md:col-span-5 flex flex-col gap-md">
          {/* Gauge card */}
          <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant flex flex-col items-center gap-md">
            <p className="text-label-md font-semibold text-on-surface self-start">Utilisation Gauge</p>
            {/* SVG semi-circle gauge — reliable across all browsers */}
            <svg viewBox="0 0 200 114" width="200" height="114" aria-label="13.1% utilised">
              {/* Background track */}
              <path
                d="M 14 100 A 86 86 0 0 1 186 100"
                fill="none"
                stroke="#fed65b"
                strokeWidth="22"
                strokeLinecap="round"
              />
              {/* Fill arc: circumference ≈ π×86 ≈ 270.2; 13.1% → dashoffset = 270.2×(1-0.131) ≈ 234.9 */}
              <path
                d="M 14 100 A 86 86 0 0 1 186 100"
                fill="none"
                stroke="#00170d"
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray="270.2"
                strokeDashoffset="234.9"
              />
              {/* Value label */}
              <text x="100" y="92" textAnchor="middle" fontSize="24" fontWeight="800" fill="#00170d" fontFamily="Manrope, sans-serif">13.1%</text>
              {/* Sub-label */}
              <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#414844" fontFamily="Manrope, sans-serif">Utilised</text>
            </svg>
            {/* Legend */}
            <div className="flex items-center gap-lg text-sm">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface-variant">Utilised</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-secondary-container" />
                <span className="text-on-surface-variant">Available</span>
              </div>
            </div>
          </div>

          {/* Progress bar card */}
          <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <p className="text-label-md font-semibold text-on-surface">Budget Progress</p>
              <span className="text-label-sm text-on-surface-variant font-medium">13.1% / 100%</span>
            </div>
            <div className="w-full h-3 bg-secondary-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '13.1%' }} />
            </div>
            <div className="flex justify-between text-label-sm text-on-surface-variant">
              <span>US$ 40,412.48 spent</span>
              <span>US$ 308,652.00 total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
