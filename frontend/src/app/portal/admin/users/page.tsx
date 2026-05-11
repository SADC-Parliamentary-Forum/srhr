'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

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

function roleLabel(role: string) {
  return ROLE_LABEL[role] ?? role.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ')
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

interface RoleOption {
  name: string
  permissions: string[]
}

interface CountryOption {
  id: number
  name: string
}

interface EditState {
  userId: number
  name: string
  role: string
  email: string
  country: string
  status: 'Active' | 'Inactive' | 'Pending'
}

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : []
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [creatingRole, setCreatingRole] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    country_id: '',
    role: '',
    status: 'active',
  })
  const [newRoleName, setNewRoleName] = useState('')
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([])

  async function loadUsers() {
    const token = getToken()
    if (!token) return
    const usersData = await api.get<{
      users: UserRow[]
      access_requests: AccessRequest[]
      roles: RoleOption[]
      permissions: string[]
      countries: CountryOption[]
    }>('/admin/users', token)
    const loadedUsers = asArray(usersData.users)
    const loadedRequests = asArray(usersData.access_requests)
    const loadedRoles = asArray(usersData.roles)
    const loadedPermissions = asArray(usersData.permissions)
    const loadedCountries = asArray(usersData.countries)

    setUsers(loadedUsers.map((u) => ({ ...u, status: normalizeStatus(u.status as string) })))
    setAccessRequests(loadedRequests)
    setRoles(loadedRoles)
    setPermissions(loadedPermissions)
    setCountries(loadedCountries)
    setNewUser((prev) => ({
      ...prev,
      role: prev.role || loadedRoles[0]?.name || '',
    }))
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
  const normalizedRoles = asArray(roles)
  const normalizedPermissions = asArray(permissions)
  const normalizedCountries = asArray(countries)
  const roleFilterOptions = [{ value: 'All', label: 'All' }, ...normalizedRoles.map((role) => ({ value: role.name, label: roleLabel(role.name) }))]

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

  async function createUser() {
    const token = getToken()
    if (!token) return
    setCreatingUser(true)
    try {
      const payload = {
        ...newUser,
        country_id: newUser.country_id ? Number(newUser.country_id) : null,
      }
      const res = await api.post<{ message: string; user: UserRow }>('/admin/users', payload, token)
      setUsers((prev) => [{ ...res.user, status: normalizeStatus(res.user.status as string) }, ...prev])
      setNewUser({ name: '', email: '', password: '', organization: '', country_id: '', role: normalizedRoles[0]?.name ?? '', status: 'active' })
      showMessage('User created.')
    } catch {
      showMessage('Failed to create user.', false)
    } finally {
      setCreatingUser(false)
    }
  }

  async function createRole() {
    const token = getToken()
    if (!token) return
    setCreatingRole(true)
    try {
      const res = await api.post<{ message: string; role: RoleOption }>('/admin/roles', {
        name: newRoleName,
        permissions: newRolePermissions,
      }, token)
      setRoles((prev) => [...prev, res.role].sort((a, b) => a.name.localeCompare(b.name)))
      setNewRoleName('')
      setNewRolePermissions([])
      showMessage('Role created.')
    } catch {
      showMessage('Failed to create role.', false)
    } finally {
      setCreatingRole(false)
    }
  }

  function togglePermission(permission: string) {
    setNewRolePermissions((prev) =>
      prev.includes(permission) ? prev.filter((item) => item !== permission) : [...prev, permission]
    )
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-md">
        <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm p-md flex flex-col gap-md">
          <div>
            <h3 className="text-base font-bold text-[#00170d]">Create User</h3>
            <p className="text-sm text-[#414844] mt-xs">Add a user directly without waiting for a registration request.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <input className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]" placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]" placeholder="Email address" type="email" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} />
            <input className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]" placeholder="Temporary password" type="password" value={newUser.password} onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} />
            <input className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]" placeholder="Organization" value={newUser.organization} onChange={(e) => setNewUser((prev) => ({ ...prev, organization: e.target.value }))} />
            <select className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white" value={newUser.country_id} onChange={(e) => setNewUser((prev) => ({ ...prev, country_id: e.target.value }))}>
              <option value="">Regional / Unassigned</option>
              {normalizedCountries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>
            <select
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white disabled:bg-[#f5f3f3]"
              value={newUser.role}
              onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
              disabled={normalizedRoles.length === 0}
            >
              {normalizedRoles.length === 0 ? (
                <option value="">No roles available</option>
              ) : (
                normalizedRoles.map((role) => <option key={role.name} value={role.name}>{roleLabel(role.name)}</option>)
              )}
            </select>
          </div>
          <div className="flex items-center justify-between gap-sm">
            <select className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white" value={newUser.status} onChange={(e) => setNewUser((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={createUser} disabled={creatingUser} className="px-md py-sm rounded-full bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
              {creatingUser ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm p-md flex flex-col gap-md">
          <div>
            <h3 className="text-base font-bold text-[#00170d]">Create Role</h3>
            <p className="text-sm text-[#414844] mt-xs">Define a new role and assign permissions for it immediately.</p>
          </div>
          <input className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]" placeholder="Role name, e.g. data_editor" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
          <div className="flex flex-wrap gap-xs">
            {normalizedPermissions.map((permission) => (
              <button
                key={permission}
                type="button"
                onClick={() => togglePermission(permission)}
                className={`px-sm py-xs rounded-full text-xs font-semibold transition-colors ${newRolePermissions.includes(permission) ? 'bg-[#00170d] text-white' : 'bg-[#f5f3f3] border border-[#c1c8c2] text-[#414844]'}`}
              >
                {permission}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-sm">
            <p className="text-xs text-[#414844]">{newRolePermissions.length} permission{newRolePermissions.length !== 1 ? 's' : ''} selected</p>
            <button onClick={createRole} disabled={creatingRole} className="px-md py-sm rounded-full bg-[#fed65b] text-[#745c00] text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
              {creatingRole ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </div>
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
          {roleFilterOptions.map((r) => (
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
                      {roleLabel(user.role)}
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
                        onClick={() => setEditState({
                          userId: user.id,
                          name: user.name,
                          role: user.role,
                          email: user.email,
                          country: user.country,
                          status: user.status,
                        })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-md py-lg">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#c1c8c2] bg-[#f9f8f5] shadow-2xl">
            <div className="flex items-start justify-between gap-md border-b border-[#c1c8c2] bg-white px-lg py-md">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#745c00]">Edit User</p>
                <h3 className="mt-1 truncate text-xl font-bold text-[#00170d]">{editState.name}</h3>
                <p className="mt-xs truncate text-sm text-[#414844]">{editState.email} · {editState.country}</p>
              </div>
              <button onClick={() => setEditState(null)} className="text-[#414844] hover:text-[#00170d] transition-colors">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="grid gap-lg px-lg py-lg md:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-md">
                <div>
                  <label className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Display Name</label>
                  <input
                    className="w-full rounded-xl border border-[#c1c8c2] bg-white px-md py-sm text-sm outline-none transition-colors focus:border-[#00170d] focus:ring-2 focus:ring-[#c6ebd7]"
                    value={editState.name}
                    onChange={(e) => setEditState((s) => s ? { ...s, name: e.target.value } : s)}
                  />
                  <p className="mt-xs text-xs text-[#414844]">This is the name shown in tables, assignments, and notifications.</p>
                </div>
                <div>
                  <label className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Role</label>
                  <select
                    className="w-full rounded-xl border border-[#c1c8c2] bg-white px-md py-sm text-sm outline-none transition-colors focus:border-[#00170d] focus:ring-2 focus:ring-[#c6ebd7]"
                    value={editState.role}
                    onChange={(e) => setEditState((s) => s ? { ...s, role: e.target.value } : s)}
                  >
                    {normalizedRoles.length === 0 ? (
                      <option value="">No roles available</option>
                    ) : (
                      normalizedRoles.map((role) => (
                        <option key={role.name} value={role.name}>{roleLabel(role.name)}</option>
                      ))
                    )}
                  </select>
                  <p className="mt-xs text-xs text-[#414844]">Changing the role updates what this user can access in the portal.</p>
                </div>
                <div className="rounded-2xl border border-[#c1c8c2] bg-white px-md py-md">
                  <div className="flex flex-wrap gap-sm">
                    <div className="rounded-xl bg-[#f5f3f3] px-sm py-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#414844]">Email</div>
                      <div className="mt-1 break-all text-sm font-semibold text-[#00170d]">{editState.email}</div>
                    </div>
                    <div className="rounded-xl bg-[#f5f3f3] px-sm py-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#414844]">Country</div>
                      <div className="mt-1 text-sm font-semibold text-[#00170d]">{editState.country}</div>
                    </div>
                    <div className="rounded-xl bg-[#f5f3f3] px-sm py-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#414844]">Status</div>
                      <div className="mt-1 text-sm font-semibold text-[#00170d]">{editState.status}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-md rounded-2xl border border-[#c1c8c2] bg-white p-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#414844]">Current Access</p>
                  {editState.role ? (
                    <span className={`mt-sm inline-flex rounded-full px-sm py-xs text-xs font-semibold ${ROLE_BADGE[editState.role] ?? 'bg-[#e4e2e2] text-[#414844]'}`}>
                      {roleLabel(editState.role)}
                    </span>
                  ) : (
                    <span className="mt-sm inline-flex rounded-full bg-[#e4e2e2] px-sm py-xs text-xs font-semibold text-[#414844]">
                      No role selected
                    </span>
                  )}
                </div>
                <div className="rounded-2xl bg-[#f5f3f3] p-md">
                  <p className="text-sm font-semibold text-[#00170d]">What this edit changes</p>
                  <p className="mt-xs text-sm text-[#414844]">
                    Update the display name and role only. Country access and account status remain unchanged from this screen.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#c1c8c2] bg-[#f9f8f5] p-md">
                  <p className="text-sm font-semibold text-[#00170d]">Preview</p>
                  <div className="mt-sm flex items-center gap-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00170d] text-xs font-bold text-white">
                      {initials(editState.name || editState.email)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1b1c1c]">{editState.name || 'Unnamed user'}</p>
                      <p className="truncate text-xs text-[#414844]">{editState.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-sm border-t border-[#c1c8c2] bg-white px-lg py-md sm:flex-row sm:justify-end">
              <button
                onClick={() => setEditState(null)}
                className="rounded-full border border-[#c1c8c2] px-md py-sm text-sm font-semibold text-[#414844] transition-colors hover:border-[#00170d] hover:text-[#00170d]"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="rounded-full bg-[#00170d] px-md py-sm text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
