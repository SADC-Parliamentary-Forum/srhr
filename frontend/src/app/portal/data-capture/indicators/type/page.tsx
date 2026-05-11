'use client'

import Link from 'next/link'
import { useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

type UploadType = 'csv' | 'manual' | 'sync'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']

const uploadTypes = [
  {
    id: 'csv' as UploadType,
    icon: 'upload_file',
    title: 'CSV Bulk Upload',
    desc: 'Best for large datasets. Upload a CSV file with all indicator values.',
  },
  {
    id: 'manual' as UploadType,
    icon: 'edit',
    title: 'Manual Data Entry',
    desc: 'Enter values directly into the portal one indicator at a time.',
  },
  {
    id: 'sync' as UploadType,
    icon: 'sync',
    title: 'Sync from Mobile',
    desc: 'Import data collected from the SRHR mobile field application.',
  },
]

export default function IndicatorsTypePage() {
  const [selected, setSelected] = useState<UploadType | null>(null)

  const nextHref =
    selected === 'manual'
      ? '/portal/data-capture/indicators/manual'
      : '/portal/data-capture/indicators/period'

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={1} />

      <div>
        <h2 className="text-3xl font-bold text-primary">Upload Indicators</h2>
        <p className="text-on-surface-variant mt-xs">Step 1 of 5 — Choose how you&apos;d like to submit your indicator data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {uploadTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelected(type.id)}
            className={`text-left rounded-xl p-md border-2 transition-all flex flex-col gap-md ${
              selected === type.id
                ? 'border-secondary-container bg-secondary-fixed/10'
                : 'border-outline-variant bg-surface-container-lowest hover:border-primary/30 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selected === type.id ? 'bg-secondary-container' : 'bg-surface-container'}`}>
                <span className={`material-symbols-outlined text-[24px] ${selected === type.id ? 'text-on-secondary-container' : 'text-primary'}`}>
                  {type.icon}
                </span>
              </div>
              {selected === type.id && (
                <span className="material-symbols-outlined text-secondary-container text-[24px]">check_circle</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-on-surface mb-xs">{type.title}</h3>
              <p className="text-sm text-on-surface-variant">{type.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-md border-t border-outline-variant/20">
        <Link href="/portal/data-capture" className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
          Back
        </Link>
        <Link
          href={selected ? nextHref : '#'}
          className={`px-md py-sm rounded-full text-sm font-semibold transition-colors ${
            selected
              ? 'bg-secondary-container text-on-secondary-container hover:opacity-90'
              : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
          }`}
        >
          Next Step
        </Link>
      </div>
    </div>
  )
}
