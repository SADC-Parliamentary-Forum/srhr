'use client'

import Link from 'next/link'
import { useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']

type RowStatus = 'valid' | 'warning' | 'error'
type TabType = 'all' | 'issues'

interface ValidationRow {
  row: number
  code: string
  value: string
  status: RowStatus
  message: string
}

const validationRows: ValidationRow[] = [
  { row: 1, code: 'O2.1', value: '4', status: 'valid', message: '' },
  { row: 2, code: 'O2.2', value: '12', status: 'valid', message: '' },
  { row: 3, code: 'O2.3', value: '8', status: 'warning', message: 'Value is 40% below historical average' },
  { row: 4, code: 'O3.1', value: '11.2', status: 'valid', message: '' },
  { row: 5, code: 'O3.2', value: 'N/A', status: 'error', message: 'Non-numeric value in a numeric field' },
  { row: 6, code: 'O4.1', value: '3420', status: 'valid', message: '' },
  { row: 7, code: 'O4.2', value: '15', status: 'valid', message: '' },
  { row: 8, code: 'O5.1', value: '280', status: 'warning', message: 'Missing supporting evidence link' },
  ...Array.from({ length: 40 }, (_, i) => ({
    row: i + 9,
    code: `O${Math.floor(i / 10) + 2}.${(i % 10) + 1}`,
    value: String(Math.floor(Math.random() * 100)),
    status: 'valid' as RowStatus,
    message: '',
  })),
]

const validCount = validationRows.filter((r) => r.status === 'valid').length
const warningCount = validationRows.filter((r) => r.status === 'warning').length
const errorCount = validationRows.filter((r) => r.status === 'error').length

export default function IndicatorsValidationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const displayed = activeTab === 'issues'
    ? validationRows.filter((r) => r.status !== 'valid')
    : validationRows

  const statusStyles: Record<RowStatus, string> = {
    valid: '',
    warning: 'bg-secondary-fixed/20',
    error: 'bg-error-container/30',
  }

  const badgeStyles: Record<RowStatus, string> = {
    valid: 'text-primary material-symbols-outlined text-[18px]',
    warning: 'text-secondary material-symbols-outlined text-[18px]',
    error: 'text-error material-symbols-outlined text-[18px]',
  }

  const badgeIcon: Record<RowStatus, string> = {
    valid: 'check_circle',
    warning: 'warning',
    error: 'error',
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={4} />

      <div>
        <h2 className="text-3xl font-bold text-primary">Validation Results</h2>
        <p className="text-on-surface-variant mt-xs">Step 4 of 5 — Review any issues before submitting.</p>
      </div>

      {/* Summary Row */}
      <div className="flex items-center gap-md flex-wrap">
        <div className="flex items-center gap-xs bg-primary-fixed text-on-primary-fixed px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Valid: {validCount}
        </div>
        <div className="flex items-center gap-xs bg-secondary-fixed text-on-secondary-fixed-variant px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Warnings: {warningCount}
        </div>
        <div className="flex items-center gap-xs bg-error-container text-on-error-container px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">error</span>
          Errors: {errorCount}
        </div>
        <button className="ml-auto flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download Error Report
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant flex gap-lg text-sm font-semibold">
        {([['all', 'All Rows'], ['issues', 'Errors & Warnings']] as [TabType, string][]).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-sm border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low sticky top-0 z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Row #</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Indicator Code</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Value</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Message</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((row) => (
                <tr key={row.row} className={`border-t border-outline-variant/20 ${statusStyles[row.status]}`}>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{row.row}</td>
                  <td className="px-md py-sm text-sm font-semibold text-primary">{row.code}</td>
                  <td className="px-md py-sm text-sm text-on-surface">{row.value}</td>
                  <td className="px-md py-sm">
                    <span className={badgeStyles[row.status]}>{badgeIcon[row.status]}</span>
                  </td>
                  <td className="px-md py-sm text-xs text-on-surface-variant max-w-[200px]">{row.message}</td>
                  <td className="px-md py-sm">
                    {row.status === 'error' && (
                      <button className="text-sm text-primary font-semibold hover:underline">Fix</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between pt-md border-t border-outline-variant/20">
        <Link href="/portal/data-capture/indicators/entry" className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
          Back
        </Link>
        <button
          disabled={errorCount > 0}
          className={`px-md py-sm rounded-full text-sm font-semibold ${errorCount === 0 ? 'bg-secondary-container text-on-secondary-container hover:opacity-90 cursor-pointer' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}`}
        >
          {errorCount > 0 ? `Fix ${errorCount} Error${errorCount > 1 ? 's' : ''} to Submit` : 'Submit Data'}
        </button>
      </div>
    </div>
  )
}
