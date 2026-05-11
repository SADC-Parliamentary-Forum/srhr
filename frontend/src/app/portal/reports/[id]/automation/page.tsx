'use client'

import { useState } from 'react'

type ScheduleType = 'time-based' | 'event-based'

export default function ReportAutomationPage({ params }: { params: { id: string } }) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('time-based')
  const [frequency, setFrequency] = useState('Monthly')
  const [day, setDay] = useState('1')
  const [time, setTime] = useState('08:00')
  const [timezone, setTimezone] = useState('Africa/Johannesburg')
  const [recipients, setRecipients] = useState(['secretariat@sadc-pf.org', 'ronald@sadc-pf.org'])
  const [newRecipient, setNewRecipient] = useState('')
  const [triggers, setTriggers] = useState({ newData: true, threshold: false, milestone: true })

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients((prev) => [...prev, newRecipient])
      setNewRecipient('')
    }
  }

  const removeRecipient = (r: string) => setRecipients((prev) => prev.filter((x) => x !== r))

  return (
    <div className="flex flex-col gap-lg max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Automation Settings</h2>
          <p className="text-on-surface-variant mt-xs">Report ID: {params.id}</p>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary transition-colors">
            Save Draft
          </button>
          <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
            Activate Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="col-span-2 flex flex-col gap-lg">
          {/* Schedule Type */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm">
            <h3 className="text-base font-semibold text-primary mb-md">Schedule Type</h3>
            <div className="flex gap-md mb-md">
              {(['time-based', 'event-based'] as ScheduleType[]).map((type) => (
                <label key={type} className="flex items-center gap-sm cursor-pointer">
                  <input type="radio" name="scheduleType" value={type} checked={scheduleType === type} onChange={() => setScheduleType(type)} className="text-primary" />
                  <span className="text-sm font-semibold capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>

            {scheduleType === 'time-based' && (
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Day</label>
                  <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary">
                    <option>Africa/Johannesburg</option>
                    <option>Africa/Nairobi</option>
                    <option>Africa/Lagos</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Recipients */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm">
            <h3 className="text-base font-semibold text-primary mb-md">Recipients</h3>
            <div className="flex gap-sm mb-md">
              <input
                className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none focus:border-primary"
                placeholder="Add email address..."
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
              />
              <button onClick={addRecipient} className="px-md py-xs rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90">Add</button>
            </div>
            <div className="flex flex-wrap gap-sm">
              {recipients.map((r) => (
                <div key={r} className="flex items-center gap-xs bg-surface-container px-sm py-xs rounded-full text-sm border border-outline-variant">
                  <span>{r}</span>
                  <button onClick={() => removeRecipient(r)} className="text-on-surface-variant hover:text-error ml-xs">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Triggers */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm">
            <h3 className="text-base font-semibold text-primary mb-md">Event Triggers</h3>
            <div className="flex flex-col gap-sm">
              {[
                { key: 'newData', label: 'On new data upload', desc: 'Send report when new indicator data is uploaded' },
                { key: 'threshold', label: 'On threshold breach', desc: 'Alert when an indicator breaches target threshold' },
                { key: 'milestone', label: 'On milestone reached', desc: 'Notify when reporting milestones are achieved' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-sm cursor-pointer p-sm rounded-lg hover:bg-surface-container-low">
                  <input
                    type="checkbox"
                    checked={triggers[key as keyof typeof triggers]}
                    onChange={(e) => setTriggers((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="mt-xs text-primary rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{label}</p>
                    <p className="text-xs text-on-surface-variant">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="bg-primary rounded-xl p-md text-on-primary sticky top-4">
            <h3 className="text-base font-semibold mb-md">Next Scheduled Run</h3>
            <div className="bg-on-primary/10 rounded-lg p-sm mb-md">
              <p className="text-sm font-semibold">Jun 1, 2026 at 08:00</p>
              <p className="text-xs text-on-primary/70">Africa/Johannesburg</p>
            </div>
            <div className="flex flex-col gap-sm text-sm">
              <div className="flex justify-between">
                <span className="text-on-primary/70">Frequency</span>
                <span className="font-semibold">{frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-primary/70">Recipients</span>
                <span className="font-semibold">{recipients.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-primary/70">Status</span>
                <span className="font-semibold text-secondary-container">Draft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
