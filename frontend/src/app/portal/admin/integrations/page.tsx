'use client'

import { useState } from 'react'

interface ApiKey {
  name: string
  created: string
  lastUsed: string
  scopes: string[]
}

interface Integration {
  id: string
  name: string
  icon: string
  description: string
  status: 'Connected' | 'Disconnected'
}

const initialApiKeys: ApiKey[] = [
  { name: 'Production API Key', created: 'Jan 15, 2026', lastUsed: 'Today', scopes: ['read:indicators', 'write:indicators', 'read:reports'] },
  { name: 'Analytics Dashboard', created: 'Mar 3, 2026', lastUsed: 'Yesterday', scopes: ['read:indicators', 'read:reports'] },
  { name: 'Mobile App Integration', created: 'Apr 20, 2026', lastUsed: 'May 7, 2026', scopes: ['read:indicators', 'write:evidence'] },
]

const initialIntegrations: Integration[] = [
  { id: 'dhis2', name: 'DHIS2', icon: 'storage', description: 'District Health Information System 2 — sync national health data', status: 'Connected' },
  { id: 'sheets', name: 'Google Sheets', icon: 'table_chart', description: 'Export and sync indicator data with Google Sheets', status: 'Disconnected' },
  { id: 'powerbi', name: 'Power BI', icon: 'bar_chart', description: 'Connect to Microsoft Power BI for advanced analytics', status: 'Connected' },
  { id: 'ussd', name: 'USSD Gateway', icon: 'phone', description: 'Collect field data via USSD-enabled feature phones', status: 'Disconnected' },
]

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)

  const generateKey = () => {
    const key = 'srhr_' + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18)
    setGeneratedKey(key)
    setApiKeys((prev) => [...prev, { name: newKeyName || 'New API Key', created: 'Today', lastUsed: 'Never', scopes: ['read:indicators'] }])
    setNewKeyName('')
  }

  const revokeKey = (idx: number) => setApiKeys((prev) => prev.filter((_, i) => i !== idx))

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) => prev.map((int) =>
      int.id === id ? { ...int, status: int.status === 'Connected' ? 'Disconnected' : 'Connected' } : int
    ))
  }

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h2 className="text-3xl font-bold text-primary">Integrations & API Settings</h2>
        <p className="text-on-surface-variant mt-xs">Manage API keys and third-party integrations.</p>
      </div>

      {/* API Keys Section */}
      <div className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-primary">API Keys</h3>
          <button onClick={() => setShowNewKey(true)} className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Generate New Key
          </button>
        </div>

        {/* Generated Key Display */}
        {generatedKey && (
          <div className="bg-primary-fixed rounded-xl p-md border border-primary/20 flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-[20px]">key</span>
            <code className="flex-1 text-sm font-mono text-primary bg-surface-container-lowest rounded px-sm py-xs overflow-x-auto">
              {generatedKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000) }}
              className="px-sm py-xs rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90"
            >
              {copiedKey ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {/* New Key Form */}
        {showNewKey && !generatedKey && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-md flex items-center gap-sm">
            <input
              className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
              placeholder="Key name (e.g. Mobile App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <button onClick={generateKey} className="px-md py-xs rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90">Generate</button>
            <button onClick={() => setShowNewKey(false)} className="text-on-surface-variant hover:text-error text-sm font-semibold">Cancel</button>
          </div>
        )}

        {/* API Key Code Snippet */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-md">
          <p className="text-xs font-semibold text-on-surface-variant mb-sm">Example Usage</p>
          <pre className="bg-primary rounded-lg p-md text-on-primary text-xs font-mono overflow-x-auto whitespace-pre-wrap">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Accept: application/json" \\
     https://api.srhr-portal.sadc-pf.org/indicators`}
          </pre>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Name</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Created</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Last Used</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Scopes</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key, i) => (
                <tr key={i} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm text-sm font-semibold text-on-surface">{key.name}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{key.created}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{key.lastUsed}</td>
                  <td className="px-md py-sm">
                    <div className="flex flex-wrap gap-xs">
                      {key.scopes.map((scope) => (
                        <span key={scope} className="text-xs bg-surface-container text-on-surface-variant px-xs py-[2px] rounded font-mono">{scope}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <button onClick={() => revokeKey(i)} className="text-error text-sm font-semibold hover:underline">Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="flex flex-col gap-md">
        <h3 className="text-xl font-semibold text-primary">Third-Party Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {integrations.map((int) => (
            <div key={int.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">{int.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-on-surface">{int.name}</h4>
                    <span className={`text-xs font-semibold px-xs py-[2px] rounded-full ${int.status === 'Connected' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                      {int.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleIntegration(int.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${int.status === 'Connected' ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${int.status === 'Connected' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant">{int.description}</p>
              <button className="self-start px-md py-xs rounded-full border border-outline-variant text-sm font-semibold hover:border-primary transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
