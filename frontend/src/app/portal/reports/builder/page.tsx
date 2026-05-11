'use client'

import { useState } from 'react'

const dataSources = ['Annual SRHR Surveys', 'DHIS2 National Sync', 'Community Health Logs']
const indicators = [
  'Maternal Mortality Ratio',
  'Contraceptive Prevalence',
  'Adolescent Birth Rate',
  'Skilled Birth Attendance',
  'HIV Prevalence Among Youth',
]
const vizTypes = [
  { icon: 'bar_chart', label: 'Bar Chart' },
  { icon: 'show_chart', label: 'Line Chart' },
  { icon: 'table_chart', label: 'Data Table' },
  { icon: 'map', label: 'Heatmap' },
]

export default function ReportBuilderPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['Annual SRHR Surveys'])

  const toggleSource = (src: string) => {
    setSelectedSources((prev) => (prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]))
  }

  return (
    <div className="flex min-w-0 flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <h1 className="text-3xl font-bold text-[#00170d]">Reports Builder</h1>
        <p className="max-w-2xl text-sm text-[#414844]">
          Build and edit custom reporting layouts with consistent portal styling, clear hierarchy, and focused analysis controls.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-lg py-md">
        <div className="flex flex-wrap items-center gap-sm">
          <span className="text-sm font-semibold text-[#00170d]">Custom Report Builder</span>
          <div className="h-5 w-px bg-outline-variant" />
          <select className="rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary">
            <option>All Countries</option>
            <option>Kenya</option>
            <option>Malawi</option>
          </select>
          <select className="rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary">
            <option>Q3 2024</option>
            <option>Q2 2024</option>
            <option>Year to Date</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button className="flex items-center gap-xs rounded-full border border-outline-variant bg-surface-container px-md py-sm text-sm font-semibold text-[#00170d] transition-colors hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Preview Report
          </button>
          <button className="flex items-center gap-xs rounded-full bg-[#00170d] px-md py-sm text-sm font-semibold text-white transition-opacity hover:opacity-90">
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            Save Template
          </button>
        </div>
      </div>

      <div className="grid min-h-[760px] grid-cols-1 gap-md xl:grid-cols-[288px_minmax(0,1fr)_256px]">
        <aside className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <div className="border-b border-outline-variant bg-surface-container px-lg py-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00170d]">Data Sources</span>
              <span className="material-symbols-outlined text-[18px] text-[#414844]">expand_less</span>
            </div>
          </div>
          <div className="flex flex-col gap-sm p-lg">
            {dataSources.map((src) => (
              <label
                key={src}
                className="flex cursor-pointer items-center gap-sm rounded-xl border border-outline-variant bg-surface-container px-md py-sm transition-colors hover:bg-surface-container-high"
              >
                <input
                  type="checkbox"
                  checked={selectedSources.includes(src)}
                  onChange={() => toggleSource(src)}
                  className="rounded text-[#00170d]"
                />
                <span className="text-sm text-[#00170d]">{src}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-outline-variant bg-surface-container px-lg py-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00170d]">Indicators</span>
              <span className="material-symbols-outlined text-[18px] text-[#414844]">expand_less</span>
            </div>
          </div>
          <div className="p-lg pt-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[18px] text-[#414844]">
                search
              </span>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-container py-sm pl-lg pr-md text-sm text-[#00170d] outline-none placeholder:text-[#414844] focus:border-primary"
                placeholder="Search indicators..."
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-xs px-lg pb-lg">
            {indicators.map((ind, i) => (
              <div
                key={ind}
                className={`flex items-center justify-between rounded-xl border px-md py-sm transition-colors ${
                  i === 2
                    ? 'border-primary bg-primary-container/20'
                    : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#414844]">drag_indicator</span>
                  <span className={`text-sm ${i === 2 ? 'font-semibold text-[#00170d]' : 'text-[#00170d]'}`}>{ind}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#00170d]">
                  {i === 2 ? 'check_circle' : 'add_circle'}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant bg-surface-container px-lg py-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00170d]">Visualizations</span>
              <span className="material-symbols-outlined text-[18px] text-[#414844]">expand_less</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-sm p-lg">
            {vizTypes.map((viz) => (
              <button
                key={viz.label}
                className="flex aspect-square flex-col items-center justify-center gap-xs rounded-xl border border-outline-variant bg-surface-container text-[#414844] transition-colors hover:bg-surface-container-high hover:text-[#00170d]"
              >
                <span className="material-symbols-outlined text-[32px]">{viz.icon}</span>
                <span className="text-xs font-semibold">{viz.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container px-lg py-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px] text-[#00170d]">dashboard</span>
              <span className="text-sm font-semibold text-[#00170d]">Canvas</span>
            </div>
            <span className="text-sm text-[#414844]">Drag, edit, and preview the report layout</span>
          </div>

          <div className="max-w-5xl space-y-lg p-lg">
            <div className="group relative rounded-xl border border-outline-variant bg-surface-container p-lg">
              <div className="absolute right-sm top-sm flex gap-xs opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg border border-outline-variant bg-surface-container p-xs text-[#414844] hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="rounded-lg border border-outline-variant bg-surface-container p-xs text-[#414844] hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              <input
                className="mb-sm w-full border-none bg-transparent text-2xl font-bold text-[#00170d] outline-none"
                defaultValue="Q3 Regional Performance Overview"
              />
              <textarea
                className="w-full resize-none border-none bg-transparent text-sm text-[#414844] outline-none"
                rows={2}
                defaultValue="Analysis of key reproductive health indicators across sub-Saharan regions, highlighting variations in adolescent birth rates."
              />
            </div>

            <div className="grid grid-cols-12 gap-md">
              <div className="group relative col-span-12 rounded-xl border border-outline-variant bg-surface-container p-lg lg:col-span-8">
                <div className="absolute right-sm top-sm flex gap-xs opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-lg border border-outline-variant bg-surface-container p-xs text-[#414844] hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>
                  <button className="rounded-lg border border-outline-variant bg-surface-container p-xs text-[#414844] hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                </div>
                <h3 className="mb-md text-lg font-semibold text-[#00170d]">Adolescent Birth Rate Trend (2020-2024)</h3>
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-sm rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-[#414844]">
                  <span className="material-symbols-outlined text-[48px] text-[#414844]">show_chart</span>
                  <p className="text-sm">Line Chart Placeholder</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-md lg:col-span-4">
                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
                  <span className="mb-xs block text-sm font-medium text-[#414844]">Regional Average</span>
                  <span className="block text-4xl font-bold text-[#00170d]">42.8</span>
                  <span className="mt-sm flex items-center gap-xs text-sm text-[#745c00]">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    +2.4% vs last cycle
                  </span>
                </div>

                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
                  <span className="mb-xs block text-sm font-medium text-[#414844]">Data Completeness</span>
                  <span className="block text-4xl font-bold text-[#00170d]">94%</span>
                  <div className="mt-sm h-2 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-[#00170d]" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl border border-outline-variant bg-surface-container p-lg">
              <div className="absolute right-sm top-sm flex gap-xs opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg border border-outline-variant bg-surface-container p-xs text-[#414844] hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                </button>
              </div>
              <h3 className="mb-md text-lg font-semibold text-[#00170d]">Summary Data Table</h3>
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-[#414844]">
                <span className="material-symbols-outlined mr-sm text-[32px] text-[#414844]">table_chart</span>
                <span className="text-sm">Data Table Placeholder</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-md overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#00170d]">Properties</h3>
            <span className="material-symbols-outlined text-[18px] text-[#414844]">tune</span>
          </div>

          <div className="flex flex-col gap-md">
            <div>
              <label className="mb-xs block text-xs font-semibold text-[#414844]">Title</label>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary"
                defaultValue="Adolescent Birth Rate Trend"
              />
            </div>
            <div>
              <label className="mb-xs block text-xs font-semibold text-[#414844]">Color Scheme</label>
              <select className="w-full rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary">
                <option>Forest Green</option>
                <option>Gold</option>
                <option>Neutral</option>
              </select>
            </div>
            <div>
              <label className="mb-xs block text-xs font-semibold text-[#414844]">Data Source</label>
              <select className="w-full rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary">
                <option>Annual SRHR Surveys</option>
                <option>DHIS2 National Sync</option>
              </select>
            </div>
            <div>
              <label className="mb-xs block text-xs font-semibold text-[#414844]">Date Range</label>
              <select className="w-full rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-sm text-[#00170d] outline-none focus:border-primary">
                <option>2020-2024</option>
                <option>2022-2024</option>
                <option>Last 12 months</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
