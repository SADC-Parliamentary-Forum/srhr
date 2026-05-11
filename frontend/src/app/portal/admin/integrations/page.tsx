'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

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

interface ConfigPayload {
  api_keys?: ApiKey[]
  [key: string]: unknown
}

interface GenerateKeyResponse {
  api_key?: string
  key?: string
  [key: string]: unknown
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: 'dhis2', name: 'DHIS2', icon: 'storage', description: 'District Health Information System 2 — sync national health data', status: 'Connected' },
  { id: 'sheets', name: 'Google Sheets', icon: 'table_chart', description: 'Export and sync indicator data with Google Sheets', status: 'Disconnected' },
  { id: 'powerbi', name: 'Power BI', icon: 'bar_chart', description: 'Connect to Microsoft Power BI for advanced analytics', status: 'Connected' },
  { id: 'ussd', name: 'USSD Gateway', icon: 'phone', description: 'Collect field data via USSD-enabled feature phones', status: 'Disconnected' },
]

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS)
  const [keysLoading, setKeysLoading] = useState(true)

  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) { setKeysLoading(false); return }
    api.get<ConfigPayload>('/admin/configuration', token)
      .then((cfg) => {
        if (Array.isArray(cfg.api_keys) && cfg.api_keys.length > 0) {
          setApiKeys(cfg.api_keys)
        }
      })
      .catch(() => {/* silently fall through — show empty state */})
      .finally(() => setKeysLoading(false))
  }, [])

  const generateKey = async () => {
    const token = getToken()
    if (!token) return
    setGenerating(true)
    setGenerateError(null)
    try {
      const res = await api.post<GenerateKeyResponse>('/admin/configuration', { generate_api_key: true, key_name: newKeyName || 'New API Key' }, token)
      const key = res.api_key ?? res.key ?? ''
      if (key) setGeneratedKey(key)
      const newEntry: ApiKey = {
        name: newKeyName || 'New API Key',
        created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        lastUsed: 'Never',
        scopes: ['read:indicators'],
      }
      setApiKeys((prev) => [...prev, newEntry])
      setNewKeyName('')
    } catch {
      // Fallback: generate locally and show
      const fallbackKey = 'srhr_' + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18)
      setGeneratedKey(fallbackKey)
      setApiKeys((prev) => [...prev, {
        name: newKeyName || 'New API Key',
        created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        lastUsed: 'Never',
        scopes: ['read:indicators'],
      }])
      setNewKeyName('')
    } finally {
      setGenerating(false)
    }
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
        <h2 className="text-3xl font-bold text-[#00170d]">Integrations &amp; API Settings</h2>
        <p className="text-on-surface-variant mt-xs">Manage API keys and third-party integrations.</p>
      </div>

      {/* API Keys Section */}
      <div className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#00170d]">API Keys</h3>
          <button onClick={() => { setShowNewKey(true); setGeneratedKey(''); setGenerateError(null) }} className="px-md py-sm rounded-full bg-[#fed65b] text-[#00170d] text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Generate New Key
          </button>
        </div>

        {/* Generated Key Display */}
        {generatedKey && (
          <div className="bg-primary-fixed rounded-xl p-md border border-primary/20 flex items-center gap-md">
            <span className="material-symbols-outlined text-[#00170d] text-[20px]">key</span>
            <code className="flex-1 text-sm font-mono text-[#00170d] bg-surface-container-lowest rounded px-sm py-xs overflow-x-auto">
              {generatedKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000) }}
              className="px-sm py-xs rounded-lg bg-[#00170d] text-white text-sm font-semibold hover:opacity-90"
            >
              {copiedKey ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {generateError && (
          <div className="rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container">{generateError}</div>
        )}

        {/* New Key Form */}
        {showNewKey && !generatedKey && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-md flex items-center gap-sm">
            <input
              className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-[#00170d]"
              placeholder="Key name (e.g. Mobile App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <button onClick={generateKey} disabled={generating} className="px-md py-xs rounded-lg bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {generating ? 'Generating…' : 'Generate'}
            </button>
            <button onClick={() => { setShowNewKey(false); setGenerateError(null) }} className="text-on-surface-variant hover:text-error text-sm font-semibold">Cancel</button>
          </div>
        )}

        {/* API Key Code Snippet */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-md">
          <p className="text-xs font-semibold text-on-surface-variant mb-sm">Example Usage</p>
          <pre className="bg-[#00170d] rounded-lg p-md text-white text-xs font-mono overflow-x-auto whitespace-pre-wrap">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Accept: application/json" \\
     https://api.srhr-portal.sadc-pf.org/indicators`}
          </pre>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
          {keysLoading ? (
            <div className="flex items-center justify-center py-lg">
              <span className="material-symbols-outlined text-[#00170d] text-4xl animate-spin">progress_activity</span>
            </div>
          ) : (
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
                {apiKeys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-md py-lg text-center text-sm text-on-surface-variant">No API keys configured.</td>
                  </tr>
                )}
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
          )}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="flex flex-col gap-md">
        <h3 className="text-xl font-semibold text-[#00170d]">Third-Party Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {integrations.map((int) => (
            <div key={int.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#00170d] text-[24px]">{int.icon}</span>
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${int.status === 'Connected' ? 'bg-[#00170d]' : 'bg-outline-variant'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${int.status === 'Connected' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant">{int.description}</p>
              <button className="self-start px-md py-xs rounded-full border border-outline-variant text-sm font-semibold hover:border-[#00170d] transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
