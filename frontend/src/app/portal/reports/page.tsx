'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type Tab = 'My Reports' | 'Submitted' | 'Review' | 'Approved' | 'Generated' | 'Published'
const TABS: Tab[] = ['My Reports', 'Submitted', 'Review', 'Approved', 'Generated', 'Published']

interface Report {
  id: number
  title: string
  country: string
  period: string
  status: string
  type: string
  completion: number
  summary: string
  lastEdited: string
  owner: string
}

function statusColor(status: string) {
  const key = status.toLowerCase()
  if (key === 'approved' || key === 'published') return 'bg-primary-fixed text-on-primary-fixed'
  if (key === 'review' || key === 'submitted') return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  if (key === 'draft') return 'bg-surface-container text-on-surface'
  return 'bg-error-container text-on-error-container'
}

function accentColor(status: string) {
  const key = status.toLowerCase()
  if (key === 'approved' || key === 'published') return 'bg-primary'
  if (key === 'review' || key === 'submitted') return 'bg-secondary'
  return 'bg-outline-variant'
}

function progressColor(completion: number) {
  if (completion >= 90) return 'bg-primary'
  if (completion >= 60) return 'bg-secondary'
  return 'bg-secondary-container'
}

export default function ReportsWorkspacePage() {
  const [activeTab, setActiveTab] = useState<Tab>('My Reports')
  const [reports, setReports] = useState<Report[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    api.get<Report[]>('/portal/reports', token)
      .then(setReports)
      .catch(() => setError('Unable to load reports.'))
  }, [])

  const filteredReports = reports.filter((report) => {
    const status = report.status.toLowerCase()
    if (activeTab === 'My Reports') return true
    if (activeTab === 'Submitted') return status === 'submitted'
    if (activeTab === 'Review') return status === 'review'
    if (activeTab === 'Approved') return status === 'approved'
    return status === 'published'
  })

  return (
    <div className="flex gap-lg relative">
      <div className="flex-1 flex flex-col gap-md max-w-7xl">
        <div className="flex items-start justify-between mb-sm">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-xs">Reports Workspace</h2>
            <p className="text-on-surface-variant">Manage, review, and track real report records from the backend.</p>
          </div>
          <div className="flex gap-sm">
            <Link href="/portal/reports/builder" className="px-md py-sm rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary-fixed transition-colors">
              Report Builder
            </Link>
            <Link href="/portal/reports/builder" className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity">
              + New Report
            </Link>
          </div>
        </div>

        {error && <div className="rounded-lg bg-error-container text-on-error-container px-md py-sm text-sm">{error}</div>}

        <div className="border-b border-outline-variant flex overflow-x-auto gap-lg text-sm font-semibold">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-sm">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${accentColor(report.status)}`} />
              <div className="flex justify-between items-start mb-sm">
                <span className={`inline-block px-sm py-xs rounded-full text-xs font-semibold ${statusColor(report.status)}`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
                <button className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-xs leading-tight">{report.title}</h3>
              <div className="flex items-center gap-xs text-on-surface-variant text-sm mb-md">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>{report.country}</span>
                <span className="mx-xs">·</span>
                <span>{report.period}</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-md">{report.summary}</p>
              <div className="mb-md">
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant mb-xs">
                  <span>Completion</span>
                  <span>{report.completion}%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className={`${progressColor(report.completion)} h-1.5 rounded-full`} style={{ width: `${report.completion}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant/30">
                <div className="flex items-center gap-xs text-xs font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Updated {report.lastEdited}
                </div>
                <Link href={`/portal/reports/${report.id}/preview`} className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="hidden xl:flex flex-col w-80 bg-surface-container-lowest rounded-xl shadow-sm border border-primary/10 p-md shrink-0 h-fit sticky top-4">
        <div className="flex items-center gap-sm mb-md border-b border-outline-variant pb-sm">
          <span className="material-symbols-outlined text-secondary text-[24px]">auto_awesome</span>
          <h3 className="text-lg font-semibold text-primary">AI Report Assistant</h3>
        </div>
        <div className="flex flex-col gap-md mb-md">
          <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
            <p className="text-sm text-on-surface mb-xs">The workspace is now API-backed. AI review prompts can be layered onto the same live report list.</p>
          </div>
        </div>
        <div className="relative">
          <input className="w-full bg-surface-container rounded-full py-sm pl-md pr-10 border border-outline-variant outline-none text-sm" placeholder="Ask AI..." type="text" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
