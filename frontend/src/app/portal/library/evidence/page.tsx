'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type FilterType = 'All' | 'Stories' | 'Photos' | 'Videos' | 'Documents'
const FILTERS: FilterType[] = ['All', 'Stories', 'Photos', 'Videos', 'Documents']

interface EvidenceItem {
  id: number
  title: string
  evidence_type: string
  country: string
  period: string
  status: string
  tags?: string[]
  created_at: string
  file_size?: string | null
}

const typeIcon: Record<string, string> = {
  All: 'folder',
  Stories: 'auto_stories',
  story: 'auto_stories',
  Photos: 'photo_library',
  photo: 'photo_library',
  image: 'photo_library',
  Videos: 'videocam',
  video: 'videocam',
  Documents: 'picture_as_pdf',
  document: 'picture_as_pdf',
  pdf: 'picture_as_pdf',
}

function resolveFilterType(evidenceType: string): FilterType {
  const t = evidenceType.toLowerCase()
  if (t.includes('story') || t.includes('stories')) return 'Stories'
  if (t.includes('photo') || t.includes('image') || t.includes('picture')) return 'Photos'
  if (t.includes('video') || t.includes('film') || t.includes('footage') || t.includes('recording')) return 'Videos'
  if (t.includes('document') || t.includes('pdf') || t.includes('report') || t.includes('minutes') || t.includes('pack')) return 'Documents'
  return 'Documents'
}

function getIcon(evidenceType: string): string {
  return typeIcon[evidenceType] ?? typeIcon[resolveFilterType(evidenceType)] ?? 'folder'
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase()
  if (s === 'approved' || s === 'published') return 'bg-primary-fixed text-on-primary-fixed'
  if (s === 'pending' || s === 'review') return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  if (s === 'rejected') return 'bg-error-container text-on-error-container'
  return 'bg-surface-container text-on-surface-variant'
}

function formatDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  } catch {
    return raw
  }
}

export default function EvidenceLibraryPage() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All Countries')
  const [period, setPeriod] = useState('All Periods')

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    api.get<EvidenceItem[]>('/portal/evidence', token)
      .then(setEvidenceItems)
      .catch(() => setError('Unable to load evidence.'))
      .finally(() => setLoading(false))
  }, [])

  // Derive filter options from data
  const countries = ['All Countries', ...Array.from(new Set(evidenceItems.map((i) => i.country).filter(Boolean)))]
  const periods = ['All Periods', ...Array.from(new Set(evidenceItems.map((i) => i.period).filter(Boolean)))]

  const filtered = evidenceItems.filter((item) => {
    const itemFilterType = resolveFilterType(item.evidence_type)
    const matchType = activeFilter === 'All' || itemFilterType === activeFilter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchCountry = country === 'All Countries' || item.country === country
    const matchPeriod = period === 'All Periods' || item.period === period || item.created_at.includes(period.split(' ')[0])
    return matchType && matchSearch && matchCountry && matchPeriod
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#00170d] text-5xl animate-spin">progress_activity</span>
    </div>
  )

  if (error) return (
    <div className="flex-1 flex items-center justify-center text-error">{error}</div>
  )

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#00170d]">Evidence Library</h2>
          <p className="text-on-surface-variant mt-xs">Browse and manage all uploaded evidence files.</p>
        </div>
        <Link href="/portal/data-capture/evidence" className="px-md py-sm rounded-full bg-[#fed65b] text-[#00170d] text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload Evidence
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-[#00170d] w-56" placeholder="Search evidence..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-sm flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`flex items-center gap-xs px-sm py-xs rounded-full text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-[#00170d] text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[14px]">{typeIcon[f]}</span>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-sm ml-auto">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
            {periods.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] mb-md">search_off</span>
          <p className="text-lg font-semibold">No evidence found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        /* Masonry-style Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Featured large card */}
          {featured && (
            <div className="md:col-span-1 md:row-span-2 bg-[#00170d] rounded-xl p-md flex flex-col gap-md shadow-sm min-h-[280px]">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[24px]">{getIcon(featured.evidence_type)}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-xs mb-sm">
                  <span className="text-xs font-semibold bg-[#fed65b]/20 text-[#fed65b] px-sm py-xs rounded-full">{featured.evidence_type}</span>
                  <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusBadgeClass(featured.status)}`}>{featured.status}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-sm leading-snug">{featured.title}</h3>
                <div className="flex items-center gap-xs mt-sm text-white/60 text-xs">
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  {featured.country}
                  {featured.period && <><span className="mx-xs">·</span>{featured.period}</>}
                  <span className="mx-xs">·</span>
                  {formatDate(featured.created_at)}
                </div>
                {featured.tags && featured.tags.length > 0 && (
                  <div className="flex flex-wrap gap-xs mt-sm">
                    {featured.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/10 text-white/80 px-xs py-[2px] rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-sm">
                <button className="flex-1 py-xs rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors">View</button>
                <button className="flex-1 py-xs rounded-full bg-[#fed65b] text-[#00170d] text-sm font-semibold hover:opacity-90">Download</button>
              </div>
            </div>
          )}

          {/* Regular cards */}
          {rest.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#00170d] text-[20px]">{getIcon(item.evidence_type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-xs">
                    <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-xs py-[2px] rounded-full">{item.evidence_type}</span>
                    <span className={`text-xs font-semibold px-xs py-[2px] rounded-full ${statusBadgeClass(item.status)}`}>{item.status}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface mt-xs leading-snug">{item.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-xs text-xs text-on-surface-variant flex-wrap">
                <span className="material-symbols-outlined text-[12px]">flag</span>
                {item.country}
                {item.period && <><span className="mx-xs">·</span>{item.period}</>}
                <span className="mx-xs">·</span>
                {formatDate(item.created_at)}
                {item.file_size && <><span className="mx-xs">·</span>{item.file_size}</>}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-xs">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-surface-container text-on-surface-variant px-xs py-[2px] rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-sm pt-sm border-t border-outline-variant/20">
                <button className="flex-1 text-sm font-semibold text-[#00170d] hover:text-secondary transition-colors">View</button>
                <button className="flex-1 text-sm font-semibold text-on-surface-variant hover:text-[#00170d] transition-colors">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
