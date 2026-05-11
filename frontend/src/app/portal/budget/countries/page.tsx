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

const countries = [
  { name: 'Malawi', allocated: 52000, utilised: 15516.64, rate: 29.8, status: 'Active' },
  { name: 'Kenya', allocated: 68000, utilised: 12480.0, rate: 18.4, status: 'Active' },
  { name: 'Tanzania', allocated: 45000, utilised: 8120.5, rate: 18.0, status: 'Active' },
  { name: 'Zimbabwe', allocated: 38500, utilised: 4295.34, rate: 11.2, status: 'Active' },
  { name: 'Lesotho', allocated: 29000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'DRC', allocated: 31000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'Angola', allocated: 45000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'South Africa', allocated: 38000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'Rwanda', allocated: 22000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'Namibia', allocated: 19000, utilised: 0, rate: 0, status: 'No Spend' },
  { name: 'Botswana', allocated: 21152, utilised: 0, rate: 0, status: 'No Spend' },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CountriesPage() {
  const pathname = usePathname()

  const noSpendCount = countries.filter((c) => c.status === 'No Spend').length
  const totalUtil = countries.reduce((sum, c) => sum + c.utilised, 0)
  const totalAlloc = countries.reduce((sum, c) => sum + c.allocated, 0)
  const avgRate = ((totalUtil / totalAlloc) * 100).toFixed(1)

  return (
    <div className="p-lg flex flex-col gap-lg">
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Highest Recorded Spender */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px]">trending_up</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Highest Recorded Spender</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">Malawi</p>
          <p className="text-label-sm text-on-surface-variant">Leading overall activity expenditure</p>
        </div>

        {/* No Spend Countries */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-error-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-error-container text-[20px]">money_off</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">No Spend Countries</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">{noSpendCount}</p>
          <p className="text-label-sm text-on-surface-variant">Countries with zero expenditure</p>
        </div>

        {/* Average Utilisation */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-[20px]">analytics</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Average Utilisation</span>
          </div>
          <p className="text-display-sm font-bold text-on-surface">{avgRate}%</p>
          <p className="text-label-sm text-on-surface-variant">Across all active countries</p>
        </div>
      </div>

      {/* Countries table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Country</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Allocated</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Utilised</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Balance</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Rate %</th>
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((row) => {
              const balance = row.allocated - row.utilised
              const noSpend = row.status === 'No Spend'
              return (
                <tr
                  key={row.name}
                  className={`border-b border-outline-variant last:border-0 hover:bg-surface-container transition-colors ${
                    noSpend ? 'bg-error-container/10' : ''
                  }`}
                >
                  <td className="px-md py-sm font-semibold text-on-surface">{row.name}</td>
                  <td className="px-md py-sm text-right text-on-surface">{fmt(row.allocated)}</td>
                  <td className="px-md py-sm text-right text-on-surface">{fmt(row.utilised)}</td>
                  <td className="px-md py-sm text-right text-secondary font-medium">{fmt(balance)}</td>
                  <td className="px-md py-sm text-right">
                    <span className={`inline-block px-sm py-xs rounded-full text-xs font-semibold ${
                      noSpend
                        ? 'bg-error-container text-on-error-container'
                        : row.rate >= 20
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {row.rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-md py-sm">
                    <span className={`inline-block px-sm py-xs rounded-full text-xs font-semibold ${
                      noSpend
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary-container text-on-primary-container'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
