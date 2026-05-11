'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type Section = 'General' | 'Security' | 'Notifications' | 'Integrations' | 'Data Retention'
const SECTIONS: Section[] = ['General', 'Security', 'Notifications', 'Integrations', 'Data Retention']

interface ConfigPayload {
  org_name?: string
  language?: string
  date_format?: string
  timezone?: string
  primary_contact?: string
  maintenance_mode?: boolean
  open_registration?: boolean
  require_2fa?: boolean
  [key: string]: unknown
}

export default function SystemConfigurationPage() {
  const [activeSection, setActiveSection] = useState<Section>('General')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [orgName, setOrgName] = useState('SADC Parliamentary Forum')
  const [language, setLanguage] = useState('English')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [timezone, setTimezone] = useState('Africa/Johannesburg')
  const [primaryContact, setPrimaryContact] = useState('secretariat@sadc-pf.org')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [openRegistration, setOpenRegistration] = useState(false)
  const [require2FA, setRequire2FA] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    api.get<ConfigPayload>('/admin/configuration', token)
      .then((cfg) => {
        if (cfg.org_name) setOrgName(cfg.org_name)
        if (cfg.language) setLanguage(cfg.language)
        if (cfg.date_format) setDateFormat(cfg.date_format)
        if (cfg.timezone) setTimezone(cfg.timezone)
        if (cfg.primary_contact) setPrimaryContact(cfg.primary_contact)
        if (typeof cfg.maintenance_mode === 'boolean') setMaintenanceMode(cfg.maintenance_mode)
        if (typeof cfg.open_registration === 'boolean') setOpenRegistration(cfg.open_registration)
        if (typeof cfg.require_2fa === 'boolean') setRequire2FA(cfg.require_2fa)
      })
      .catch(() => setError('Unable to load configuration.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      await api.put<ConfigPayload>('/admin/configuration', {
        org_name: orgName,
        language,
        date_format: dateFormat,
        timezone,
        primary_contact: primaryContact,
        maintenance_mode: maintenanceMode,
        open_registration: openRegistration,
        require_2fa: require2FA,
      }, token)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save configuration.')
    } finally {
      setSaving(false)
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
        <h2 className="text-3xl font-bold text-[#00170d]">System Configuration</h2>
        <p className="text-on-surface-variant mt-xs">Manage portal settings and system preferences.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container">{error}</div>
      )}

      {saved && (
        <div className="rounded-lg bg-primary-fixed px-md py-sm text-sm text-on-primary-fixed">Configuration saved successfully.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        {/* Section Nav */}
        <div className="flex flex-col gap-xs">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`text-left px-md py-sm rounded-lg text-sm font-semibold transition-colors ${activeSection === section ? 'bg-[#00170d] text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Config Panel */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-lg flex flex-col gap-lg">
          {activeSection === 'General' && (
            <>
              <h3 className="text-lg font-semibold text-[#00170d]">General Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Organization Name</label>
                  <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-[#00170d]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Default Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-[#00170d]">
                    <option>English</option>
                    <option>French</option>
                    <option>Portuguese</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Date Format</label>
                  <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-[#00170d]">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-[#00170d]">
                    <option>Africa/Johannesburg</option>
                    <option>Africa/Nairobi</option>
                    <option>Africa/Lagos</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Primary Contact Email</label>
                  <input type="email" value={primaryContact} onChange={(e) => setPrimaryContact(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-sm text-sm outline-none focus:border-[#00170d]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Organization Logo</label>
                  <div className="flex items-center gap-md">
                    <div className="w-16 h-16 rounded-xl bg-[#00170d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[28px]">corporate_fare</span>
                    </div>
                    <label className="px-md py-sm rounded-full border border-outline-variant text-sm font-semibold cursor-pointer hover:border-[#00170d] transition-colors">
                      Upload Logo
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="border-t border-outline-variant/20 pt-lg">
                <h4 className="text-base font-semibold text-[#00170d] mb-md">System Toggles</h4>
                <div className="flex flex-col gap-md">
                  {[
                    { label: 'Maintenance Mode', desc: 'Take portal offline for maintenance', state: maintenanceMode, setter: setMaintenanceMode },
                    { label: 'Open Registration', desc: 'Allow users to register without invitation', state: openRegistration, setter: setOpenRegistration },
                    { label: 'Require 2FA', desc: 'Enforce two-factor authentication for all users', state: require2FA, setter: setRequire2FA },
                  ].map(({ label, desc, state, setter }) => (
                    <div key={label} className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{label}</p>
                        <p className="text-xs text-on-surface-variant">{desc}</p>
                      </div>
                      <button
                        onClick={() => setter(!state)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state ? 'bg-[#00170d]' : 'bg-outline-variant'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${state ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-md border-t border-outline-variant/20">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-lg py-sm rounded-full text-sm font-semibold transition-colors disabled:opacity-60 ${saved ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-[#fed65b] text-[#00170d] hover:opacity-90'}`}
                >
                  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

          {activeSection !== 'General' && (
            <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-md">construction</span>
              <p className="text-lg font-semibold">{activeSection} Settings</p>
              <p className="text-sm">Configuration for this section is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
