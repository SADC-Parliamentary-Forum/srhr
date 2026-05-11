'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import WizardProgress from '../../../_components/WizardProgress'

const WIZARD_STEPS = ['Choose Type', 'Select Period', 'Data Entry', 'Validation', 'Submit']

interface IndicatorRow {
  id: string
  code: string
  name: string
  unit: string
  isCustom?: boolean
}

const baseOutcomeGroups: Record<string, IndicatorRow[]> = {
  'O2 - Legal Frameworks': [
    { id: 'O2.1', code: 'O2.1', name: 'Laws enacted on SRHR', unit: 'count' },
    { id: 'O2.2', code: 'O2.2', name: 'Policies reviewed', unit: 'count' },
    { id: 'O2.3', code: 'O2.3', name: 'Parliamentary debates held', unit: 'count' },
  ],
  'O3 - Budget Allocation': [
    { id: 'O3.1', code: 'O3.1', name: 'SRHR budget as % of health budget', unit: '%' },
    { id: 'O3.2', code: 'O3.2', name: 'Funds disbursed (USD)', unit: 'USD' },
  ],
  'O4 - Youth Access': [
    { id: 'O4.1', code: 'O4.1', name: 'Youth reached by services', unit: 'persons' },
    { id: 'O4.2', code: 'O4.2', name: 'Youth-friendly clinics operational', unit: 'count' },
  ],
}

function emptyRow(id: string): IndicatorRow {
  return {
    id,
    code: '',
    name: '',
    unit: '',
    isCustom: true,
  }
}

type RowLocation = {
  group: string
  rowId: string
}

export default function IndicatorsManualPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customGroups, setCustomGroups] = useState<Record<string, IndicatorRow[]>>({})
  const [pastedRows, setPastedRows] = useState<IndicatorRow[]>([])
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteInput, setPasteInput] = useState('')
  const [pasteMessage, setPasteMessage] = useState<string | null>(null)

  const groups = useMemo(() => {
    const merged = Object.entries(baseOutcomeGroups).map(([group, rows]) => ({
      group,
      rows: [...rows, ...(customGroups[group] ?? [])],
    }))

    if (pastedRows.length > 0) {
      merged.push({ group: 'Pasted Indicators', rows: pastedRows })
    }

    return merged
  }, [customGroups, pastedRows])

  const setValue = (rowId: string, val: string) => {
    setValues((prev) => ({ ...prev, [rowId]: val }))

    if (val.trim() !== '' && Number.isNaN(Number(val))) {
      setErrors((prev) => ({ ...prev, [rowId]: 'Must be a numeric value' }))
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next[rowId]
      return next
    })
  }

  const updateRow = ({ group, rowId }: RowLocation, field: keyof IndicatorRow, value: string) => {
    if (group === 'Pasted Indicators') {
      setPastedRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
      return
    }

    setCustomGroups((prev) => ({
      ...prev,
      [group]: (prev[group] ?? []).map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    }))
  }

  const addIndicatorRow = (group: string) => {
    const id = `custom-${group}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    setCustomGroups((prev) => ({
      ...prev,
      [group]: [...(prev[group] ?? []), emptyRow(id)],
    }))
  }

  const removeCustomRow = ({ group, rowId }: RowLocation) => {
    if (group === 'Pasted Indicators') {
      setPastedRows((prev) => prev.filter((row) => row.id !== rowId))
    } else {
      setCustomGroups((prev) => ({
        ...prev,
        [group]: (prev[group] ?? []).filter((row) => row.id !== rowId),
      }))
    }

    setValues((prev) => {
      const next = { ...prev }
      delete next[rowId]
      return next
    })
    setNotes((prev) => {
      const next = { ...prev }
      delete next[rowId]
      return next
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next[rowId]
      return next
    })
  }

  const handlePasteFromExcel = async () => {
    setPasteOpen(true)
    setPasteMessage(null)

    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) return

    try {
      const clipboard = await navigator.clipboard.readText()
      if (clipboard.trim()) {
        setPasteInput(clipboard)
      }
    } catch {
      // Ignore clipboard permission failures and let the user paste manually.
    }
  }

  const applyPastedRows = () => {
    const lines = pasteInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length === 0) {
      setPasteMessage('Paste at least one row from Excel first.')
      return
    }

    const baseRowMap = new Map<string, string>()
    Object.values(baseOutcomeGroups).flat().forEach((row) => {
      baseRowMap.set(row.code.toLowerCase(), row.id)
    })

    let updatedExisting = 0
    const appended: IndicatorRow[] = []

    lines.forEach((line, index) => {
      const columns = line.split('\t').map((cell) => cell.trim())
      const [code = '', name = '', value = '', unit = '', note = ''] = columns

      if (!code && !name && !value) return

      const matchingId = baseRowMap.get(code.toLowerCase())
      if (matchingId) {
        if (value) setValue(matchingId, value)
        if (note) setNotes((prev) => ({ ...prev, [matchingId]: note }))
        updatedExisting += 1
        return
      }

      const rowId = `pasted-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`
      appended.push({
        id: rowId,
        code,
        name: name || 'Pasted indicator',
        unit,
        isCustom: true,
      })
      if (value) {
        setValue(rowId, value)
      }
      if (note) {
        setNotes((prev) => ({ ...prev, [rowId]: note }))
      }
    })

    if (appended.length > 0) {
      setPastedRows((prev) => [...prev, ...appended])
    }

    setPasteMessage(
      `Added ${appended.length} new row${appended.length === 1 ? '' : 's'} and updated ${updatedExisting} existing indicator${updatedExisting === 1 ? '' : 's'}.`,
    )
    setPasteInput('')
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-lg">
      <WizardProgress steps={WIZARD_STEPS} currentStep={3} />

      <div className="flex items-center justify-between gap-md flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-primary">Manual Data Entry</h2>
          <p className="text-on-surface-variant mt-xs">Step 3 of 5 - Enter indicator values directly.</p>
        </div>
        <button
          onClick={handlePasteFromExcel}
          className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-sm font-semibold hover:border-primary text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">content_paste</span>
          Paste from Excel
        </button>
      </div>

      {pasteOpen && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between gap-sm flex-wrap">
            <div>
              <h3 className="text-base font-semibold text-primary">Paste Rows from Excel</h3>
              <p className="text-xs text-on-surface-variant mt-xs">
                Paste tab-separated rows in this order: `Code`, `Name`, `Value`, `Unit`, `Notes`.
              </p>
            </div>
            <button
              onClick={() => setPasteOpen(false)}
              className="text-sm font-semibold text-on-surface-variant hover:text-primary"
            >
              Close
            </button>
          </div>
          <textarea
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            rows={6}
            className="w-full border border-outline-variant bg-surface rounded-xl px-md py-sm text-sm outline-none focus:border-primary resize-y"
            placeholder={'O2.1\tLaws enacted on SRHR\t4\tcount\tApproved by parliament'}
          />
          {pasteMessage && (
            <div className="rounded-lg bg-primary-fixed/40 px-md py-sm text-sm text-on-primary-fixed">
              {pasteMessage}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={applyPastedRows}
              className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Apply Pasted Rows
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-lg">
        {groups.map(({ group, rows }) => (
          <div key={group} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="bg-primary px-md py-sm">
              <h3 className="text-sm font-bold text-on-primary">{group}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-28">Code</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Indicator</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-32">Value</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-28">Unit</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-48">Notes</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const location = { group, rowId: row.id }
                    const isCustom = !!row.isCustom

                    return (
                      <tr key={row.id} className={`border-t border-outline-variant/20 ${errors[row.id] ? 'bg-error-container/20' : ''}`}>
                        <td className="px-md py-sm">
                          {isCustom ? (
                            <input
                              type="text"
                              value={row.code}
                              onChange={(e) => updateRow(location, 'code', e.target.value)}
                              className="w-full border border-outline-variant bg-surface-container rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                              placeholder="Code"
                            />
                          ) : (
                            <span className="text-xs font-bold text-on-surface-variant">{row.code}</span>
                          )}
                        </td>
                        <td className="px-md py-sm">
                          {isCustom ? (
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => updateRow(location, 'name', e.target.value)}
                              className="w-full border border-outline-variant bg-surface-container rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                              placeholder="Indicator name"
                            />
                          ) : (
                            <span className="text-sm text-on-surface">{row.name}</span>
                          )}
                        </td>
                        <td className="px-md py-sm">
                          <div>
                            <input
                              type="text"
                              value={values[row.id] ?? ''}
                              onChange={(e) => setValue(row.id, e.target.value)}
                              className={`w-full border rounded-lg px-sm py-xs text-sm outline-none ${
                                errors[row.id]
                                  ? 'border-error bg-error-container/20 text-on-error-container'
                                  : 'border-outline-variant bg-surface-container focus:border-primary'
                              }`}
                              placeholder="0"
                            />
                            {errors[row.id] && <p className="text-xs text-error mt-xs">{errors[row.id]}</p>}
                          </div>
                        </td>
                        <td className="px-md py-sm">
                          {isCustom ? (
                            <input
                              type="text"
                              value={row.unit}
                              onChange={(e) => updateRow(location, 'unit', e.target.value)}
                              className="w-full border border-outline-variant bg-surface-container rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                              placeholder="Unit"
                            />
                          ) : (
                            <span className="text-xs text-on-surface-variant">{row.unit}</span>
                          )}
                        </td>
                        <td className="px-md py-sm">
                          <input
                            type="text"
                            value={notes[row.id] ?? ''}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            className="w-full border border-outline-variant bg-surface-container rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                            placeholder="Optional..."
                          />
                        </td>
                        <td className="px-md py-sm">
                          {isCustom ? (
                            <button
                              onClick={() => removeCustomRow(location)}
                              className="text-sm font-semibold text-error hover:underline"
                            >
                              Remove
                            </button>
                          ) : (
                            <span className="text-xs text-on-surface-variant">Base</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-md py-sm border-t border-outline-variant/20">
              <button
                onClick={() => addIndicatorRow(group)}
                className="text-sm text-primary font-semibold flex items-center gap-xs group"
              >
                <span className="material-symbols-outlined text-[16px] no-underline">add</span>
                <span className="group-hover:underline">Add Indicator Row</span>
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
