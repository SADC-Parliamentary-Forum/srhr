'use client'

import { useState } from 'react'

type Severity = 'Info' | 'Warning' | 'Critical'
type EventType = 'All' | 'Login' | 'Upload' | 'Export' | 'Config'

const EVENT_TYPES: EventType[] = ['All', 'Login', 'Upload', 'Export', 'Config']

interface AuditLog {
  timestamp: string
  user: { name: string; initials: string; color: string }
  eventType: string
  description: string
  ip: string
  severity: Severity
}

const logs: AuditLog[] = [
  { timestamp: '2026-05-10 10:42:18', user: { name: 'Ronald W.', initials: 'RW', color: 'bg-primary' }, eventType: 'Login', description: 'Successful login from web browser', ip: '41.56.78.12', severity: 'Info' },
  { timestamp: '2026-05-10 09:31:05', user: { name: 'Jane M.', initials: 'JM', color: 'bg-secondary' }, eventType: 'Upload', description: 'Uploaded indicator data for Kenya Q1 2026', ip: '196.12.45.88', severity: 'Info' },
  { timestamp: '2026-05-10 09:15:33', user: { name: 'System', initials: 'SY', color: 'bg-surface-container' }, eventType: 'Config', description: 'Maintenance window scheduled for 22:00 UTC', ip: 'localhost', severity: 'Warning' },
  { timestamp: '2026-05-10 08:58:20', user: { name: 'Unknown', initials: '??', color: 'bg-error' }, eventType: 'Login', description: 'Failed login attempt — invalid credentials (3rd attempt)', ip: '102.45.234.7', severity: 'Critical' },
  { timestamp: '2026-05-10 08:45:12', user: { name: 'Amos K.', initials: 'AK', color: 'bg-primary-container' }, eventType: 'Export', description: 'Exported Zambia Q4 2025 report as PDF', ip: '10.0.1.45', severity: 'Info' },
  { timestamp: '2026-05-10 08:22:05', user: { name: 'Sarah M.', initials: 'SM', color: 'bg-error' }, eventType: 'Login', description: 'Account locked after 5 failed login attempts', ip: '154.78.23.99', severity: 'Critical' },
  { timestamp: '2026-05-09 16:34:41', user: { name: 'Ronald W.', initials: 'RW', color: 'bg-primary' }, eventType: 'Config', description: 'User role changed: Sarah Moyo → Reviewer', ip: '41.56.78.12', severity: 'Warning' },
  { timestamp: '2026-05-09 15:10:28', user: { name: 'Jane M.', initials: 'JM', color: 'bg-secondary' }, eventType: 'Upload', description: 'Evidence document uploaded: Kenya Youth Clinic Photos', ip: '196.12.45.88', severity: 'Info' },
  { timestamp: '2026-05-09 14:02:17', user: { name: 'Bongani N.', initials: 'BN', color: 'bg-primary' }, eventType: 'Export', description: 'Exported SADC regional summary as Excel', ip: '102.56.34.12', severity: 'Info' },
  { timestamp: '2026-05-09 12:45:00', user: { name: 'System', initials: 'SY', color: 'bg-surface-container' }, eventType: 'Config', description: 'Automated report generated: Monthly Summary May 2026', ip: 'localhost', severity: 'Info' },
  { timestamp: '2026-05-09 11:30:09', user: { name: 'Grace M.', initials: 'GM', color: 'bg-primary' }, eventType: 'Login', description: 'Successful login from mobile browser', ip: '41.78.123.5', severity: 'Info' },
  { timestamp: '2026-05-08 17:55:34', user: { name: 'Fatima D.', initials: 'FD', color: 'bg-tertiary-container' }, eventType: 'Upload', description: 'Uploaded Mozambique Q1 2026 indicator data', ip: '196.45.78.33', severity: 'Info' },
  { timestamp: '2026-05-08 16:20:11', user: { name: 'Unknown', initials: '??', color: 'bg-error' }, eventType: 'Login', description: 'Suspicious login attempt from unrecognized location', ip: '45.134.22.88', severity: 'Critical' },
  { timestamp: '2026-05-08 14:08:50', user: { name: 'Ronald W.', initials: 'RW', color: 'bg-primary' }, eventType: 'Config', description: 'New user invited: Emmanuel Banda (emmanuel@sadc-pf.org)', ip: '41.56.78.12', severity: 'Info' },
  { timestamp: '2026-05-08 13:11:05', user: { name: 'Peter O.', initials: 'PO', color: 'bg-primary-container' }, eventType: 'Export', description: 'Downloaded Uganda analysis comparison report', ip: '196.34.67.12', severity: 'Info' },
  { timestamp: '2026-05-08 11:47:32', user: { name: 'Jane M.', initials: 'JM', color: 'bg-secondary' }, eventType: 'Upload', description: 'Evidence story uploaded: Youth Health Outreach', ip: '196.12.45.88', severity: 'Info' },
  { timestamp: '2026-05-07 16:30:19', user: { name: 'Amos K.', initials: 'AK', color: 'bg-primary-container' }, eventType: 'Login', description: 'Successful login from desktop application', ip: '10.0.1.45', severity: 'Info' },
  { timestamp: '2026-05-07 14:22:08', user: { name: 'System', initials: 'SY', color: 'bg-surface-container' }, eventType: 'Config', description: 'Data backup completed successfully', ip: 'localhost', severity: 'Info' },
  { timestamp: '2026-05-07 11:15:41', user: { name: 'Ronald W.', initials: 'RW', color: 'bg-primary' }, eventType: 'Config', description: '2FA enforcement enabled for all admin accounts', ip: '41.56.78.12', severity: 'Warning' },
  { timestamp: '2026-05-07 09:05:17', user: { name: 'Mary S.', initials: 'MS', color: 'bg-secondary' }, eventType: 'Upload', description: 'Zimbabwe Q1 2026 indicators uploaded and validated', ip: '154.23.67.44', severity: 'Info' },
]

const severityStyles: Record<Severity, string> = {
  Info: 'bg-surface-container text-on-surface-variant',
  Warning: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  Critical: 'bg-error-container text-on-error-container',
}

const PAGE_SIZE = 10

export default function AuditLogsPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [eventFilter, setEventFilter] = useState<EventType>('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = logs.filter((log) => {
    const matchEvent = eventFilter === 'All' || log.eventType === eventFilter
    const matchUser = !userFilter || log.user.name.toLowerCase().includes(userFilter.toLowerCase())
    const matchSeverity = severityFilter === 'All' || log.severity === severityFilter
    return matchEvent && matchUser && matchSeverity
  })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const criticalCount = logs.filter((l) => l.severity === 'Critical').length
  const warningCount = logs.filter((l) => l.severity === 'Warning').length

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Audit Log</h2>
          <p className="text-on-surface-variant mt-xs">Track all user actions and system events for security compliance.</p>
        </div>
        <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-md flex-wrap">
        <div className="flex items-center gap-xs bg-surface-container text-on-surface-variant px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">event_note</span>
          Total Events Today: {logs.filter((l) => l.timestamp.startsWith('2026-05-10')).length}
        </div>
        <div className="flex items-center gap-xs bg-error-container text-on-error-container px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Critical Alerts: {criticalCount}
        </div>
        <div className="flex items-center gap-xs bg-secondary-fixed text-on-secondary-fixed-variant px-md py-sm rounded-full text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          Failed Logins: {logs.filter((l) => l.description.includes('failed') || l.description.includes('locked')).length}
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
        <input className="bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary w-40" placeholder="Filter by user..." value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setPage(1) }} />
        <div className="flex gap-sm flex-wrap">
          {EVENT_TYPES.map((type) => (
            <button key={type} onClick={() => { setEventFilter(type); setPage(1) }} className={`px-sm py-xs rounded-full text-xs font-semibold transition-colors ${eventFilter === type ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
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
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Description</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">IP Address</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Severity</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((log, i) => (
                <tr key={i} className={`border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors ${log.severity === 'Critical' ? 'bg-error-container/10' : log.severity === 'Warning' ? 'bg-secondary-fixed/10' : ''}`}>
                  <td className="px-md py-sm text-xs text-on-surface-variant font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <div className={`w-6 h-6 rounded-full ${log.user.color} text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0`}>
                        {log.user.initials}
                      </div>
                      <span className="text-sm text-on-surface whitespace-nowrap">{log.user.name}</span>
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-sm py-xs rounded-full">{log.eventType}</span>
                  </td>
                  <td className="px-md py-sm text-sm text-on-surface max-w-[260px]">{log.description}</td>
                  <td className="px-md py-sm text-xs text-on-surface-variant font-mono">{log.ip}</td>
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${severityStyles[log.severity]}`}>{log.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-md py-sm border-t border-outline-variant/20">
            <span className="text-xs text-on-surface-variant">
              Page {page} of {pageCount} · {filtered.length} events
            </span>
            <div className="flex gap-sm">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-sm py-xs rounded-lg border border-outline-variant text-sm disabled:opacity-50 hover:border-primary">Previous</button>
              <button disabled={page === pageCount} onClick={() => setPage((p) => p + 1)} className="px-sm py-xs rounded-lg border border-outline-variant text-sm disabled:opacity-50 hover:border-primary">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
