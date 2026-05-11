'use client'

import { useState } from 'react'

const dataSources = [
  { name: 'Annual SRHR Surveys', detail: '6 countries, 42 indicators', freshness: 'Synced today' },
  { name: 'DHIS2 National Sync', detail: 'Health service delivery', freshness: 'Synced yesterday' },
  { name: 'Community Health Logs', detail: 'Field events and activities', freshness: 'Pending review' },
]

const indicators = [
  { name: 'Maternal Mortality Ratio', code: 'O6.1', group: 'Evidence' },
  { name: 'Contraceptive Prevalence', code: 'O3.2', group: 'Budgeting' },
  { name: 'Adolescent Birth Rate', code: 'O7.4', group: 'Accountability' },
  { name: 'Skilled Birth Attendance', code: 'O4.3', group: 'Oversight' },
  { name: 'HIV Prevalence Among Youth', code: 'O6.5', group: 'Research' },
]

const vizTypes = [
  { icon: 'bar_chart', label: 'Bar', description: 'Compare countries' },
  { icon: 'show_chart', label: 'Trend', description: 'Show movement' },
  { icon: 'table_chart', label: 'Table', description: 'Detailed values' },
  { icon: 'map', label: 'Map', description: 'Regional spread' },
]

const sections = [
  { icon: 'title', label: 'Heading' },
  { icon: 'notes', label: 'Narrative' },
  { icon: 'monitoring', label: 'KPI Row' },
  { icon: 'insights', label: 'Insight' },
]

const chartBars = [
  { country: 'Malawi', value: 78 },
  { country: 'Zambia', value: 62 },
  { country: 'Mozambique', value: 55 },
  { country: 'Zimbabwe', value: 71 },
]

export default function ReportBuilderPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['Annual SRHR Surveys'])
  const [selectedIndicator, setSelectedIndicator] = useState('Adolescent Birth Rate')
  const [selectedViz, setSelectedViz] = useState('Trend')
  const [mode, setMode] = useState<'builder' | 'preview'>('builder')
  const [reportTitle, setReportTitle] = useState('Q3 Regional Performance Overview')
  const [reportSummary, setReportSummary] = useState(
    'Analysis of key reproductive health indicators across SADC member parliaments, with emphasis on budget execution, oversight activity, and evidence use.'
  )
  const [message, setMessage] = useState<string | null>(null)

  function toggleSource(source: string) {
    setSelectedSources((current) =>
      current.includes(source) ? current.filter((item) => item !== source) : [...current, source]
    )
  }

  function showMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(null), 2600)
  }

  return (
    <div className="min-w-0 space-y-lg">
      <div className="flex flex-col gap-md xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#745c00]">Reports Workspace</p>
          <h1 className="mt-xs text-3xl font-bold text-[#00170d]">Reports Builder</h1>
          <p className="mt-xs max-w-3xl text-sm text-[#414844]">
            Assemble a clean reporting layout from approved data sources, indicators, visual blocks, and narrative sections.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button
            type="button"
            onClick={() => setMode('builder')}
            className={`flex items-center gap-xs rounded-full px-md py-sm text-sm font-semibold transition-colors ${
              mode === 'builder'
                ? 'bg-[#00170d] text-white'
                : 'border border-[#c1c8c2] bg-white text-[#414844] hover:border-[#00170d] hover:text-[#00170d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
            Builder
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center gap-xs rounded-full px-md py-sm text-sm font-semibold transition-colors ${
              mode === 'preview'
                ? 'bg-[#00170d] text-white'
                : 'border border-[#c1c8c2] bg-white text-[#414844] hover:border-[#00170d] hover:text-[#00170d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Preview
          </button>
          <button
            type="button"
            onClick={() => showMessage('Template saved as draft.')}
            className="flex items-center gap-xs rounded-full bg-[#fed65b] px-md py-sm text-sm font-bold text-[#745c00] transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-[#c1c8c2] bg-[#c6ebd7] px-md py-sm text-sm font-semibold text-[#002115]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-sm rounded-lg border border-[#c1c8c2] bg-white p-sm shadow-sm lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid grid-cols-1 gap-sm md:grid-cols-4">
          <label className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase tracking-wide text-[#414844]">Country</span>
            <select className="rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
              <option>All Countries</option>
              <option>Malawi</option>
              <option>Zambia</option>
              <option>Zimbabwe</option>
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase tracking-wide text-[#414844]">Period</span>
            <select className="rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
              <option>April 2026</option>
              <option>Q2 2026</option>
              <option>Year 3</option>
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase tracking-wide text-[#414844]">Report Type</span>
            <select className="rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
              <option>Performance Report</option>
              <option>Budget Analysis</option>
              <option>Country Brief</option>
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase tracking-wide text-[#414844]">Status</span>
            <select className="rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
              <option>Draft</option>
              <option>Ready for Review</option>
              <option>Approved</option>
            </select>
          </label>
        </div>
        <div className="flex items-end gap-xs">
          {['undo', 'redo', 'download', 'more_vert'].map((icon) => (
            <button
              key={icon}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c1c8c2] bg-[#f9f8f5] text-[#414844] transition-colors hover:border-[#00170d] hover:text-[#00170d]"
              aria-label={icon}
            >
              <span className="material-symbols-outlined text-[19px]">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[760px] grid-cols-1 gap-md xl:grid-cols-[300px_minmax(0,1fr)_280px]">
        <aside className="overflow-hidden rounded-lg border border-[#c1c8c2] bg-white shadow-sm">
          <div className="border-b border-[#c1c8c2] bg-[#f5f3f3] px-md py-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#00170d]">Builder Tools</h2>
              <span className="material-symbols-outlined text-[18px] text-[#414844]">widgets</span>
            </div>
          </div>

          <div className="space-y-md p-md">
            <section>
              <div className="mb-sm flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#414844]">Data Sources</h3>
                <span className="text-xs font-semibold text-[#745c00]">{selectedSources.length} active</span>
              </div>
              <div className="space-y-xs">
                {dataSources.map((source) => {
                  const selected = selectedSources.includes(source.name)
                  return (
                    <button
                      key={source.name}
                      type="button"
                      onClick={() => toggleSource(source.name)}
                      className={`w-full rounded-lg border px-sm py-sm text-left transition-colors ${
                        selected
                          ? 'border-[#00170d] bg-[#c6ebd7] text-[#00170d]'
                          : 'border-[#c1c8c2] bg-[#f9f8f5] text-[#414844] hover:border-[#00170d]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-sm">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{source.name}</p>
                          <p className="text-xs">{source.detail}</p>
                          <p className="mt-1 text-[11px] font-semibold text-[#745c00]">{source.freshness}</p>
                        </div>
                        <span className="material-symbols-outlined text-[18px]">
                          {selected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <div className="mb-sm flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#414844]">Indicators</h3>
                <button type="button" className="text-xs font-bold text-[#00170d] hover:underline">Filter</button>
              </div>
              <div className="relative mb-sm">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[18px] text-[#414844]">search</span>
                <input
                  className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] py-sm pl-lg pr-sm text-sm text-[#00170d] outline-none placeholder:text-[#727974] focus:border-[#00170d]"
                  placeholder="Search indicators"
                  type="text"
                />
              </div>
              <div className="space-y-xs">
                {indicators.map((indicator) => {
                  const selected = indicator.name === selectedIndicator
                  return (
                    <button
                      key={indicator.name}
                      type="button"
                      onClick={() => setSelectedIndicator(indicator.name)}
                      className={`w-full rounded-lg border px-sm py-sm text-left transition-colors ${
                        selected
                          ? 'border-[#00170d] bg-[#00170d] text-white'
                          : 'border-[#c1c8c2] bg-[#f9f8f5] text-[#00170d] hover:border-[#00170d]'
                      }`}
                    >
                      <div className="flex items-start gap-sm">
                        <span className="material-symbols-outlined mt-[1px] text-[18px]">drag_indicator</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{indicator.name}</p>
                          <p className={selected ? 'text-xs text-white/75' : 'text-xs text-[#414844]'}>
                            {indicator.code} | {indicator.group}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-sm text-xs font-bold uppercase tracking-wide text-[#414844]">Blocks</h3>
              <div className="grid grid-cols-2 gap-xs">
                {sections.map((section) => (
                  <button
                    key={section.label}
                    type="button"
                    onClick={() => showMessage(`${section.label} block added.`)}
                    className="flex min-h-20 flex-col items-center justify-center gap-xs rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-xs py-sm text-[#414844] transition-colors hover:border-[#00170d] hover:text-[#00170d]"
                  >
                    <span className="material-symbols-outlined text-[24px]">{section.icon}</span>
                    <span className="text-xs font-semibold">{section.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <main className="overflow-hidden rounded-lg border border-[#c1c8c2] bg-white shadow-sm">
          <div className="flex flex-col gap-sm border-b border-[#c1c8c2] bg-[#f5f3f3] px-md py-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[20px] text-[#00170d]">dashboard_customize</span>
              <div>
                <h2 className="text-sm font-bold text-[#00170d]">Report Canvas</h2>
                <p className="text-xs text-[#414844]">{mode === 'builder' ? 'Editable layout' : 'Preview mode'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-xs">
              {['A4', 'Landscape', 'Grid on'].map((item) => (
                <span key={item} className="rounded-full border border-[#c1c8c2] bg-white px-sm py-xs text-xs font-semibold text-[#414844]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#edeae6] p-md sm:p-lg">
            <div className="mx-auto max-w-5xl space-y-md rounded-lg border border-[#c1c8c2] bg-[#fffdf8] p-md shadow-sm sm:p-lg">
              <div className="group relative rounded-lg border border-[#c1c8c2] bg-white p-md">
                <div className="absolute right-sm top-sm flex gap-xs opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {['edit', 'content_copy', 'delete'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c1c8c2] bg-[#f9f8f5] text-[#414844] hover:text-[#00170d]"
                      aria-label={icon}
                    >
                      <span className="material-symbols-outlined text-[17px]">{icon}</span>
                    </button>
                  ))}
                </div>
                <input
                  className="mb-xs w-full pr-28 text-2xl font-bold text-[#00170d] outline-none"
                  value={reportTitle}
                  onChange={(event) => setReportTitle(event.target.value)}
                />
                <textarea
                  className="min-h-16 w-full resize-none text-sm leading-6 text-[#414844] outline-none"
                  value={reportSummary}
                  onChange={(event) => setReportSummary(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-md">
                <section className="group relative col-span-12 rounded-lg border border-[#c1c8c2] bg-white p-md lg:col-span-8">
                  <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#00170d]">{selectedIndicator}</h3>
                      <p className="text-xs text-[#414844]">{selectedViz} view | 2020-2024</p>
                    </div>
                    <div className="flex gap-xs">
                      {vizTypes.map((viz) => (
                        <button
                          key={viz.label}
                          type="button"
                          onClick={() => setSelectedViz(viz.label)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                            selectedViz === viz.label
                              ? 'border-[#00170d] bg-[#00170d] text-white'
                              : 'border-[#c1c8c2] bg-[#f9f8f5] text-[#414844] hover:text-[#00170d]'
                          }`}
                          aria-label={viz.label}
                        >
                          <span className="material-symbols-outlined text-[18px]">{viz.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-h-[300px] rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] p-md">
                    <div className="flex h-full min-h-[260px] items-end gap-md">
                      {chartBars.map((bar) => (
                        <div key={bar.country} className="flex flex-1 flex-col items-center justify-end gap-xs">
                          <div className="flex h-52 w-full items-end rounded-lg bg-white px-sm pb-sm">
                            <div
                              className="w-full rounded-md bg-[#00170d]"
                              style={{ height: `${bar.value}%` }}
                              title={`${bar.country}: ${bar.value}%`}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#414844]">{bar.country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="col-span-12 grid gap-md sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                  <div className="rounded-lg border border-[#c1c8c2] bg-white p-md">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#414844]">Regional Average</p>
                    <p className="mt-xs text-4xl font-black text-[#00170d]">42.8</p>
                    <p className="mt-xs flex items-center gap-xs text-sm font-semibold text-[#745c00]">
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      +2.4% vs last cycle
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#c1c8c2] bg-white p-md">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#414844]">Data Completeness</p>
                    <p className="mt-xs text-4xl font-black text-[#00170d]">94%</p>
                    <div className="mt-sm h-2 overflow-hidden rounded-full bg-[#e4e2e2]">
                      <div className="h-full rounded-full bg-[#00170d]" style={{ width: '94%' }} />
                    </div>
                  </div>
                </aside>
              </div>

              <section className="rounded-lg border border-[#c1c8c2] bg-white p-md">
                <div className="mb-sm flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#00170d]">Summary Table</h3>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c1c8c2] bg-[#f9f8f5] text-[#414844] hover:text-[#00170d]"
                    aria-label="Table settings"
                  >
                    <span className="material-symbols-outlined text-[17px]">settings</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#c1c8c2] text-xs font-bold uppercase tracking-wide text-[#414844]">
                        <th className="py-sm pr-md">Country</th>
                        <th className="py-sm pr-md">Indicator</th>
                        <th className="py-sm pr-md">Status</th>
                        <th className="py-sm pr-md">Evidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e2e2] text-[#1b1c1c]">
                      {chartBars.map((bar) => (
                        <tr key={bar.country}>
                          <td className="py-sm pr-md font-semibold">{bar.country}</td>
                          <td className="py-sm pr-md">{selectedIndicator}</td>
                          <td className="py-sm pr-md">
                            <span className="rounded-full bg-[#c6ebd7] px-sm py-xs text-xs font-bold text-[#002115]">On Track</span>
                          </td>
                          <td className="py-sm pr-md">{bar.value}% complete</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>

        <aside className="overflow-hidden rounded-lg border border-[#c1c8c2] bg-white shadow-sm">
          <div className="border-b border-[#c1c8c2] bg-[#f5f3f3] px-md py-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#00170d]">Properties</h2>
              <span className="material-symbols-outlined text-[18px] text-[#414844]">tune</span>
            </div>
          </div>
          <div className="space-y-md p-md">
            <label className="block">
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Selected Block</span>
              <select className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
                <option>Chart: {selectedIndicator}</option>
                <option>Report Heading</option>
                <option>Summary Table</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Chart Title</span>
              <input
                className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]"
                value={selectedIndicator}
                onChange={(event) => setSelectedIndicator(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Color Scheme</span>
              <select className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
                <option>Forest Green</option>
                <option>Warm Gold</option>
                <option>Neutral</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Data Source</span>
              <select className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
                {selectedSources.map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Date Range</span>
              <select className="w-full rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-md py-sm text-sm text-[#00170d] outline-none focus:border-[#00170d]">
                <option>2020-2024</option>
                <option>2022-2024</option>
                <option>Last 12 months</option>
              </select>
            </label>
            <div>
              <span className="mb-xs block text-xs font-bold uppercase tracking-wide text-[#414844]">Export Includes</span>
              <div className="space-y-xs">
                {['Filters', 'Narrative', 'Evidence list'].map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] px-sm py-sm">
                    <span className="text-sm font-semibold text-[#00170d]">{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#00170d]" />
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => showMessage('Properties applied.')}
              className="flex w-full items-center justify-center gap-xs rounded-full bg-[#00170d] px-md py-sm text-sm font-semibold text-white hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[18px]">done</span>
              Apply Changes
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
