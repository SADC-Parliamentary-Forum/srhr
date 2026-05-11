'use client'

import { useState } from 'react'

const sharedUsers = [
  { name: 'Jane Mwangi', email: 'jane@sadc-pf.org', role: 'Editor', initials: 'JM', color: 'bg-secondary' },
  { name: 'Amos Khumalo', email: 'amos@sadc-pf.org', role: 'Viewer', initials: 'AK', color: 'bg-primary' },
  { name: 'Sarah Moyo', email: 'sarah@sadc-pf.org', role: 'Commenter', initials: 'SM', color: 'bg-error' },
  { name: 'Bongani Nkosi', email: 'bongani@sadc-pf.org', role: 'Viewer', initials: 'BN', color: 'bg-primary-container' },
  { name: 'Fatima Diallo', email: 'fatima@sadc-pf.org', role: 'Editor', initials: 'FD', color: 'bg-tertiary-container' },
]

type Privacy = 'Private' | 'Organization-wide' | 'Public'

export default function ReportSharingPage({ params }: { params: { id: string } }) {
  const [accessLevel, setAccessLevel] = useState('View')
  const [expiry, setExpiry] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('Viewer')
  const [privacy, setPrivacy] = useState<Privacy>('Private')
  const [copied, setCopied] = useState(false)
  const [users, setUsers] = useState(sharedUsers)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const removeUser = (email: string) => setUsers((prev) => prev.filter((u) => u.email !== email))

  return (
    <div className="flex flex-col gap-lg max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Share Report</h2>
          <p className="text-on-surface-variant mt-xs">Report ID: {params.id} · Malawi Q4 2023</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
            Cancel
          </button>
          <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Share Link */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md">
          <h3 className="text-base font-semibold text-primary">Share Link</h3>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Link URL</label>
            <div className="flex gap-sm">
              <input
                className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none"
                value={`https://portal.sadc-pf.org/r/${params.id}`}
                readOnly
              />
              <button onClick={handleCopy} className="px-sm py-xs rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 shrink-0">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Access Level</label>
            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
              <option>View</option>
              <option>Comment</option>
              <option>Edit</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Link Expires</label>
            <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary" />
          </div>
        </div>

        {/* Share with People */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md">
          <h3 className="text-base font-semibold text-primary">Share with People</h3>
          <div className="flex gap-sm">
            <input
              className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
              placeholder="Enter email address..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="bg-surface-container border border-outline-variant rounded-lg px-xs py-xs text-sm outline-none">
              <option>Viewer</option>
              <option>Commenter</option>
              <option>Editor</option>
            </select>
          </div>
          <div className="flex flex-col gap-sm overflow-y-auto">
            {users.map((user) => (
              <div key={user.email} className="flex items-center gap-sm">
                <div className={`w-8 h-8 rounded-full ${user.color} text-on-primary flex items-center justify-center text-xs font-bold shrink-0`}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <span className="text-xs bg-surface-container text-on-surface-variant px-xs py-[2px] rounded shrink-0">{user.role}</span>
                <button onClick={() => removeUser(user.email)} className="text-on-surface-variant hover:text-error text-xs font-semibold shrink-0">Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-md">
          <h3 className="text-base font-semibold text-primary">Privacy Settings</h3>
          <div className="flex flex-col gap-sm">
            {(['Private', 'Organization-wide', 'Public'] as Privacy[]).map((option) => (
              <label key={option} className={`flex items-start gap-sm p-sm rounded-lg cursor-pointer border transition-colors ${privacy === option ? 'border-primary bg-primary-fixed/10' : 'border-outline-variant hover:border-primary/50'}`}>
                <input type="radio" name="privacy" value={option} checked={privacy === option} onChange={() => setPrivacy(option)} className="mt-xs" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{option}</p>
                  <p className="text-xs text-on-surface-variant">
                    {option === 'Private' && 'Only you and invited users can access this report.'}
                    {option === 'Organization-wide' && 'Anyone in your organization can view this report.'}
                    {option === 'Public' && 'This report is visible on the public SRHR portal.'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
