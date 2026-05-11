'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type FilterType = 'All' | 'My Reports' | 'Shared with Me' | 'Templates'
const FILTERS: FilterType[] = ['All', 'My Reports', 'Shared with Me', 'Templates']

interface SavedReport {
  id: number
  title: string
  type: string
  typeIcon: string
  tags: string[]
  lastEdited: string
  owner: string
  ownerColor: string
  status: string
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function iconForType(type: string) {
  if (type.toLowerCase().includes('annual')) return 'description'
  if (type.toLowerCase().includes('quarter')) return 'analytics'
  if (type.toLowerCase().includes('research')) return 'summarize'
  return 'table_chart'
}

export default function SavedReportsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Last Edited')
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])

  useEffect(() => {
    const token = getToken()
    if (!token) return

    api.get<Array<{ id: number; title: string; type: string; country: string; lastEdited: string; owner: string; status: string }>>('/portal/reports/saved', token)
      .then((reports) => setSavedReports(reports.map((report) => ({
        id: report.id,
        title: report.title,
        type: report.type,
        typeIcon: iconForType(report.type),
        tags: [report.country, report.status],
        lastEdited: report.lastEdited,
        owner: initials(report.owner),
        ownerColor: 'bg-primary',
        status: report.status,
      }))))
      .catch(() => setSavedReports([]))
  }, [])

  const filtered = savedReports.filter((report) => {
    const matchSearch = report.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'All' ||
      (activeFilter === 'My Reports' && report.status !== 'published') ||
      (activeFilter === 'Shared with Me' && report.status === 'approved') ||
      (activeFilter === 'Templates' && report.type === 'Template')
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <h2 className="text-3xl font-bold text-primary">Saved Reports</h2>
          <span className="bg-surface-container text-on-surface-variant text-sm font-semibold px-sm py-xs rounded-full">{filtered.length}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary w-64"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-sm flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-sm py-xs rounded-full text-sm font-semibold transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm outline-none focus:border-primary"
          >
            <option>Last Edited</option>
            <option>Title A-Z</option>
            <option>Type</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filtered.map((report) => (
            <div key={report.id} className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow flex flex-col gap-sm">
              <div className="flex items-start gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">{report.typeIcon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-on-surface leading-tight">{report.title}</h3>
                  <span className="text-xs text-on-surface-variant">{report.type}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-xs">
                {report.tags.map((tag) => (
                  <span key={tag} className="text-xs px-xs py-[2px] rounded-full bg-surface-container text-on-surface-variant">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Edited {report.lastEdited}</span>
                <div className={`w-6 h-6 rounded-full ${report.ownerColor} text-on-primary flex items-center justify-center text-[10px] font-bold`}>
                  {report.owner}
                </div>
              </div>
              <div className="flex gap-sm pt-sm border-t border-outline-variant/20">
                <button className="flex-1 text-sm font-semibold text-primary hover:text-secondary transition-colors text-center py-xs">Open</button>
                <button className="flex-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors text-center py-xs">Share</button>
                <button className="flex-1 text-sm font-semibold text-error hover:text-on-error-container transition-colors text-center py-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[64px] mb-md">folder_open</span>
          <p className="text-lg font-semibold">No reports found</p>
          <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}
