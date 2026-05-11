'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface EvidenceItem {
  id: number
  title: string
  country: string
  period: string
  status: string
  owner?: string
  created_at: string
}

interface ReportItem {
  id: number
  title: string
  country: string
  period: string
  status: string
  owner: string
  lastEdited: string
}

interface ActivityRow {
  key: string
  type: 'Evidence' | 'Report'
  title: string
  country: string
  period: string
  status: string
  submittedBy: string
  date: string
}

function statusColor(status: string): string {
  const s = status.toLowerCase()
  if (s === 'approved' || s === 'published' || s === 'validated') return 'bg-primary-fixed text-on-primary-fixed'
  if (s === 'submitted' || s === 'review' || s === 'pending') return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  if (s === 'rejected' || s === 'draft') return 'bg-error-container text-on-error-container'
  return 'bg-surface-container text-on-surface-variant'
}

function formatDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return raw
  }
}

export default function DataCapturePage() {
  const [activity, setActivity] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }

    Promise.allSettled([
      api.get<EvidenceItem[]>('/portal/evidence', token),
      api.get<ReportItem[]>('/portal/reports', token),
    ]).then(([evidenceResult, reportsResult]) => {
      const rows: ActivityRow[] = []

      if (evidenceResult.status === 'fulfilled') {
        const items = Array.isArray(evidenceResult.value) ? evidenceResult.value : []
        for (const e of items) {
          rows.push({
            key: `evidence-${e.id}`,
            type: 'Evidence',
            title: e.title,
            country: e.country ?? '—',
            period: e.period ?? '—',
            status: e.status ?? 'Pending',
            submittedBy: e.owner ?? '—',
            date: e.created_at,
          })
        }
      }

      if (reportsResult.status === 'fulfilled') {
        const items = Array.isArray(reportsResult.value) ? reportsResult.value : []
        for (const r of items) {
          rows.push({
            key: `report-${r.id}`,
            type: 'Report',
            title: r.title,
            country: r.country ?? '—',
            period: r.period ?? '—',
            status: r.status ?? 'draft',
            submittedBy: r.owner ?? '—',
            date: r.lastEdited ?? '',
          })
        }
      }

      // Sort by date descending
      rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setActivity(rows.slice(0, 20))
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-lg max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-[#00170d]">Data Capture</h2>
        <p className="text-on-surface-variant mt-xs">Guided reporting and information entry for SRHR indicators and evidence.</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {/* Primary: Upload Indicators */}
        <div className="md:col-span-2 bg-[#00170d] rounded-xl p-md shadow-sm border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
          <div className="absolute -right-xl -top-xl w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-md">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[28px]">upload_file</span>
              </div>
              <span className="text-xs font-semibold bg-[#fed65b]/20 text-[#fed65b] px-sm py-xs rounded-full">Priority Action</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-xs">Upload Reporting Indicators</h3>
            <p className="text-white/80 text-sm">Submit your core quarterly or annual reporting indicators for processing and analysis.</p>
          </div>
          <div className="relative z-10 mt-lg">
            <Link
              href="/portal/data-capture/indicators/type"
              className="inline-flex items-center gap-xs bg-[#fed65b] text-[#00170d] px-lg py-sm rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start Upload
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Secondary: Start Monthly Report */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-[#00170d] mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Start Monthly Report</h4>
            <p className="text-sm text-on-surface-variant">Compile and submit standard monthly progress updates.</p>
          </div>
          <Link href="/portal/reports" className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm border border-[#00170d] text-[#00170d] rounded-full text-sm font-semibold hover:bg-[#00170d] hover:text-white transition-colors">
            Continue Draft
          </Link>
        </div>

        {/* Upload Evidence */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-[#00170d] mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Upload Evidence</h4>
            <p className="text-sm text-on-surface-variant">Attach supporting documents, photos, and research to your reports.</p>
          </div>
          <Link href="/portal/data-capture/evidence" className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm bg-transparent text-[#00170d] rounded-full text-sm font-semibold hover:bg-surface-container transition-colors">
            Upload Evidence
          </Link>
        </div>

        {/* Add Activity */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-[#00170d] mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Add Activity</h4>
            <p className="text-sm text-on-surface-variant">Log new organizational activities or field events.</p>
          </div>
          <button className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm bg-transparent text-[#00170d] rounded-full text-sm font-semibold hover:bg-surface-container transition-colors">
            Log Activity
          </button>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant/20">
          <h3 className="text-base font-semibold text-[#00170d]">Recent Submissions</h3>
          <button className="text-sm text-[#00170d] font-semibold hover:underline">View All</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-lg">
            <span className="material-symbols-outlined text-[#00170d] text-4xl animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Type</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Title</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Country</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Period</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Submitted By</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Date</th>
                  <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activity.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-md py-lg text-center text-sm text-on-surface-variant">No recent submissions.</td>
                  </tr>
                )}
                {activity.map((row) => (
                  <tr key={row.key} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-sm">
                      <span className={`text-xs font-semibold px-sm py-xs rounded-full ${row.type === 'Report' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-md py-sm text-sm text-on-surface max-w-[200px] truncate" title={row.title}>{row.title}</td>
                    <td className="px-md py-sm text-sm text-on-surface">{row.country}</td>
                    <td className="px-md py-sm text-sm text-on-surface-variant">{row.period}</td>
                    <td className="px-md py-sm">
                      <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusColor(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="px-md py-sm text-sm text-on-surface-variant">{row.submittedBy}</td>
                    <td className="px-md py-sm text-sm text-on-surface-variant whitespace-nowrap">{row.date ? formatDate(row.date) : '—'}</td>
                    <td className="px-md py-sm">
                      <button className="text-[#00170d] text-sm font-semibold hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
