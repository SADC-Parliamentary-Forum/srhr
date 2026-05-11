'use client'

import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Report {
  id: number
  title: string
  type: string
  status: string
  summary: string | null
  completion: number
  country: string
  period: string
  due_at: string | null
  published_at: string | null
  is_public: boolean
  lastEdited: string
  owner: string
}

const INDICATOR_TABLE = [
  { indicator: 'Maternal Mortality Ratio', baseline: '450', current: '380', target: '300', status: 'On Track' },
  { indicator: 'Contraceptive Prevalence', baseline: '32%', current: '41%', target: '55%', status: 'On Track' },
  { indicator: 'Adolescent Birth Rate', baseline: '68', current: '59', target: '40', status: 'At Risk' },
  { indicator: 'Skilled Birth Attendance', baseline: '72%', current: '85%', target: '90%', status: 'On Track' },
  { indicator: 'HIV Prevalence Youth', baseline: '4.2%', current: '3.8%', target: '2.0%', status: 'On Track' },
  { indicator: 'SRHR Budget Allocation', baseline: '8%', current: '11%', target: '15%', status: 'At Risk' },
  { indicator: 'Legal Frameworks Enacted', baseline: '2', current: '4', target: '6', status: 'On Track' },
  { indicator: 'Community Outreach Events', baseline: '120', current: '198', target: '200', status: 'On Track' },
]

const statusColors: Record<string, string> = {
  'On Track': 'bg-[#c6ebd7] text-[#00170d]',
  'At Risk': 'bg-[#ffdad6] text-[#93000a]',
  'Off Track': 'bg-[#ffdad6] text-[#93000a]',
}

export default function ReportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [report, setReport] = useState<Report | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    api.get<Report>(`/portal/reports/${id}`, token)
      .then(setReport)
      .catch(() => {})
  }, [id])

  async function handleStatusChange(status: string) {
    const token = getToken()
    if (!token || !report) return
    setSubmitting(true)
    try {
      await api.patch(`/portal/reports/${id}/status`, { status }, token)
      setReport((prev) => prev ? { ...prev, status } : prev)
      setMessage(`Report ${status === 'submitted' ? 'submitted for review' : status}.`)
    } catch {
      setMessage('Failed to update status.')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = report?.status === 'draft'
  const canApprove = report?.status === 'review'
  const canPublish = report?.status === 'approved'

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-sm">
        <div>
          <h2 className="text-3xl font-bold text-primary">
            {report ? `Report Preview: ${report.title}` : 'Report Preview'}
          </h2>
          <p className="text-on-surface-variant mt-xs">
            ID: {id} · {report ? `${report.country} · ${report.period}` : 'Loading…'}
          </p>
          {report && (
            <span className={`inline-flex items-center mt-xs px-sm py-xs rounded-full text-xs font-bold uppercase tracking-wide ${
              report.status === 'published' ? 'bg-[#c6ebd7] text-[#00170d]' :
              report.status === 'approved' ? 'bg-primary-fixed text-on-primary-fixed' :
              report.status === 'review' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' :
              'bg-surface-container text-on-surface'
            }`}>{report.status}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-sm shrink-0">
          <button className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF
          </button>
          <Link
            href={`/portal/reports/${id}/sharing`}
            className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </Link>
          {canSubmit && (
            <button
              disabled={submitting}
              onClick={() => handleStatusChange('submitted')}
              className="flex items-center gap-xs px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Submit for Review
            </button>
          )}
          {canApprove && (
            <button
              disabled={submitting}
              onClick={() => handleStatusChange('approved')}
              className="flex items-center gap-xs px-md py-sm rounded-full bg-primary text-on-primary text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Approve
            </button>
          )}
          {canPublish && (
            <button
              disabled={submitting}
              onClick={() => handleStatusChange('published')}
              className="flex items-center gap-xs px-md py-sm rounded-full bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
              Publish
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-primary-fixed text-on-primary-fixed px-md py-sm text-sm font-medium">
          {message}
        </div>
      )}

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="bg-primary p-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-on-primary/10 rounded-full flex items-center justify-center mb-md">
            <span className="material-symbols-outlined text-on-primary text-[32px]">corporate_fare</span>
          </div>
          <h1 className="text-3xl font-black text-on-primary mb-sm">SRHR Portal</h1>
          <h2 className="text-xl font-semibold text-on-primary/80 mb-xs">
            {report ? report.title : 'Loading…'}
          </h2>
          <p className="text-on-primary/60 text-sm">
            SADC Parliamentary Forum · {report?.country ?? ''} · {report?.period ?? ''}
          </p>
        </div>

        <div className="p-xl flex flex-col gap-xl">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-sm">Executive Summary</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {report?.summary ?? 'This report provides a comprehensive overview of SRHR progress indicators, legislative developments, and programmatic achievements across the reporting period. The data presented reflects consolidated inputs from national focal points, parliamentary submissions, and field monitoring systems.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            {[
              { label: 'Report Progress', value: `${report?.completion ?? 0}%`, sub: 'Completion' },
              { label: 'Country', value: report?.country ?? '—', sub: 'Reporting Entity' },
              { label: 'Period', value: report?.period ?? '—', sub: 'Reporting Period' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-container-lowest rounded-lg p-md border border-outline-variant/20 text-center">
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-xs">{kpi.label}</div>
                <div className="text-3xl font-black text-primary">{kpi.value}</div>
                <div className="text-xs text-on-surface-variant mt-xs">{kpi.sub}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-on-surface mb-sm">Indicator Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    {['Indicator', 'Baseline', 'Current', 'Target', 'Status'].map((h) => (
                      <th key={h} className="text-left py-sm px-md text-xs font-bold text-on-surface-variant uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INDICATOR_TABLE.map((row) => (
                    <tr key={row.indicator} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                      <td className="py-sm px-md text-on-surface font-medium">{row.indicator}</td>
                      <td className="py-sm px-md text-on-surface-variant">{row.baseline}</td>
                      <td className="py-sm px-md text-on-surface font-semibold">{row.current}</td>
                      <td className="py-sm px-md text-on-surface-variant">{row.target}</td>
                      <td className="py-sm px-md">
                        <span className={`px-sm py-xs rounded-full text-xs font-bold ${statusColors[row.status] ?? 'bg-surface-container text-on-surface-variant'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
