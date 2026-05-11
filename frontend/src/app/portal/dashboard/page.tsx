'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

const quickActions = [
  { icon: 'play_arrow', label: 'Continue Monthly Report', href: '/portal/reports', bg: 'bg-primary/10' },
  { icon: 'upload_file', label: 'Upload Indicators', href: '/portal/data-capture/indicators/type', bg: 'bg-secondary-container/30' },
  { icon: 'note_add', label: 'Add Evidence', href: '/portal/data-capture/evidence', bg: 'bg-primary/10' },
  { icon: 'send', label: 'Submit for Review', href: '/portal/reports', bg: 'bg-primary/10' },
]

type DashboardResponse = {
  user: { name: string; country: string }
  kpis: Array<{ label: string; value: string }>
  deadlines: Array<{ report: string; due: string; status: string }>
  recent_activity: Array<{ icon: string; action: string; user: string; time: string }>
}

function statusColor(status: string) {
  const key = status.toLowerCase()
  if (key.includes('approved') || key.includes('submitted')) return 'bg-primary-fixed text-on-primary-fixed'
  if (key.includes('review') || key.includes('progress')) return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  return 'bg-surface-container text-on-surface-variant'
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    api.get<DashboardResponse>('/portal/dashboard', token)
      .then(setData)
      .catch(() => setError('Unable to load dashboard data.'))
  }, [])

  const kpiCards = data?.kpis ?? []
  const recentActivity = data?.recent_activity ?? []
  const deadlines = data?.deadlines ?? []

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="text-3xl font-bold text-primary">
          Welcome, {data?.user.name ?? 'User'} - SRHR Portal Dashboard
        </h2>
        <p className="text-on-surface-variant mt-xs">
          {data?.user.country ?? 'Regional'} reporting dashboard
        </p>
      </div>

      {error && <div className="rounded-lg bg-error-container text-on-error-container px-md py-sm text-sm">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-surface-container-lowest rounded-lg p-md shadow-sm border border-outline-variant/30 flex flex-col items-start gap-sm hover:shadow-md transition-shadow group text-left"
          >
            <div className={`w-10 h-10 rounded-full ${action.bg} flex items-center justify-center group-hover:opacity-80 transition-opacity`}>
              <span className="material-symbols-outlined text-primary text-[20px]">{action.icon}</span>
            </div>
            <span className="text-sm font-semibold text-on-surface">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm md:gap-md">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-surface-container-lowest p-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">{card.label}</span>
            <span className="text-4xl font-black text-primary">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {[
              'Country Performance',
              'Outcome Performance',
              'Indicator Status',
              'Submission Timeline',
            ].map((title) => (
              <div key={title} className="bg-surface-container-lowest p-md rounded-lg shadow-sm border border-outline-variant/20 min-h-[240px] flex flex-col">
                <h3 className="text-lg font-semibold text-on-surface mb-md">{title}</h3>
                <div className="flex-1 bg-surface-container-low rounded border border-dashed border-outline-variant flex items-center justify-center">
                  <span className="text-sm text-on-surface-variant">Data-backed chart hook ready</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-md border-b border-outline-variant/20">
              <h3 className="text-lg font-semibold text-on-surface">Upcoming Deadlines</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Report</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Due Date</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deadlines.map((deadline, index) => (
                    <tr key={index} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm text-sm text-on-surface font-medium">{deadline.report}</td>
                      <td className="px-md py-sm text-sm text-on-surface-variant">{deadline.due}</td>
                      <td className="px-md py-sm">
                        <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusColor(deadline.status)}`}>{deadline.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 flex flex-col gap-md">
          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 p-md">
            <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-2xl">smart_toy</span>
              <h3 className="text-lg font-semibold text-on-surface">AI Analysis</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-md">
              The live metrics are now connected. AI-specific summarisation and drafting can be layered on top of these APIs next.
            </p>
            <div className="flex flex-col gap-sm">
              {['Summarise this dashboard', 'Identify risks', 'Draft report paragraph'].map((prompt) => (
                <button
                  key={prompt}
                  className="w-full text-left bg-surface-container-low hover:bg-surface-container-high transition-colors px-md py-sm rounded-md text-xs font-semibold text-primary flex items-center justify-between border border-outline-variant/20"
                >
                  {prompt}
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-md border-b border-outline-variant/20">
              <h3 className="text-lg font-semibold text-on-surface">Recent Activity</h3>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-sm p-md hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[20px] mt-xs shrink-0 text-primary">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-medium truncate">{item.action}</p>
                    <p className="text-xs text-on-surface-variant">{item.user} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
