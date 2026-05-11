'use client'

import BudgetSubnav from '../_components/BudgetSubnav'

interface ActionCard {
  statusLabel: string
  statusBg: string
  statusIcon: string
  impact: string
  title: string
  description: string
  primaryBtn: string
  primaryBtnStyle: string
  secondaryBtn: string
}

const actionCards: ActionCard[] = [
  {
    statusLabel: 'Open',
    statusBg: 'bg-error-container text-on-error-container',
    statusIcon: 'warning',
    impact: 'High Impact',
    title: 'Accelerate B13 Public Hearings',
    description: 'Low utilization flagged against a high allocated budget. Recommend immediate scheduling to prevent year-end bottleneck.',
    primaryBtn: 'Assign Action',
    primaryBtnStyle: 'bg-primary text-on-primary hover:opacity-90',
    secondaryBtn: 'Dismiss',
  },
  {
    statusLabel: 'In Progress',
    statusBg: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'sync',
    impact: 'Medium Impact',
    title: 'Reconcile Country Reporting',
    description: 'Resolve data source differences between regional reports and central system to ensure accurate quarterly roll-up.',
    primaryBtn: 'Re-assign',
    primaryBtnStyle: 'border border-primary text-primary hover:bg-primary-fixed',
    secondaryBtn: 'Details',
  },
  {
    statusLabel: 'Open',
    statusBg: 'bg-error-container text-on-error-container',
    statusIcon: 'warning',
    impact: 'High Impact',
    title: 'Follow Up No-Spend Countries',
    description: 'Zero recorded expenditure in Q2 for Angola and South Africa. Requires urgent outreach to regional directors.',
    primaryBtn: 'Assign Action',
    primaryBtnStyle: 'bg-primary text-on-primary hover:opacity-90',
    secondaryBtn: 'View Data',
  },
  {
    statusLabel: 'Monitoring',
    statusBg: 'bg-primary-container text-on-primary-container',
    statusIcon: 'check_circle',
    impact: 'Optimization',
    title: 'Sustain B12 Implementation',
    description: 'High performing program area. Capture best practices and evaluate potential for mid-year budget reallocation.',
    primaryBtn: 'Assign Review',
    primaryBtnStyle: 'border border-primary text-primary hover:bg-primary-fixed',
    secondaryBtn: 'Log Note',
  },
]

export default function PriorityActionsPage() {
  return (
    <div className="space-y-md min-w-0">
      <div className="space-y-sm">
        <h1 className="text-h1 font-h1 text-on-surface">Priority Actions</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Key recommendations requiring immediate attention to optimize budget utilization and reconciliation.
        </p>

        {/* Sub-nav tabs */}
        <BudgetSubnav />
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
        {actionCards.map((card, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_24px_rgba(0,23,13,0.04)] border border-primary/10 flex flex-col hover:shadow-[0_8px_32px_rgba(0,23,13,0.08)] transition-shadow"
          >
            <div className="flex justify-between items-start mb-sm">
              <div className={`${card.statusBg} px-sm py-xs rounded-full text-label-md font-label-md inline-flex items-center gap-xs`}>
                <span className="material-symbols-outlined text-[14px]">{card.statusIcon}</span>
                {card.statusLabel}
              </div>
              <span className="text-on-surface-variant text-label-md font-label-md">{card.impact}</span>
            </div>

            <h3 className="text-h3 font-h3 text-on-surface mb-xs mt-sm">{card.title}</h3>
            <p className="text-body-md font-body-md text-on-surface-variant flex-1 mb-md">{card.description}</p>

            <div className="mt-auto border-t border-surface-variant pt-sm flex justify-end gap-sm">
              <button className="px-sm py-xs text-label-lg font-label-lg text-primary hover:bg-primary-fixed rounded transition-colors">
                {card.secondaryBtn}
              </button>
              <button className={`px-sm py-xs text-label-lg font-label-lg rounded transition-all ${card.primaryBtnStyle}`}>
                {card.primaryBtn}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
