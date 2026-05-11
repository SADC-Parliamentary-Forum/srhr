'use client'

import Link from 'next/link'
import { useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']
const OUTCOME_AREAS = [
  { id: 'O2', label: 'O2 — Legal Frameworks' },
  { id: 'O3', label: 'O3 — Budget Allocation' },
  { id: 'O4', label: 'O4 — Youth Access' },
  { id: 'O5', label: 'O5 — Gender Violence' },
]
const SADC_COUNTRIES = [
  'Angola', 'Botswana', 'DRC', 'Eswatini', 'Lesotho', 'Madagascar',
  'Malawi', 'Mauritius', 'Mozambique', 'Namibia', 'South Africa',
  'Tanzania', 'Zambia', 'Zimbabwe',
]

export default function IndicatorsPeriodPage() {
  const [country, setCountry] = useState('Malawi')
  const [year, setYear] = useState('2026')
  const [quarter, setQuarter] = useState('Q1')
  const [outcomes, setOutcomes] = useState<string[]>(['O2'])

  const toggleOutcome = (id: string) =>
    setOutcomes((prev) => prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id])

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={2} />

      <div>
        <h2 className="text-3xl font-bold text-primary">Select Reporting Period</h2>
        <p className="text-on-surface-variant mt-xs">Step 2 of 5 — Define the scope and period for this submission.</p>
      </div>

      <div className="bg-error-container text-on-error-container rounded-lg px-md py-sm text-sm font-semibold flex items-center gap-sm">
        <span className="material-symbols-outlined text-[18px]">info</span>
        Once submitted, the reporting period cannot be changed. Please verify your selections carefully.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Form */}
        <div className="flex flex-col gap-md">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Country / Region</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-primary">
              {SADC_COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-primary">
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Quarter</label>
            <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-primary">
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Outcome Areas</label>
            <div className="flex flex-col gap-sm">
              {OUTCOME_AREAS.map((oa) => (
                <label key={oa.id} className="flex items-center gap-sm cursor-pointer p-sm rounded-lg border border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest">
                  <input type="checkbox" checked={outcomes.includes(oa.id)} onChange={() => toggleOutcome(oa.id)} className="text-primary rounded" />
                  <span className="text-sm">{oa.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-primary rounded-xl p-md text-on-primary flex flex-col gap-md sticky top-4 h-fit">
          <h3 className="text-base font-semibold">Reporting Context Summary</h3>
          <div className="bg-on-primary/10 rounded-lg p-md flex flex-col gap-sm">
            <div className="flex justify-between text-sm">
              <span className="text-on-primary/70">Country</span>
              <span className="font-semibold">{country}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-primary/70">Period</span>
              <span className="font-semibold">{quarter} {year}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-primary/70">Outcomes</span>
              <span className="font-semibold">{outcomes.length > 0 ? outcomes.join(', ') : 'None selected'}</span>
            </div>
          </div>
          <p className="text-xs text-on-primary/60">This context will be applied to all indicators in this submission and cannot be changed after submission.</p>
        </div>
      </div>

      <div className="flex justify-between pt-md border-t border-outline-variant/20">
        <Link href="/portal/data-capture/indicators/type" className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
          Back
        </Link>
        <Link href="/portal/data-capture/indicators/entry" className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity">
          Next Step
        </Link>
      </div>
    </div>
  )
}
