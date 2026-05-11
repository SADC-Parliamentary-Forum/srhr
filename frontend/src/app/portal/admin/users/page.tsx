'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

const ALL_ROLES = [
  { value: 'All',                label: 'All' },
  { value: 'super_admin',        label: 'Super Admin' },
  { value: 'secretariat',        label: 'Secretariat' },
  { value: 'programme_manager',  label: 'Programme Manager' },
  { value: 'me_officer',         label: 'M&E Officer' },
  { value: 'finance_officer',    label: 'Finance Officer' },
  { value: 'country_reviewer',   label: 'Country Reviewer' },
  { value: 'srhr_researcher',    label: 'SRHR Researcher' },
  { value: 'communications_user',label: 'Communications' },
  { value: 'partner_viewer',     label: 'Partner Viewer' },
]

const ROLE_BADGE: Record<string, string> = {
  super_admin:         'bg-[#00170d] text-white',
  secretariat:         'bg-[#fed65b] text-[#745c00]',
  programme_manager:   'bg-[#c6ebd7] text-[#002115]',
  me_officer:          'bg-[#e8def8] text-[#21005d]',
  finance_officer:     'bg-[#ffdcc5] text-[#572000]',
  country_reviewer:    'bg-[#d3e4cd] text-[#0a3818]',
  srhr_researcher:     'bg-[#dde3fd] text-[#001356]',
  communications_user: 'bg-[#ffd7f5] text-[#390048]',
  partner_viewer:      'bg-[#e4e2e2] text-[#414844]',
}

const ROLE_LABEL: Record<string, string> = {
  super_admin:         'Super Admin',
  secretariat:         'Secretariat',
  programme_manager:   'Programme Manager',
  me_officer:          'M&E Officer',
  finance_officer:     'Finance Officer',
  country_reviewer:    'Country Reviewer',
  srhr_researcher:     'SRHR Researcher',
  communications_user: 'Communications',
  partner_viewer:      'Partner Viewer',
  unassigned:          'Unassigned',
}

function normalizeStatus(raw: string): 'Active' | 'Inactive' | 'Pending' {
  if (raw === 'active') return 'Active'
  if (raw === 'inactive') return 'Inactive'
  return 'Pending'
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface UserRow {
  id: number
  name: string
  email: string
  role: string
  country: string
  status: 'Active' | 'Inactive' | 'Pending'
  lastLogin: string
}

interface AccessRequest {
  id: number
  name: string
  email: string
  organization: string
  country: string
  role_requested: string
  reason: string
  created_at: string
}

interface EditState {
  userId: number
  name: string
  role: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadUsers() {
    const token = getToken()
    if (!token) return
    const data = await api.get<{ users: UserRow[]; access_requests: AccessRequest[] }>('/admin/users', token)
    setUsers(data.users.map((u) => ({ ...u, status: normalizeStatus(u.status as string) })))
    setAccessRequests(data.access_requests)
  }

  useEffect(() => {
    loadUsers().catch(() => {}).finally(() => setLoading(false))
  }, [])

  function showMessage(text: string, ok = true) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 4000)
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const activeCount = users.filter((u) => u.status === 'Active').length
  const inactiveCount = users.filter((u) => u.status === 'Inactive').length
  const pendingCount = accessRequests.length

  async function approveRequest(id: number, role: string) {
    const token = getToken()
    if (!token) return
    try {
      await api.post(`/admin/access-requests/${id}/approve`, { role }, token)
      showMessage('Access request approved.')
      await loadUsers()
    } catch {
      showMessage('Failed to approve request.', false)
    }
  }

  async function toggleStatus(userId: number, current: 'Active' | 'Inactive' | 'Pending') {
    const token = getToken()
    if (!token) return
    setTogglingId(userId)
    try {
      await api.patch(`/admin/users/${userId}/status`, {}, token)
      const next = current === 'Active' ? 'Inactive' : 'Active'
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: next } : u))
      showMessage(`User ${next === 'Active' ? 'activated' : 'deactivated'}.`)
    } catch {
      showMessage('Failed to update status.', false)
    } finally {
      setTogglingId(null)
    }
  }

  async function saveEdit() {
    if (!editState) return
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      await api.put(`/admin/users/${editState.userId}`, { name: editState.name, role: editState.role }, token)
      setUsers((prev) => prev.map((u) =>
        u.id === editState.userId ? { ...u, name: editState.name, role: editState.role } : u
      ))
      showMessage('User updated.')
      setEditState(null)
    } catch {
      showMessage('Failed to save changes.', false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-xl">
      <span className="material-symbols-outlined text-[#00170d] text-5xl animate-spin">progress_activity</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
        <div>
          <h2 className="text-3xl font-bold text-[#00170d]">User Management</h2>
          <p className="text-[#414844] mt-xs text-sm">Manage portal users, roles, and access permissions.</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg px-md py-sm text-sm font-medium ${message.ok ? 'bg-[#c6ebd7] text-[#002115]' : 'bg-[#ffdad6] text-[#93000a]'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-md">
        {[
          { label: 'Active Users',      value: activeCount,  icon: 'person_check', color: 'text-[#00170d]' },
          { label: 'Pending Requests',  value: pendingCount, icon: 'pending',       color: 'text-[#745c00]' },
          { label: 'Inactive Users',    value: inactiveCount,icon: 'person_off',    color: 'text-[#414844]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#c1c8c2] p-md flex items-center gap-md shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-[22px] ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#00170d]">{s.value}</div>
              <div className="text-xs text-[#414844]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Access requests */}
      {accessRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm p-md">
          <h3 className="text-base font-bold text-[#00170d] mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[20px] text-[#745c00]">pending</span>
            Pending Access Requests ({accessRequests.length})
          </h3>
          <div className="flex flex-col gap-sm">
            {accessRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-[#c1c8c2] bg-[#f5f3f3] p-md flex flex-col sm:flex-row sm:items-center gap-sm">
                <div className="flex items-center gap-sm flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#fed65b] flex items-center justify-center text-[#745c00] text-xs font-bold shrink-0">
                    {initials(req.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1b1c1c] truncate">{req.name}</p>
                    <p className="text-xs text-[#414844] truncate">{req.email} · {req.organization} · {req.country}</p>
                    <p className="text-xs text-[#414844]">Requested: <span className="font-semibold">{req.role_requested}</span> · {req.created_at}</p>
                  </div>
                </div>
                <button
                  onClick={() => approveRequest(req.id, req.role_requested)}
                  className="rounded-full bg-[#fed65b] text-[#745c00] px-md py-xs text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-sm">
        <div className="flex flex-col sm:flex-row gap-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[#414844] text-[18px]">search</span>
            <input
              className="pl-lg pr-md py-sm rounded-full bg-white border border-[#c1c8c2] text-sm outline-none focus:border-[#00170d] w-64 placeholder:text-[#414844]"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-xs">
            {(['All', 'Active', 'Inactive', 'Pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-sm py-xs rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-[#00170d] text-white' : 'bg-white border border-[#c1c8c2] text-[#414844] hover:border-[#00170d]'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-xs flex-wrap">
          {ALL_ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRoleFilter(r.value)}
              className={`px-sm py-xs rounded-full text-xs font-semibold transition-colors ${roleFilter === r.value ? 'bg-[#00170d] text-white' : 'bg-white border border-[#c1c8c2] text-[#414844] hover:border-[#00170d]'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm overflow-hidden">
        <div className="px-md py-sm border-b border-[#c1c8c2] flex items-center justify-between bg-[#f5f3f3]">
          <span className="text-sm font-semibold text-[#00170d]">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c1c8c2]">
                {['User', 'Role', 'Country', 'Status', 'Last Login', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-[#414844] px-md py-sm uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-lg text-center text-sm text-[#414844]">No users match your filters.</td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-[#c1c8c2]/40 hover:bg-[#f5f3f3] transition-colors">
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-[#00170d] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c]">{user.name}</p>
                        <p className="text-xs text-[#414844]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full whitespace-nowrap ${ROLE_BADGE[user.role] ?? 'bg-[#e4e2e2] text-[#414844]'}`}>
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-md py-sm text-sm text-[#414844] whitespace-nowrap">{user.country}</td>
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${
                      user.status === 'Active'   ? 'bg-[#c6ebd7] text-[#002115]' :
                      user.status === 'Inactive' ? 'bg-[#e4e2e2] text-[#414844]' :
                                                   'bg-[#ffe088] text-[#574500]'
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-md py-sm text-sm text-[#414844] whitespace-nowrap">{user.lastLogin}</td>
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-xs">
                      <button
                        onClick={() => setEditState({ userId: user.id, name: user.name, role: user.role })}
                        title="Edit user"
                        className="p-xs rounded-full hover:bg-[#c6ebd7] text-[#414844] hover:text-[#00170d] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id, user.status)}
                        disabled={togglingId === user.id}
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        className={`p-xs rounded-full transition-colors disabled:opacity-50 ${
                          user.status === 'Active'
                            ? 'hover:bg-[#ffdad6] text-[#414844] hover:text-[#93000a]'
                            : 'hover:bg-[#c6ebd7] text-[#414844] hover:text-[#002115]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {togglingId === user.id ? 'hourglass_empty' : user.status === 'Active' ? 'person_off' : 'person_check'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-[#c1c8c2] w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-lg py-md border-b border-[#c1c8c2]">
              <h3 className="text-base font-bold text-[#00170d]">Edit User</h3>
              <button onClick={() => setEditState(null)} className="text-[#414844] hover:text-[#00170d] transition-colors">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="px-lg py-md flex flex-col gap-md">
              <div>
                <label className="text-xs font-bold text-[#414844] mb-xs block uppercase tracking-wide">Display Name</label>
                <input
                  className="w-full border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]"
                  value={editState.name}
                  onChange={(e) => setEditState((s) => s ? { ...s, name: e.target.value } : s)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#414844] mb-xs block uppercase tracking-wide">Role</label>
                <select
                  className="w-full border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white"
                  value={editState.role}
                  onChange={(e) => setEditState((s) => s ? { ...s, role: e.target.value } : s)}
                >
                  {ALL_ROLES.filter((r) => r.value !== 'All').map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {editState.role && (
                  <span className={`mt-sm inline-flex text-xs font-semibold px-sm py-xs rounded-full ${ROLE_BADGE[editState.role] ?? 'bg-[#e4e2e2] text-[#414844]'}`}>
                    {ROLE_LABEL[editState.role]}
                  </span>
                )}
              </div>
            </div>
            <div className="px-lg py-md border-t border-[#c1c8c2] flex justify-end gap-sm">
              <button
                onClick={() => setEditState(null)}
                className="px-md py-sm rounded-full border border-[#c1c8c2] text-sm font-semibold text-[#414844] hover:border-[#00170d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-md py-sm rounded-full bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
