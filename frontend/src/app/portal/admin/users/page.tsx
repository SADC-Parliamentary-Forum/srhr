'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type Role = 'All' | 'super_admin' | 'me_officer' | 'country_reviewer'
const ROLES: Role[] = ['All', 'super_admin', 'me_officer', 'country_reviewer']

interface UserRow {
  id: number
  name: string
  email: string
  role: string
  country: string
  status: string
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

type ResponsePayload = {
  users: UserRow[]
  access_requests: AccessRequest[]
}

function normalizeStatus(raw: string): string {
  if (raw === 'active') return 'Active'
  if (raw === 'inactive') return 'Inactive'
  return 'Pending'
}

const statusBadge: Record<string, string> = {
  Active: 'bg-primary-fixed text-on-primary-fixed',
  Pending: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  Inactive: 'bg-surface-container text-on-surface-variant',
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role>('All')
  const [message, setMessage] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  async function loadUsers() {
    const token = getToken()
    if (!token) return

    const data = await api.get<ResponsePayload>('/admin/users', token)
    setUsers(data.users.map((user) => ({
      ...user,
      status: normalizeStatus(user.status),
    })))
    setAccessRequests(data.access_requests)
  }

  useEffect(() => {
    loadUsers()
      .catch(() => {
        setUsers([])
        setAccessRequests([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || user.role === roleFilter
    return matchSearch && matchRole
  })

  async function approveRequest(requestId: number, role: string) {
    const token = getToken()
    if (!token) return
    await api.post(`/admin/access-requests/${requestId}/approve`, { role }, token)
    setMessage('Access request approved.')
    await loadUsers()
  }

  async function toggleStatus(userId: number, currentStatus: string) {
    const token = getToken()
    if (!token) return
    const newStatus = currentStatus === 'Active' ? 'inactive' : 'active'
    setTogglingId(userId)
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus }, token)
      setUsers((prev) => prev.map((u) =>
        u.id === userId ? { ...u, status: normalizeStatus(newStatus) } : u
      ))
      setMessage(`User status updated to ${normalizeStatus(newStatus)}.`)
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage('Failed to update user status.')
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#00170d] text-5xl animate-spin">progress_activity</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="text-3xl font-bold text-[#00170d]">User Management</h2>
        <p className="text-on-surface-variant mt-xs">Manage portal users, roles, and access permissions.</p>
      </div>

      {message && <div className="rounded-lg bg-primary-fixed px-md py-sm text-sm text-on-primary-fixed">{message}</div>}

      {accessRequests.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md">
          <h3 className="text-lg font-semibold text-[#00170d] mb-md">Pending Access Requests</h3>
          <div className="flex flex-col gap-sm">
            {accessRequests.map((request) => (
              <div key={request.id} className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-md flex items-center justify-between gap-md">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{request.name} - {request.email}</p>
                  <p className="text-xs text-on-surface-variant">
                    {request.organization} | {request.country} | {request.role_requested} | {request.created_at}
                  </p>
                </div>
                <button onClick={() => approveRequest(request.id, request.role_requested)} className="rounded-full bg-[#fed65b] text-[#00170d] px-md py-sm text-sm font-semibold hover:opacity-90 transition-opacity">
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-[#00170d] w-64" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-sm flex-wrap">
          {ROLES.map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)} className={`px-sm py-xs rounded-full text-sm font-semibold transition-colors ${roleFilter === role ? 'bg-[#00170d] text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Name</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Email</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Role</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Country</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Last Login</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-md py-lg text-center text-sm text-on-surface-variant">No users found.</td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm text-sm font-semibold text-on-surface">{user.name}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{user.email}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{user.role}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{user.country}</td>
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${statusBadge[user.status] ?? statusBadge.Inactive}`}>{user.status}</span>
                  </td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{user.lastLogin}</td>
                  <td className="px-md py-sm">
                    <button
                      onClick={() => toggleStatus(user.id, user.status)}
                      disabled={togglingId === user.id}
                      className={`text-xs font-semibold px-sm py-xs rounded-full transition-colors disabled:opacity-50 ${user.status === 'Active' ? 'bg-error-container text-on-error-container hover:opacity-80' : 'bg-[#fed65b] text-[#00170d] hover:opacity-80'}`}
                    >
                      {togglingId === user.id ? '…' : user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
