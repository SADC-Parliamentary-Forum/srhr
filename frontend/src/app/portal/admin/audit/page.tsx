'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type Severity = 'Info' | 'Warning' | 'Critical'
type EventType = 'All' | 'Login' | 'Upload' | 'Export' | 'Config'

const EVENT_TYPES: EventType[] = ['All', 'Login', 'Upload', 'Export', 'Config']

interface AuditLog {
  id: number
  action: string
  user: string
  subject_type: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  ip_address?: string | null
  severity?: Severity
}

const severityStyles: Record<Severity, string> = {
  Info: 'bg-surface-container text-on-surface-variant',
  Warning: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  Critical: 'bg-error-container text-on-error-container',
}

function getSeverity(action: string): Severity {
  const lower = action.toLowerCase()
  if (lower.includes('fail') || lower.includes('lock') || lower.includes('suspicious') || lower.includes('critical')) return 'Critical'
  if (lower.includes('warn') || lower.includes('config') || lower.includes('schedule') || lower.includes('2fa')) return 'Warning'
  return 'Info'
}

function getEventType(action: string): string {
  const lower = action.toLowerCase()
  if (lower.includes('login') || lower.includes('logout') || lower.includes('auth')) return 'Login'
  if (lower.includes('upload') || lower.includes('import')) return 'Upload'
  if (lower.includes('export') || lower.includes('download')) return 'Export'
  if (lower.includes('config') || lower.includes('setting') || lower.includes('user') || lower.includes('role') || lower.includes('backup')) return 'Config'
  return 'Login'
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-[#00170d]', 'bg-[#1a5c38]', 'bg-[#2e7d52]',
  'bg-[#4caf82]', 'bg-[#fed65b]', 'bg-[#c65c1a]',
]

function avatarColor(name: string): string {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

const PAGE_SIZE = 10

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [eventFilter, setEventFilter] = useState<EventType>('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    api.get<AuditLog[]>('/admin/audit-logs', token)
      .then(setLogs)
      .catch(() => setError('Unable to load audit logs.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#00170d] text-5xl animate-spin">progress_activity</span>
    </div>
  )

  if (error) return (
    <div className="flex-1 flex items-center justify-center text-error">{error}</div>
  )

  const today = new Date().toISOString().slice(0, 10)

  const filtered = logs.filter((log) => {
    const eventType = getEventType(log.action)
    const severity = getSeverity(log.action)
    const matchEvent = eventFilter === 'All' || eventType === eventFilter
    const matchUser = !userFilter || log.user.toLowerCase().includes(userFilter.toLowerCase())
    const matchSeverity = severityFilter === 'All' || severity === severityFilter
    const logDate = log.created_at.slice(0, 10)
    const matchFrom = !dateFrom || logDate >= dateFrom
    const matchTo = !dateTo || logDate <= dateTo
    return matchEvent && matchUser && matchSeverity && matchFrom && matchTo
  })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const criticalCount = logs.filter((l) => getSeverity(l.action) === 'Critical').length
  const warningCount = logs.filter((l) => getSeverity(l.action) === 'Warning').length
  const todayCount = logs.filter((l) => l.created_at.startsWith(today)).length
  const failedLogins = logs.filter((l) => {
    const lower = l.action.toLowerCase()
    return lower.includes('fail') || lower.includes('lock')
  }).length

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#00170d]">Audit Log</h2>
          <p className="text-on-surface-variant mt-xs">Track all user actions and system events for security compliance.</p>
        </div>
        <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-[#00170d] transition-colors flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-md flex-wrap">
        <div className="flex items-center gap-xs bg-surface-container text-on-surface-variant px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">event_note</span>
          Total Events Today: {todayCount}
        </div>
        <div className="flex items-center gap-xs bg-error-container text-on-error-container px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Critical Alerts: {criticalCount}
        </div>
        <div className="flex items-center gap-xs bg-secondary-fixed text-on-secondary-fixed-variant px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          Failed Logins: {failedLogins}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-md items-center">
        <div className="flex gap-sm items-center">
          <label className="text-xs font-semibold text-on-surface-variant">From</label>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none" />
        </div>
        <div className="flex gap-sm items-center">
          <label className="text-xs font-semibold text-on-surface-variant">To</label>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none" />
        </div>
        <input className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-[#00170d] w-40" placeholder="Filter by user..." value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setPage(1) }} />
        <div className="flex gap-sm flex-wrap">
          {EVENT_TYPES.map((type) => (
            <button key={type} onClick={() => { setEventFilter(type); setPage(1) }} className={`px-sm py-xs rounded-full text-xs font-semibold transition-colors ${eventFilter === type ? 'bg-[#00170d] text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {type}
            </button>
          ))}
        </div>
        <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1) }} className="ml-auto bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
          <option>All</option>
          <option>Info</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>
      </div>

      {/* Log Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Timestamp</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">User</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Event Type</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Action</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Subject</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Severity</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-lg text-center text-sm text-on-surface-variant">No events match the current filters.</td>
                </tr>
              )}
              {displayed.map((log) => {
                const severity = getSeverity(log.action)
                const eventType = getEventType(log.action)
                const initials = getInitials(log.user)
                const color = avatarColor(log.user)
                return (
                  <tr key={log.id} className={`border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors ${severity === 'Critical' ? 'bg-error-container/10' : severity === 'Warning' ? 'bg-secondary-fixed/10' : ''}`}>
                    <td className="px-md py-sm text-xs text-on-surface-variant font-mono whitespace-nowrap">{log.created_at.replace('T', ' ').slice(0, 19)}</td>
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-sm">
                        <div className={`w-6 h-6 rounded-full ${color} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                          {initials}
                        </div>
                        <span className="text-sm text-on-surface whitespace-nowrap">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-md py-sm">
                      <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-sm py-xs rounded-full">{eventType}</span>
                    </td>
                    <td className="px-md py-sm text-sm text-on-surface max-w-[260px]">{log.action}</td>
                    <td className="px-md py-sm text-xs text-on-surface-variant">{log.subject_type ?? '—'}</td>
                    <td className="px-md py-sm">
                      <span className={`text-xs font-semibold px-sm py-xs rounded-full ${severityStyles[severity]}`}>{severity}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-md py-sm border-t border-outline-variant/20">
            <span className="text-xs text-on-surface-variant">
              Page {page} of {pageCount} · {filtered.length} events
            </span>
            <div className="flex gap-sm">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-sm py-xs rounded-lg border border-outline-variant text-sm disabled:opacity-50 hover:border-[#00170d]">Previous</button>
              <button disabled={page === pageCount} onClick={() => setPage((p) => p + 1)} className="px-sm py-xs rounded-lg border border-outline-variant text-sm disabled:opacity-50 hover:border-[#00170d]">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
