'use client'

import { useState } from 'react'

interface PublishableItem {
  title: string
  type: 'Report' | 'Story' | 'Resource'
  isPublic: boolean
  lastPublished: string
  status: string
}

const initialItems: PublishableItem[] = [
  { title: 'Malawi Q1 2026 Summary Report', type: 'Report', isPublic: true, lastPublished: 'May 1, 2026', status: 'Published' },
  { title: 'How Mobile Clinics Changed Maternal Health', type: 'Story', isPublic: true, lastPublished: 'May 5, 2026', status: 'Published' },
  { title: 'SADC Regional Overview Q3 2024', type: 'Report', isPublic: false, lastPublished: 'Mar 15, 2026', status: 'Private' },
  { title: 'SADC SRHR Framework 2025', type: 'Resource', isPublic: true, lastPublished: 'Apr 20, 2026', status: 'Published' },
  { title: 'Youth-Led Advocacy Story Kenya', type: 'Story', isPublic: false, lastPublished: 'Apr 28, 2026', status: 'Private' },
  { title: 'Q1 2026 Evidence Summary Report', type: 'Report', isPublic: false, lastPublished: 'Apr 10, 2026', status: 'Scheduled' },
  { title: 'Community Health Worker Training Footage', type: 'Resource', isPublic: false, lastPublished: '—', status: 'Draft' },
  { title: 'Parliamentary Oversight Manual', type: 'Resource', isPublic: true, lastPublished: 'Mar 1, 2026', status: 'Published' },
]

const typeBadge: Record<string, string> = {
  Report: 'bg-primary-fixed text-on-primary-fixed',
  Story: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  Resource: 'bg-surface-container text-on-surface-variant',
}

export default function PublishingLibraryPage() {
  const [items, setItems] = useState<PublishableItem[]>(initialItems)
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const [scheduleFilter, setScheduleFilter] = useState('All')

  const togglePublic = (idx: number) => {
    setItems((prev) => prev.map((item, i) =>
      i === idx ? { ...item, isPublic: !item.isPublic, status: !item.isPublic ? 'Published' : 'Private' } : item
    ))
  }

  const filtered = items.filter((item) => {
    if (scheduleFilter === 'Scheduled') return item.status === 'Scheduled'
    if (scheduleFilter === 'Published') return item.isPublic
    return true
  })

  const preview = items[selectedIdx]

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Public Publishing</h2>
          <p className="text-on-surface-variant mt-xs">Control what appears on the public SRHR portal.</p>
        </div>
        <div className="flex gap-sm">
          <select value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
            <option>All</option>
            <option>Published</option>
            <option>Scheduled</option>
          </select>
          <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
            Bulk Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Items Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Title</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Type</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Visibility</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Last Published</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const actualIdx = items.indexOf(item)
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedIdx(actualIdx)}
                      className={`border-t border-outline-variant/20 cursor-pointer transition-colors ${selectedIdx === actualIdx ? 'bg-primary-fixed/10' : 'hover:bg-surface-container-low'}`}
                    >
                      <td className="px-md py-sm text-sm text-on-surface font-medium max-w-[200px] truncate">{item.title}</td>
                      <td className="px-md py-sm">
                        <span className={`text-xs font-semibold px-sm py-xs rounded-full ${typeBadge[item.type]}`}>{item.type}</span>
                      </td>
                      <td className="px-md py-sm">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePublic(actualIdx) }}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${item.isPublic ? 'bg-primary' : 'bg-outline-variant'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="ml-sm text-xs text-on-surface-variant">{item.isPublic ? 'Public' : 'Private'}</span>
                      </td>
                      <td className="px-md py-sm text-sm text-on-surface-variant">{item.lastPublished}</td>
                      <td className="px-md py-sm">
                        <button className="text-sm font-semibold text-primary hover:underline">Schedule</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-md">
          <h3 className="text-sm font-semibold text-primary">Preview</h3>
          {preview && (
            <>
              <div className="bg-surface-container-low rounded-xl p-md flex flex-col gap-sm min-h-[200px]">
                <span className={`text-xs font-semibold px-sm py-xs rounded-full self-start ${typeBadge[preview.type]}`}>{preview.type}</span>
                <h4 className="text-sm font-bold text-on-surface leading-snug">{preview.title}</h4>
                <p className="text-xs text-on-surface-variant">This is how this item appears on the public portal to visitors.</p>
                <div className="flex items-center gap-xs text-xs text-on-surface-variant mt-auto">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Published: {preview.lastPublished}
                </div>
              </div>
              <div className={`flex items-center gap-sm p-sm rounded-lg ${preview.isPublic ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[18px]">{preview.isPublic ? 'public' : 'lock'}</span>
                <span className="text-sm font-semibold">{preview.isPublic ? 'Visible to public' : 'Private — not visible'}</span>
              </div>
              <button className="w-full px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
                {preview.isPublic ? 'Unpublish' : 'Publish Now'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
