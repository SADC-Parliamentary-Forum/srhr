'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'

interface EvidenceFile {
  name: string
  size: string
  type: string
  file?: File
}

type Metadata = {
  countries: Array<{ id: number; name: string }>
  periods: Array<{ id: number; label: string }>
  indicators: Array<{ code: string; name: string }>
  evidence_types: string[]
}

const fileTypeIcon: Record<string, string> = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  jpg: 'image',
  png: 'image',
  mp4: 'videocam',
}

export default function EvidenceUploadPage() {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [files, setFiles] = useState<EvidenceFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [evidenceType, setEvidenceType] = useState('')
  const [country, setCountry] = useState('')
  const [period, setPeriod] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [linkedIndicators, setLinkedIndicators] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch('/api/portal/evidence/metadata', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMetadata)
      .catch(() => setError('Unable to load evidence form data.'))
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.name.split('.').pop() ?? 'file',
      file: f,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const toggleIndicator = (indicator: string) =>
    setLinkedIndicators((prev) => prev.includes(indicator) ? prev.filter((item) => item !== indicator) : [...prev, indicator])

  async function submitEvidence(status: 'draft' | 'submitted') {
    const token = getToken()
    if (!token) return

    setSubmitting(true)
    setError(null)
    setMessage(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('evidence_type', evidenceType)
    if (country) formData.append('country_id', country)
    if (period) formData.append('reporting_period_id', period)
    formData.append('status', status)
    tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag))
    linkedIndicators.forEach((indicator, index) => formData.append(`linked_indicators[${index}]`, indicator))
    files.forEach((item) => {
      if (item.file) formData.append('files[]', item.file)
    })

    try {
      const res = await fetch('/api/portal/evidence', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message ?? 'Unable to save evidence.')
        return
      }

      setMessage(data?.message ?? 'Evidence saved.')
      if (status === 'submitted') {
        setTitle('')
        setDescription('')
        setEvidenceType('')
        setCountry('')
        setPeriod('')
        setTags([])
        setTagInput('')
        setLinkedIndicators([])
        setFiles([])
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-lg max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold text-primary">Upload Evidence</h2>
        <p className="text-on-surface-variant mt-xs">Attach supporting documents, photos, and research to your reports.</p>
      </div>

      {message && <div className="rounded-lg bg-primary-fixed px-md py-sm text-sm text-on-primary-fixed">{message}</div>}
      {error && <div className="rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-md">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-lg gap-sm transition-colors ${
              dragging ? 'border-primary bg-primary-fixed/10' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'
            }`}
          >
            <span className="material-symbols-outlined text-[48px] text-outline-variant">upload_file</span>
            <p className="text-base font-semibold text-on-surface">Drop files here</p>
            <p className="text-xs text-on-surface-variant">PDF, images, video - max 50MB</p>
            <label className="px-md py-xs rounded-full border border-primary text-primary text-sm font-semibold cursor-pointer hover:bg-primary-fixed transition-colors mt-xs">
              Browse Files
              <input type="file" multiple className="hidden" onChange={(e) => {
                const newFiles = Array.from(e.target.files ?? []).map((f) => ({
                  name: f.name,
                  size: `${(f.size / 1024).toFixed(1)} KB`,
                  type: f.name.split('.').pop() ?? 'file',
                  file: f,
                }))
                setFiles((prev) => [...prev, ...newFiles])
              }} />
            </label>
          </div>

          {files.length > 0 && (
            <div className="flex flex-col gap-sm">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-sm bg-surface-container-lowest rounded-lg p-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">{fileTypeIcon[file.type] ?? 'attach_file'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                    <p className="text-xs text-on-surface-variant">{file.size}</p>
                  </div>
                  <button onClick={() => setFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index))} className="text-error hover:opacity-70 text-xs font-semibold">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-md">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-primary" placeholder="Evidence title..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-primary resize-none" placeholder="Describe this evidence..." />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Evidence Type</label>
              <select value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                <option value="">Select type...</option>
                {metadata?.evidence_types.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                <option value="">Select...</option>
                {metadata?.countries.map((countryOption) => <option key={countryOption.id} value={String(countryOption.id)}>{countryOption.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Reporting Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
              <option value="">Select period...</option>
              {metadata?.periods.map((periodOption) => <option key={periodOption.id} value={String(periodOption.id)}>{periodOption.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Tags</label>
            <div className="flex gap-sm mb-sm">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary" placeholder="Add tag and press Enter..." />
              <button onClick={addTag} className="px-sm py-xs rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90">Add</button>
            </div>
            <div className="flex flex-wrap gap-xs">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-xs bg-surface-container text-on-surface-variant text-xs px-sm py-xs rounded-full border border-outline-variant">
                  {tag}
                  <button onClick={() => setTags((prev) => prev.filter((item) => item !== tag))} className="hover:text-error">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Link to Indicators</label>
            <div className="flex flex-col gap-xs">
              {metadata?.indicators.map((indicator) => (
                <label key={indicator.code} className="flex items-center gap-sm cursor-pointer text-sm">
                  <input type="checkbox" checked={linkedIndicators.includes(indicator.code)} onChange={() => toggleIndicator(indicator.code)} className="text-primary rounded" />
                  {indicator.code} - {indicator.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-sm pt-md border-t border-outline-variant/20">
            <button disabled={submitting} onClick={() => submitEvidence('draft')} className="flex-1 px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors disabled:opacity-60">
              Save Draft
            </button>
            <button disabled={submitting} onClick={() => submitEvidence('submitted')} className="flex-1 px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              Submit Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
