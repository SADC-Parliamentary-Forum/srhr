'use client'

import Link from 'next/link'
import { useState } from 'react'

type FilterType = 'All' | 'Stories' | 'Photos' | 'Videos' | 'Documents'
const FILTERS: FilterType[] = ['All', 'Stories', 'Photos', 'Videos', 'Documents']
const COUNTRIES = ['All Countries', 'Malawi', 'Kenya', 'Tanzania', 'Zambia', 'Uganda']
const PERIODS = ['All Periods', 'Q1 2026', 'Q4 2025', 'Q3 2025']

interface EvidenceCard {
  title: string
  type: FilterType
  country: string
  date: string
  size: string
  icon: string
  featured?: boolean
}

const evidenceItems: EvidenceCard[] = [
  { title: 'Maternal Health Outreach — Blantyre Region', type: 'Stories', country: 'Malawi', date: 'May 2026', size: '2.4 MB', icon: 'auto_stories', featured: true },
  { title: 'Youth Clinic Inauguration Photos', type: 'Photos', country: 'Kenya', date: 'Apr 2026', size: '18.2 MB', icon: 'photo_library' },
  { title: 'SRHR Parliamentary Debate Recording', type: 'Videos', country: 'Tanzania', date: 'Apr 2026', size: '45 MB', icon: 'videocam' },
  { title: 'Q1 2026 Evidence Summary Report', type: 'Documents', country: 'Malawi', date: 'Mar 2026', size: '1.1 MB', icon: 'picture_as_pdf' },
  { title: 'Community Health Worker Training Footage', type: 'Videos', country: 'Zambia', date: 'Mar 2026', size: '38 MB', icon: 'videocam' },
  { title: 'Budget Allocation Evidence Pack', type: 'Documents', country: 'Uganda', date: 'Feb 2026', size: '3.2 MB', icon: 'folder_zip' },
  { title: 'Adolescent Health Fair Photos', type: 'Photos', country: 'Kenya', date: 'Feb 2026', size: '12.5 MB', icon: 'photo_library' },
  { title: 'Legislative Change Impact Story', type: 'Stories', country: 'Zimbabwe', date: 'Jan 2026', size: '800 KB', icon: 'auto_stories' },
  { title: 'SADC Ministerial Meeting Minutes', type: 'Documents', country: 'Malawi', date: 'Jan 2026', size: '450 KB', icon: 'description' },
]

const typeIcon: Record<FilterType, string> = {
  All: 'folder', Stories: 'auto_stories', Photos: 'photo_library', Videos: 'videocam', Documents: 'picture_as_pdf',
}

export default function EvidenceLibraryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All Countries')
  const [period, setPeriod] = useState('All Periods')

  const filtered = evidenceItems.filter((item) => {
    const matchType = activeFilter === 'All' || item.type === activeFilter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchCountry = country === 'All Countries' || item.country === country
    const matchPeriod = period === 'All Periods' || item.date.includes(period.split(' ')[0])
    return matchType && matchSearch && matchCountry && matchPeriod
  })

  const featured = filtered.find((i) => i.featured)
  const rest = filtered.filter((i) => !i.featured)

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Evidence Library</h2>
          <p className="text-on-surface-variant mt-xs">Browse and manage all uploaded evidence files.</p>
        </div>
        <Link href="/portal/data-capture/evidence" className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload Evidence
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary w-56" placeholder="Search evidence..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-sm flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`flex items-center gap-xs px-sm py-xs rounded-full text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined text-[14px]">{typeIcon[f]}</span>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-sm ml-auto">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
            {PERIODS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Featured large card */}
        {featured && (
          <div className="md:col-span-1 md:row-span-2 bg-primary rounded-xl p-md flex flex-col gap-md shadow-sm min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-on-primary/10 border border-on-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[24px]">{featured.icon}</span>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold bg-secondary-container/30 text-secondary-fixed px-sm py-xs rounded-full">Featured</span>
              <h3 className="text-lg font-bold text-on-primary mt-sm leading-snug">{featured.title}</h3>
              <div className="flex items-center gap-xs mt-sm text-on-primary/60 text-xs">
                <span className="material-symbols-outlined text-[14px]">flag</span>
                {featured.country}
                <span className="mx-xs">·</span>
                {featured.date}
              </div>
            </div>
            <div className="flex gap-sm">
              <button className="flex-1 py-xs rounded-full bg-on-primary/10 border border-on-primary/20 text-on-primary text-sm font-semibold hover:bg-on-primary/20 transition-colors">View</button>
              <button className="flex-1 py-xs rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">Download</button>
            </div>
          </div>
        )}

        {/* Regular cards */}
        {rest.map((item, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-xs py-[2px] rounded-full">{item.type}</span>
                <h3 className="text-sm font-semibold text-on-surface mt-xs leading-snug">{item.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-xs text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[12px]">flag</span>
              {item.country}
              <span className="mx-xs">·</span>
              {item.date}
              <span className="mx-xs">·</span>
              {item.size}
            </div>
            <div className="flex gap-sm pt-sm border-t border-outline-variant/20">
              <button className="flex-1 text-sm font-semibold text-primary hover:text-secondary transition-colors">View</button>
              <button className="flex-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
