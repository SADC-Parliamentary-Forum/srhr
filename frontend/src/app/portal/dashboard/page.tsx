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

type ChartDatum = {
  label: string
  value: number
  tone?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'danger'
}

function statusColor(status: string) {
  const key = status.toLowerCase()
  if (key.includes('approved') || key.includes('submitted')) return 'bg-primary-fixed text-on-primary-fixed'
  if (key.includes('review') || key.includes('progress')) return 'bg-secondary-fixed text-on-secondary-fixed-variant'
  return 'bg-surface-container text-on-surface-variant'
}

function parseMetric(value: string): number {
  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function toneClasses(tone: ChartDatum['tone']) {
  switch (tone) {
    case 'secondary':
      return { bar: 'bg-secondary', chip: 'bg-secondary-container text-on-secondary-container' }
    case 'tertiary':
      return { bar: 'bg-[#446555]', chip: 'bg-[#d0e8d7] text-[#173526]' }
    case 'danger':
      return { bar: 'bg-error', chip: 'bg-error-container text-on-error-container' }
    case 'neutral':
      return { bar: 'bg-outline', chip: 'bg-surface-container text-on-surface-variant' }
    default:
      return { bar: 'bg-primary', chip: 'bg-primary-fixed text-on-primary-fixed' }
  }
}

function MiniBarChart({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: ChartDatum[]
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="bg-surface-container-lowest p-md rounded-lg shadow-sm border border-outline-variant/20 min-h-[240px] flex flex-col">
      <div className="mb-md">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-xs">{subtitle}</p>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-sm">
        {items.map((item) => {
          const width = `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0)}%`
          const colors = toneClasses(item.tone)

          return (
            <div key={item.label} className="space-y-xs">
              <div className="flex items-center justify-between gap-sm">
                <span className="text-xs font-semibold text-on-surface truncate">{item.label}</span>
                <span className={`shrink-0 rounded-full px-sm py-[2px] text-[11px] font-semibold ${colors.chip}`}>
                  {item.value}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container overflow-hidden">
                <div className={`h-full rounded-full ${colors.bar}`} style={{ width }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: ChartDatum[]
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const circumference = 2 * Math.PI * 38
  let offset = 0

  const strokeForTone = (tone: ChartDatum['tone']) => {
    switch (tone) {
      case 'secondary':
        return '#fed65b'
      case 'tertiary':
        return '#446555'
      case 'danger':
        return '#ba1a1a'
      case 'neutral':
        return '#727974'
      default:
        return '#00170d'
    }
  }

  return (
    <div className="bg-surface-container-lowest p-md rounded-lg shadow-sm border border-outline-variant/20 min-h-[240px] flex flex-col">
      <div className="mb-md">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-xs">{subtitle}</p>
      </div>
      <div className="flex-1 flex items-center gap-md">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="38" fill="none" stroke="#dfe4e1" strokeWidth="14" />
            {items.map((item) => {
              const dash = total > 0 ? (item.value / total) * circumference : 0
              const segment = (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r="38"
                  fill="none"
                  stroke={strokeForTone(item.tone)}
                  strokeWidth="14"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              )
              offset += dash
              return segment
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-primary">{total}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-sm">
          {items.map((item) => {
            const colors = toneClasses(item.tone)
            return (
              <div key={item.label} className="flex items-center justify-between gap-sm">
                <div className="flex items-center gap-xs min-w-0">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors.bar}`} />
                  <span className="text-xs font-medium text-on-surface truncate">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">{item.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TimelineChart({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: Array<{ label: string; value: number }>
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="bg-surface-container-lowest p-md rounded-lg shadow-sm border border-outline-variant/20 min-h-[240px] flex flex-col">
      <div className="mb-md">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-xs">{subtitle}</p>
      </div>
      <div className="flex-1 flex items-end gap-sm">
        {items.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-sm">
            <span className="text-xs font-semibold text-on-surface-variant">{item.value}</span>
            <div className="w-full max-w-[44px] rounded-t-xl bg-surface-container overflow-hidden flex items-end h-32">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-primary to-[#446555]"
                style={{ height: `${Math.max((item.value / max) * 100, item.value > 0 ? 10 : 0)}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-on-surface-variant text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
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
  const kpiByLabel = Object.fromEntries(kpiCards.map((card) => [card.label, parseMetric(card.value)]))

  const countryPerformance: ChartDatum[] = [
    { label: data?.user.country ?? 'Regional', value: kpiByLabel['Reports Submitted'] ?? 0, tone: 'primary' },
    { label: 'Evidence', value: kpiByLabel['Evidence Uploaded'] ?? 0, tone: 'secondary' },
    { label: 'Pending', value: kpiByLabel['Reports Pending'] ?? 0, tone: 'neutral' },
  ]

  const outcomePerformance: ChartDatum[] = [
    { label: 'Achieved', value: kpiByLabel['Indicators Achieved'] ?? 0, tone: 'primary' },
    { label: 'On Track', value: kpiByLabel['Indicators On Track'] ?? 0, tone: 'secondary' },
    { label: 'At Risk', value: kpiByLabel['Indicators At Risk'] ?? 0, tone: 'danger' },
  ]

  const indicatorStatus: ChartDatum[] = [
    { label: 'Submitted', value: kpiByLabel['Reports Submitted'] ?? 0, tone: 'tertiary' },
    { label: 'Pending', value: kpiByLabel['Reports Pending'] ?? 0, tone: 'neutral' },
    { label: 'Evidence', value: kpiByLabel['Evidence Uploaded'] ?? 0, tone: 'secondary' },
  ]

  const submissionTimeline = [
    { label: 'Activity', value: recentActivity.length },
    { label: 'Deadlines', value: deadlines.length },
    { label: 'Reports', value: kpiByLabel['Reports Submitted'] ?? 0 },
    { label: 'Evidence', value: kpiByLabel['Evidence Uploaded'] ?? 0 },
  ]

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
            <MiniBarChart
              title="Country Performance"
              subtitle="Live dashboard volumes for the current reporting scope."
              items={countryPerformance}
            />
            <MiniBarChart
              title="Outcome Performance"
              subtitle="Indicator outcomes derived from current KPI counts."
              items={outcomePerformance}
            />
            <DonutChart
              title="Indicator Status"
              subtitle="Distribution of reports, pending work, and evidence items."
              items={indicatorStatus}
            />
            <TimelineChart
              title="Submission Timeline"
              subtitle="Current dashboard activity footprint from live portal data."
              items={submissionTimeline}
            />
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
