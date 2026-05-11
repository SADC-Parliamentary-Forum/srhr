'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type FilterType = 'All' | 'Stories' | 'Photos' | 'Videos' | 'Documents'

interface EvidenceFile {
  name: string
  size: string | null
  bytes: number | null
  url: string | null
}

interface EvidenceItem {
  id: number
  title: string
  description: string | null
  evidence_type: string
  country: string | null
  period: string | null
  status: string
  tags: string[]
  linked_indicators: string[]
  files_count: number
  files: EvidenceFile[]
  file_size: string | null
  owner: string
  created_at: string
  created_label: string
}

const FILTERS: FilterType[] = ['All', 'Stories', 'Photos', 'Videos', 'Documents']

const typeIcon: Record<string, string> = {
  All: 'folder',
  Stories: 'auto_stories',
  story: 'auto_stories',
  Photos: 'photo_library',
  photo: 'photo_library',
  image: 'photo_library',
  Videos: 'videocam',
  video: 'videocam',
  Documents: 'description',
  document: 'description',
  research: 'description',
  pdf: 'picture_as_pdf',
}

function resolveFilterType(evidenceType: string): FilterType {
  const t = evidenceType.toLowerCase()
  if (t.includes('story')) return 'Stories'
  if (t.includes('photo') || t.includes('image') || t.includes('picture')) return 'Photos'
  if (t.includes('video') || t.includes('film') || t.includes('recording')) return 'Videos'
  return 'Documents'
}

function getIcon(evidenceType: string): string {
  return typeIcon[evidenceType.toLowerCase()] ?? typeIcon[resolveFilterType(evidenceType)] ?? 'folder'
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase()
  if (s === 'approved' || s === 'published') return 'bg-primary-fixed text-on-primary-fixed'
  if (s === 'submitted' || s === 'pending' || s === 'review') return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  if (s === 'rejected') return 'bg-error-container text-on-error-container'
  return 'bg-surface-container text-on-surface-variant'
}

function formatDate(raw: string): string {
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function buildSearchText(item: EvidenceItem): string {
  return [
    item.title,
    item.description ?? '',
    item.country ?? '',
    item.period ?? '',
    item.owner,
    item.evidence_type,
    item.tags.join(' '),
    item.linked_indicators.join(' '),
  ].join(' ').toLowerCase()
}

export default function EvidenceLibraryPage() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All Countries')
  const [period, setPeriod] = useState('All Periods')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      setError('Sign in to view the evidence library.')
      return
    }

    api.get<EvidenceItem[]>('/portal/evidence', token)
      .then((items) => {
        setEvidenceItems(items)
        setSelectedEvidence(items[0] ?? null)
      })
      .catch(() => setError('Unable to load evidence.'))
      .finally(() => setLoading(false))
  }, [])

  const countries = useMemo(
    () => ['All Countries', ...Array.from(new Set(evidenceItems.map((item) => item.country).filter(Boolean)))],
    [evidenceItems],
  )

  const periods = useMemo(
    () => ['All Periods', ...Array.from(new Set(evidenceItems.map((item) => item.period).filter(Boolean)))],
    [evidenceItems],
  )

  const filtered = useMemo(
    () =>
      evidenceItems.filter((item) => {
        const itemFilterType = resolveFilterType(item.evidence_type)
        const matchType = activeFilter === 'All' || itemFilterType === activeFilter
        const matchSearch = buildSearchText(item).includes(search.toLowerCase())
        const matchCountry = country === 'All Countries' || item.country === country
        const matchPeriod = period === 'All Periods' || item.period === period

        return matchType && matchSearch && matchCountry && matchPeriod
      }),
    [activeFilter, country, evidenceItems, period, search],
  )

  useEffect(() => {
    if (!selectedEvidence) {
      setSelectedEvidence(filtered[0] ?? null)
      return
    }

    const exists = filtered.some((item) => item.id === selectedEvidence.id)
    if (!exists) {
      setSelectedEvidence(filtered[0] ?? null)
    }
  }, [filtered, selectedEvidence])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="material-symbols-outlined text-[#00170d] text-5xl animate-spin">progress_activity</span>
      </div>
    )
  }

  if (error) {
    return <div className="flex-1 flex items-center justify-center text-error">{error}</div>
  }

  const summary = {
    total: evidenceItems.length,
    filtered: filtered.length,
    submitted: evidenceItems.filter((item) => item.status.toLowerCase() === 'submitted').length,
    withFiles: evidenceItems.filter((item) => item.files_count > 0).length,
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-md xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#00170d]">Evidence Library</h2>
          <p className="text-on-surface-variant mt-xs">Browse, filter, and open the evidence uploaded across the portal.</p>
        </div>
        <div className="flex gap-sm flex-wrap">
          <Link href="/portal/data-capture/evidence" className="px-md py-sm rounded-full bg-[#fed65b] text-[#00170d] text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Upload Evidence
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-md py-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Total Items</p>
          <p className="text-2xl font-bold text-[#00170d] mt-xs">{summary.total}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-md py-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Matching Filters</p>
          <p className="text-2xl font-bold text-[#00170d] mt-xs">{summary.filtered}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-md py-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Submitted</p>
          <p className="text-2xl font-bold text-[#00170d] mt-xs">{summary.submitted}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-md py-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">With Files</p>
          <p className="text-2xl font-bold text-[#00170d] mt-xs">{summary.withFiles}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-md flex flex-col gap-md">
        <div className="flex flex-col lg:flex-row gap-md lg:items-center">
          <div className="relative lg:w-72">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-[#00170d] w-full"
              placeholder="Search title, tags, country, indicators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-sm flex-wrap">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex items-center gap-xs px-sm py-xs rounded-full text-sm font-semibold transition-colors ${
                  activeFilter === filter ? 'bg-[#00170d] text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{typeIcon[filter]}</span>
                {filter}
              </button>
            ))}
          </div>

          <div className="flex gap-sm flex-col sm:flex-row lg:ml-auto">
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
              {countries.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
              {periods.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] mb-md">search_off</span>
          <p className="text-lg font-semibold">No evidence found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-lg items-start">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Type</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Title</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Country</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Period</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Files</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const active = selectedEvidence?.id === item.id

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedEvidence(item)}
                        className={`border-t border-outline-variant/20 cursor-pointer transition-colors ${
                          active ? 'bg-primary-fixed/10' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <td className="px-md py-sm">
                          <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#00170d] text-[18px]">{getIcon(item.evidence_type)}</span>
                          </div>
                        </td>
                        <td className="px-md py-sm">
                          <div className="min-w-[200px]">
                            <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                            <p className="text-xs text-on-surface-variant mt-[2px]">{item.owner}</p>
                          </div>
                        </td>
                        <td className="px-md py-sm text-sm text-on-surface">{item.country ?? 'Regional'}</td>
                        <td className="px-md py-sm text-sm text-on-surface-variant">{item.period ?? 'N/A'}</td>
                        <td className="px-md py-sm">
                          <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusBadgeClass(item.status)}`}>{item.status}</span>
                        </td>
                        <td className="px-md py-sm text-sm text-on-surface-variant">{item.files_count}</td>
                        <td className="px-md py-sm text-sm text-on-surface-variant whitespace-nowrap">{formatDate(item.created_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#00170d] rounded-xl p-lg shadow-sm flex flex-col gap-md xl:sticky xl:top-8">
            {selectedEvidence ? (
              <>
                <div className="flex items-start justify-between gap-md">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[24px]">{getIcon(selectedEvidence.evidence_type)}</span>
                  </div>
                  <div className="flex flex-wrap gap-xs justify-end">
                    <span className="text-xs font-semibold bg-[#fed65b]/20 text-[#fed65b] px-sm py-xs rounded-full">{selectedEvidence.evidence_type}</span>
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusBadgeClass(selectedEvidence.status)}`}>{selectedEvidence.status}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedEvidence.title}</h3>
                  <p className="text-white/70 text-sm mt-sm">
                    {selectedEvidence.description?.trim() || 'No description was provided for this evidence item.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <div className="bg-white/8 rounded-lg px-md py-sm">
                    <p className="text-xs uppercase tracking-wide text-white/50">Country</p>
                    <p className="text-sm font-semibold text-white mt-xs">{selectedEvidence.country ?? 'Regional'}</p>
                  </div>
                  <div className="bg-white/8 rounded-lg px-md py-sm">
                    <p className="text-xs uppercase tracking-wide text-white/50">Period</p>
                    <p className="text-sm font-semibold text-white mt-xs">{selectedEvidence.period ?? 'N/A'}</p>
                  </div>
                  <div className="bg-white/8 rounded-lg px-md py-sm">
                    <p className="text-xs uppercase tracking-wide text-white/50">Uploaded By</p>
                    <p className="text-sm font-semibold text-white mt-xs">{selectedEvidence.owner}</p>
                  </div>
                  <div className="bg-white/8 rounded-lg px-md py-sm">
                    <p className="text-xs uppercase tracking-wide text-white/50">Created</p>
                    <p className="text-sm font-semibold text-white mt-xs">{selectedEvidence.created_label}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-xs">
                  {selectedEvidence.tags.length > 0 ? (
                    selectedEvidence.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/10 text-white/80 px-sm py-xs rounded-full">{tag}</span>
                    ))
                  ) : (
                    <span className="text-xs text-white/55">No tags added.</span>
                  )}
                </div>

                <div className="bg-white/8 rounded-xl p-md flex flex-col gap-sm">
                  <div className="flex items-center justify-between gap-sm">
                    <div>
                      <p className="text-sm font-semibold text-white">Attached Files</p>
                      <p className="text-xs text-white/55 mt-[2px]">
                        {selectedEvidence.files_count} file{selectedEvidence.files_count === 1 ? '' : 's'}
                        {selectedEvidence.file_size ? ` • ${selectedEvidence.file_size}` : ''}
                      </p>
                    </div>
                  </div>

                  {selectedEvidence.files.length > 0 ? (
                    <div className="flex flex-col gap-sm">
                      {selectedEvidence.files.map((file) => (
                        <div key={`${selectedEvidence.id}-${file.name}`} className="bg-white/6 rounded-lg px-md py-sm flex items-center justify-between gap-sm">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                            <p className="text-xs text-white/55">{file.size ?? 'Size unavailable'}</p>
                          </div>
                          {file.url ? (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 px-sm py-xs rounded-full bg-[#fed65b] text-[#00170d] text-xs font-semibold hover:opacity-90"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-xs text-white/40 shrink-0">Unavailable</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-white/15 px-md py-md text-sm text-white/60">
                      No files were attached to this evidence item.
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white mb-sm">Linked Indicators</p>
                  <div className="flex flex-wrap gap-xs">
                    {selectedEvidence.linked_indicators.length > 0 ? (
                      selectedEvidence.linked_indicators.map((indicator) => (
                        <span key={indicator} className="text-xs bg-white/10 text-white/80 px-sm py-xs rounded-full">{indicator}</span>
                      ))
                    ) : (
                      <span className="text-xs text-white/55">No indicators linked.</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-white/70 text-sm">Select an evidence item to inspect its details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
