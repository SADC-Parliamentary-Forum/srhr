'use client'

import BudgetSubnav from '../_components/BudgetSubnav'

const activities = [
  {
    code: 'B11',
    description: 'Regional policy advocacy workshops',
    allocated: 58000,
    utilised: 7240.5,
    balance: 50759.5,
    rate: 12.5,
  },
  {
    code: 'B12',
    description: 'Multi-stakeholder consultative workshops',
    allocated: 72400,
    utilised: 15516.64,
    balance: 56883.36,
    rate: 21.4,
  },
  {
    code: 'B13',
    description: 'Public hearings meeting',
    allocated: 104649,
    utilised: 8200,
    balance: 96449,
    rate: 7.8,
  },
  {
    code: 'B14',
    description: 'Capacity building training for national coordinators',
    allocated: 33000,
    utilised: 5120,
    balance: 27880,
    rate: 15.5,
  },
  {
    code: 'B15',
    description: 'Cross-border technical assistance missions',
    allocated: 27603,
    utilised: 2835.34,
    balance: 24767.66,
    rate: 10.3,
  },
  {
    code: 'B16',
    description: 'Annual programme review conference',
    allocated: 13000,
    utilised: 1500,
    balance: 11500,
    rate: 11.5,
  },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ActivitiesPage() {
  return (
    <div className="p-lg flex flex-col gap-lg min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-xs">
        <h2 className="text-display-sm font-bold text-on-surface">Activities Analysis</h2>
        <p className="text-body-sm text-on-surface-variant">FY 2024 Q3 Data</p>
      </div>

      {/* Sub-tab pills */}
      <BudgetSubnav />

      {/* KPI stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Largest Allocation */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-[20px]">account_balance_wallet</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Largest Allocation</span>
          </div>
          <p className="text-title-lg font-bold text-on-surface">US$ 104,649.00</p>
          <p className="text-label-sm text-on-surface-variant">B13 Public hearings meeting</p>
        </div>

        {/* Largest Utilisation */}
        <div className="relative bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant overflow-hidden">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">trending_up</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Largest Utilisation</span>
          </div>
          <p className="text-title-lg font-bold text-on-surface">US$ 15,516.64</p>
          <p className="text-label-sm text-on-surface-variant">B12 Multi-stakeholder consultative workshops</p>
          {/* Decorative bg icon */}
          <span
            className="material-symbols-outlined absolute -bottom-2 -right-2 text-[72px] text-primary-container opacity-40 select-none pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            payments
          </span>
        </div>

        {/* Highest Spending Rate */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px]">data_usage</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Highest Spending Rate</span>
          </div>
          <p className="text-title-lg font-bold text-on-surface">21.4%</p>
          <p className="text-label-sm text-on-surface-variant">B12 Multi-stakeholder workshops</p>
        </div>

        {/* Total Activities */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-md border border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-[20px]">bar_chart</span>
            </div>
            <span className="text-label-md text-on-surface-variant font-medium">Total Activities</span>
          </div>
          <p className="text-title-lg font-bold text-on-surface">6</p>
          <p className="text-label-sm text-on-surface-variant">Active programme activities</p>
        </div>
      </div>

      {/* Activities table */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Activity Code</th>
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Description</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Allocated</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Utilised</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Balance</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Rate</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((row, i) => (
              <tr key={row.code} className={`border-b border-outline-variant last:border-0 hover:bg-surface-container transition-colors ${i % 2 === 0 ? '' : 'bg-surface-container-lowest'}`}>
                <td className="px-md py-sm font-mono text-on-surface font-semibold">{row.code}</td>
                <td className="px-md py-sm text-on-surface">{row.description}</td>
                <td className="px-md py-sm text-right text-on-surface">{fmt(row.allocated)}</td>
                <td className="px-md py-sm text-right text-on-surface font-medium">{fmt(row.utilised)}</td>
                <td className="px-md py-sm text-right text-secondary font-medium">{fmt(row.balance)}</td>
                <td className="px-md py-sm text-right">
                  <span className={`inline-block px-sm py-xs rounded-full text-xs font-semibold ${
                    row.rate >= 20
                      ? 'bg-primary-container text-on-primary-container'
                      : row.rate < 10
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {row.rate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
