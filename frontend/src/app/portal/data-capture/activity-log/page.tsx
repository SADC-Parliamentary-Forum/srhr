'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

type CountryOption = { id: number; name: string }

type ActivityItem = {
  id: number
  title: string
  subject_type: string
  icon?: string
  country?: string
  description?: string | null
  activity_type?: string | null
  event_date?: string | null
  location?: string | null
  created_at: string
}

function formatDate(raw: string) {
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ActivityLogPage() {
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    activity_type: 'Field event',
    event_date: '',
    location: '',
    country_id: '',
    description: '',
  })

  useEffect(() => {
    const token = getToken()
    if (!token) return

    Promise.allSettled([
      fetch('/api/public/countries', { headers: { Accept: 'application/json' } }).then((res) => res.json()),
      api.get<ActivityItem[]>('/portal/activity-logs', token),
    ]).then(([countryResult, activityResult]) => {
      if (countryResult.status === 'fulfilled') {
        setCountries(Array.isArray(countryResult.value) ? countryResult.value : [])
      }
      if (activityResult.status === 'fulfilled') {
        setActivities(Array.isArray(activityResult.value) ? activityResult.value : [])
      }
    }).finally(() => setLoading(false))
  }, [])

  async function submitActivity() {
    const token = getToken()
    if (!token) return

    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const res = await api.post<{ message: string; activity: ActivityItem }>('/portal/activity-logs', {
        title: form.title,
        activity_type: form.activity_type,
        event_date: form.event_date || null,
        location: form.location || null,
        country_id: form.country_id ? Number(form.country_id) : null,
        description: form.description || null,
      }, token)

      setActivities((prev) => [res.activity, ...prev])
      setForm({
        title: '',
        activity_type: 'Field event',
        event_date: '',
        location: '',
        country_id: '',
        description: '',
      })
      setMessage(res.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save activity log.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-lg max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-[#00170d]">Activity Log</h2>
        <p className="text-[#414844] mt-xs">Log new organisational activities or field events.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-md">
        <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm p-md flex flex-col gap-md">
          <div>
            <h3 className="text-base font-bold text-[#00170d]">Add Activity Log</h3>
            <p className="text-sm text-[#414844] mt-xs">Capture a field visit, advocacy event, workshop, or other organisational activity.</p>
          </div>

          {message && <div className="rounded-lg bg-[#c6ebd7] text-[#002115] px-md py-sm text-sm font-medium">{message}</div>}
          {error && <div className="rounded-lg bg-[#ffdad6] text-[#93000a] px-md py-sm text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <input
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]"
              placeholder="Activity title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <select
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white"
              value={form.activity_type}
              onChange={(e) => setForm((prev) => ({ ...prev, activity_type: e.target.value }))}
            >
              {['Field event', 'Organisational activity', 'Advocacy visit', 'Workshop', 'Consultation', 'Meeting'].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]"
              type="date"
              value={form.event_date}
              onChange={(e) => setForm((prev) => ({ ...prev, event_date: e.target.value }))}
            />
            <input
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d]"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            />
            <select
              className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] bg-white"
              value={form.country_id}
              onChange={(e) => setForm((prev) => ({ ...prev, country_id: e.target.value }))}
            >
              <option value="">Regional / Unassigned</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>

          <textarea
            className="border border-[#c1c8c2] rounded-lg px-md py-sm text-sm outline-none focus:border-[#00170d] min-h-32 resize-y"
            placeholder="Activity notes"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="flex items-center justify-end">
            <button
              onClick={submitActivity}
              disabled={saving || !form.title.trim()}
              className="px-md py-sm rounded-full bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#c1c8c2] shadow-sm p-md flex flex-col gap-md">
          <div>
            <h3 className="text-base font-bold text-[#00170d]">Recent Activity Logs</h3>
            <p className="text-sm text-[#414844] mt-xs">Recently added organisational activities and field events.</p>
          </div>

          {loading ? (
            <div className="py-lg flex justify-center">
              <span className="material-symbols-outlined text-[#00170d] text-4xl animate-spin">progress_activity</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#c1c8c2] p-lg text-center text-sm text-[#414844]">
              No activity logs have been added yet.
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {activities.map((item) => (
                <div key={item.id} className="rounded-lg border border-[#c1c8c2] bg-[#f5f3f3] p-md flex flex-col gap-xs">
                  <div className="flex items-start justify-between gap-sm">
                    <div>
                      <p className="text-sm font-semibold text-[#00170d]">{item.title}</p>
                      <p className="text-xs text-[#414844]">
                        {item.activity_type ?? 'Activity'} {item.location ? `· ${item.location}` : ''}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-[#745c00]">{item.icon ?? 'event_note'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-sm text-xs text-[#727974]">
                    <span>{item.country ?? 'Regional'}</span>
                    <span>{item.event_date ? formatDate(item.event_date) : formatDate(item.created_at)}</span>
                  </div>
                  {item.description && <p className="text-sm text-[#414844]">{item.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
