'use client'

import { useState } from 'react'

const breakdownData = [
  { country: 'Malawi', code: 'B12', description: 'Multi-stakeholder consultative workshops', allocated: 72400, utilised: 15516.64, status: 'Active' },
  { country: 'Malawi', code: 'B13', description: 'Public hearings meeting', allocated: 34000, utilised: 2800, status: 'Active' },
  { country: 'Kenya', code: 'B11', description: 'Regional policy advocacy workshops', allocated: 58000, utilised: 12480, status: 'Active' },
  { country: 'Kenya', code: 'B14', description: 'Capacity building training for national coordinators', allocated: 10000, utilised: 0, status: 'No Spend' },
  { country: 'Tanzania', code: 'B15', description: 'Cross-border technical assistance missions', allocated: 27603, utilised: 8120.5, status: 'Active' },
  { country: 'Zimbabwe', code: 'B16', description: 'Annual programme review conference', allocated: 13000, utilised: 4295.34, status: 'Active' },
  { country: 'Angola', code: 'B12', description: 'Multi-stakeholder consultative workshops', allocated: 25000, utilised: 0, status: 'No Spend' },
  { country: 'South Africa', code: 'B13', description: 'Public hearings meeting', allocated: 38000, utilised: 0, status: 'No Spend' },
]

function fmt(n: number) {
  return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CountryBreakdownPage() {
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2023')
  const [activityCode, setActivityCode] = useState('')

  const filtered = breakdownData.filter((row) => {
    if (selectedCountry !== 'All' && row.country !== selectedCountry) return false
    if (activityCode && !row.code.toLowerCase().includes(activityCode.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-lg flex flex-col gap-lg">
      {/* Page header */}
      <div className="flex flex-col gap-xs">
        <h1 className="text-display-sm font-bold text-on-surface">Budget Breakdown: Country &amp; Activities</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Granular breakdown of budget allocation and utilisation per country and activity line. Use the filters below to narrow down the data view.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant">
        <div className="flex flex-wrap gap-md items-end">
          <div className="flex flex-col gap-xs flex-1 min-w-[160px]">
            <label className="text-label-sm text-on-surface-variant font-medium">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-surface-container rounded-lg px-md py-sm text-sm text-on-surface border border-outline-variant outline-none focus:border-primary"
            >
              <option value="All">All Countries</option>
              <option value="Malawi">Malawi</option>
              <option value="Lesotho">Lesotho</option>
              <option value="DRC">DRC</option>
              <option value="Namibia">Namibia</option>
              <option value="Kenya">Kenya</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Zimbabwe">Zimbabwe</option>
              <option value="Angola">Angola</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>
          <div className="flex flex-col gap-xs flex-1 min-w-[160px]">
            <label className="text-label-sm text-on-surface-variant font-medium">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-surface-container rounded-lg px-md py-sm text-sm text-on-surface border border-outline-variant outline-none focus:border-primary"
            >
              <option value="Q3 2023">Q3 2023</option>
              <option value="Q2 2023">Q2 2023</option>
              <option value="Q1 2023">Q1 2023</option>
              <option value="FY 2022">FY 2022</option>
            </select>
          </div>
          <div className="flex flex-col gap-xs flex-1 min-w-[160px]">
            <label className="text-label-sm text-on-surface-variant font-medium">Activity Code</label>
            <input
              type="text"
              value={activityCode}
              onChange={(e) => setActivityCode(e.target.value)}
              placeholder="e.g. B12"
              className="bg-surface-container rounded-lg px-md py-sm text-sm text-on-surface border border-outline-variant outline-none focus:border-primary placeholder:text-on-surface-variant"
            />
          </div>
          <button className="bg-primary text-on-primary rounded-lg px-lg py-sm text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
            Apply
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Country</th>
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Activity Code</th>
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Activity Description</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Allocated</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Utilised</th>
              <th className="text-right px-md py-sm text-label-md font-semibold text-on-surface-variant">Balance</th>
              <th className="text-left px-md py-sm text-label-md font-semibold text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const balance = row.allocated - row.utilised
              const noSpend = row.status === 'No Spend'
              return (
                <tr
                  key={i}
                  className={`border-b border-outline-variant last:border-0 hover:bg-surface-container transition-colors ${noSpend ? 'bg-error-container/10' : ''}`}
                >
                  <td className="px-md py-sm font-semibold text-on-surface">{row.country}</td>
                  <td className="px-md py-sm font-mono text-on-surface">{row.code}</td>
                  <td className="px-md py-sm text-on-surface max-w-xs">{row.description}</td>
                  <td className="px-md py-sm text-right text-on-surface">{fmt(row.allocated)}</td>
                  <td className="px-md py-sm text-right text-on-surface font-medium">{fmt(row.utilised)}</td>
                  <td className="px-md py-sm text-right text-secondary font-medium">{fmt(balance)}</td>
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
        {filtered.length === 0 && (
          <div className="py-xl text-center text-on-surface-variant text-sm">No records match your filter criteria.</div>
        )}
      </div>

      {/* Export button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-sm bg-primary text-on-primary rounded-full px-lg py-sm text-sm font-semibold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Data
        </button>
      </div>
    </div>
  )
}
