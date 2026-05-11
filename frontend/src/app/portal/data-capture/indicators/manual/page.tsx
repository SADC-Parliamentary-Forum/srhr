'use client'

import Link from 'next/link'
import { useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']

interface Indicator {
  code: string
  name: string
  unit: string
}

const outcomeGroups: Record<string, Indicator[]> = {
  'O2 — Legal Frameworks': [
    { code: 'O2.1', name: 'Laws enacted on SRHR', unit: 'count' },
    { code: 'O2.2', name: 'Policies reviewed', unit: 'count' },
    { code: 'O2.3', name: 'Parliamentary debates held', unit: 'count' },
  ],
  'O3 — Budget Allocation': [
    { code: 'O3.1', name: 'SRHR budget as % of health budget', unit: '%' },
    { code: 'O3.2', name: 'Funds disbursed (USD)', unit: 'USD' },
  ],
  'O4 — Youth Access': [
    { code: 'O4.1', name: 'Youth reached by services', unit: 'persons' },
    { code: 'O4.2', name: 'Youth-friendly clinics operational', unit: 'count' },
  ],
}

export default function IndicatorsManualPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setValue = (code: string, val: string) => {
    setValues((prev) => ({ ...prev, [code]: val }))
    if (val && isNaN(Number(val))) {
      setErrors((prev) => ({ ...prev, [code]: 'Must be a numeric value' }))
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[code]; return n })
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={3} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Manual Data Entry</h2>
          <p className="text-on-surface-variant mt-xs">Step 3 of 5 — Enter indicator values directly.</p>
        </div>
        <button className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-sm font-semibold hover:border-primary text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[18px]">content_paste</span>
          Paste from Excel
        </button>
      </div>

      <div className="flex flex-col gap-lg">
        {Object.entries(outcomeGroups).map(([group, indicators]) => (
          <div key={group} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="bg-primary px-md py-sm">
              <h3 className="text-sm font-bold text-on-primary">{group}</h3>
            </div>
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-20">Code</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Indicator</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-28">Value</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-20">Unit</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-40">Notes</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((ind) => (
                  <tr key={ind.code} className={`border-t border-outline-variant/20 ${errors[ind.code] ? 'bg-error-container/20' : ''}`}>
                    <td className="px-md py-sm text-xs font-bold text-on-surface-variant">{ind.code}</td>
                    <td className="px-md py-sm text-sm text-on-surface">{ind.name}</td>
                    <td className="px-md py-sm">
                      <div>
                        <input
                          type="text"
                          value={values[ind.code] ?? ''}
                          onChange={(e) => setValue(ind.code, e.target.value)}
                          className={`w-full border rounded-lg px-sm py-xs text-sm outline-none ${errors[ind.code] ? 'border-error bg-error-container/20 text-on-error-container' : 'border-outline-variant bg-surface-container focus:border-primary'}`}
                          placeholder="0"
                        />
                        {errors[ind.code] && <p className="text-xs text-error mt-xs">{errors[ind.code]}</p>}
                      </div>
                    </td>
                    <td className="px-md py-sm text-xs text-on-surface-variant">{ind.unit}</td>
                    <td className="px-md py-sm">
                      <input
                        type="text"
                        value={notes[ind.code] ?? ''}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [ind.code]: e.target.value }))}
                        className="w-full border border-outline-variant bg-surface-container rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                        placeholder="Optional..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-md py-sm border-t border-outline-variant/20">
              <button className="text-sm text-primary font-semibold flex items-center gap-xs hover:underline">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Indicator Row
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-md border-t border-outline-variant/20">
        <Link href="/portal/data-capture/indicators/type" className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
          Back
        </Link>
        <Link href="/portal/data-capture/indicators/validation" className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity">
          Next Step
        </Link>
      </div>
    </div>
  )
}
