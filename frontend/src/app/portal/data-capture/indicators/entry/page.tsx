'use client'

import Link from 'next/link'
import { useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']
const CSV_COLUMNS = ['Indicator Code', 'Country', 'Value', 'Period', 'Notes']
const INDICATOR_FIELDS = ['indicator_code', 'country', 'value', 'period', 'notes']

interface UploadedFile {
  name: string
  size: string
}

export default function IndicatorsEntryPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [dragging, setDragging] = useState(false)
  const [mappings, setMappings] = useState<Record<string, string>>(
    Object.fromEntries(CSV_COLUMNS.map((c, i) => [c, INDICATOR_FIELDS[i]]))
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` })
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={3} />

      <div>
        <h2 className="text-3xl font-bold text-primary">Data Entry — CSV Upload</h2>
        <p className="text-on-surface-variant mt-xs">Step 3 of 5 — Upload your CSV file with indicator data.</p>
      </div>

      {/* Drop Zone */}
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-xl gap-md transition-colors ${
            dragging ? 'border-primary bg-primary-fixed/10' : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
          }`}
        >
          <span className="material-symbols-outlined text-[64px] text-outline-variant">upload_file</span>
          <div className="text-center">
            <p className="text-lg font-semibold text-on-surface">Drop CSV here or browse</p>
            <p className="text-sm text-on-surface-variant mt-xs">Supported formats: .csv, .xlsx (max 10MB)</p>
          </div>
          <label className="px-lg py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
            Browse Files
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileInput} />
          </label>
          <button className="text-sm text-primary font-semibold flex items-center gap-xs hover:underline">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download Template CSV
          </button>
        </div>
      ) : (
        <div className="bg-primary-fixed/10 border border-primary/20 rounded-xl p-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">{uploadedFile.name}</p>
              <p className="text-xs text-on-surface-variant">{uploadedFile.size}</p>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          </div>
          <button onClick={() => setUploadedFile(null)} className="text-sm text-error font-semibold hover:underline">Remove</button>
        </div>
      )}

      {/* Column Mapping */}
      {uploadedFile && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="px-md py-sm border-b border-outline-variant/20">
            <h3 className="text-base font-semibold text-primary">Column Mapping</h3>
            <p className="text-xs text-on-surface-variant mt-xs">Map your CSV columns to the required indicator fields.</p>
          </div>
          <div className="p-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-on-surface-variant pb-sm">CSV Column</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant pb-sm">Maps to Indicator Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {CSV_COLUMNS.map((col) => (
                  <tr key={col}>
                    <td className="py-sm pr-md text-sm text-on-surface font-medium">{col}</td>
                    <td className="py-sm">
                      <select
                        value={mappings[col]}
                        onChange={(e) => setMappings((prev) => ({ ...prev, [col]: e.target.value }))}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                      >
                        {INDICATOR_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                        <option value="">— Skip —</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-md border-t border-outline-variant/20">
        <Link href="/portal/data-capture/indicators/period" className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
          Back
        </Link>
        <Link
          href={uploadedFile ? '/portal/data-capture/indicators/validation' : '#'}
          className={`px-md py-sm rounded-full text-sm font-semibold ${uploadedFile ? 'bg-secondary-container text-on-secondary-container hover:opacity-90' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}`}
        >
          Next Step
        </Link>
      </div>
    </div>
  )
}
