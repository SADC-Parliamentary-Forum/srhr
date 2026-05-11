'use client'

import { useState } from 'react'

const dataSources = ['Annual SRHR Surveys', 'DHIS2 National Sync', 'Community Health Logs']
const indicators = ['Maternal Mortality Ratio', 'Contraceptive Prevalence', 'Adolescent Birth Rate', 'Skilled Birth Attendance', 'HIV Prevalence Among Youth']
const vizTypes = [
  { icon: 'bar_chart', label: 'Bar Chart' },
  { icon: 'show_chart', label: 'Line Chart' },
  { icon: 'table_chart', label: 'Data Table' },
  { icon: 'map', label: 'Heatmap' },
]
const canvasBlocks = [
  { type: 'header', title: 'Q3 Regional Performance Overview', subtitle: 'Analysis of key reproductive health indicators across sub-Saharan regions.' },
  { type: 'chart', title: 'Adolescent Birth Rate Trend (2020–2024)', chartIcon: 'show_chart', span: 8 },
  { type: 'metric', label: 'Regional Average', value: '42.8', trend: '+2.4%', trendColor: 'text-error' },
  { type: 'metric', label: 'Data Completeness', value: '94%', progress: 94 },
]

export default function ReportBuilderPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['Annual SRHR Surveys'])

  const toggleSource = (src: string) =>
    setSelectedSources((prev) => prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src])

  return (
    <div className="flex flex-col h-full -my-lg -mx-gutter md:-mx-lg">
      {/* Builder Toolbar */}
      <div className="flex items-center justify-between px-lg py-sm border-b border-outline-variant bg-surface-bright shrink-0">
        <div className="flex items-center gap-sm">
          <h2 className="text-lg font-semibold text-primary">Custom Report Builder</h2>
          <div className="h-6 w-px bg-outline-variant mx-sm" />
          <select className="bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm text-on-surface focus:border-primary outline-none">
            <option>All Countries</option>
            <option>Kenya</option>
            <option>Malawi</option>
          </select>
          <select className="bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm text-on-surface focus:border-primary outline-none">
            <option>Q3 2024</option>
            <option>Q2 2024</option>
            <option>Year to Date</option>
          </select>
        </div>
        <div className="flex gap-sm">
          <button className="px-sm py-1 rounded text-primary text-sm font-semibold hover:bg-surface-container flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Preview Report
          </button>
          <button className="px-md py-1 rounded bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
            Save Template
          </button>
        </div>
      </div>

      {/* Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Config Sidebar */}
        <aside className="w-72 bg-surface border-r border-outline-variant/30 flex flex-col overflow-y-auto shrink-0">
          {/* Data Sources */}
          <div className="border-b border-outline-variant/30">
            <div className="flex items-center justify-between px-gutter py-sm">
              <span className="text-sm font-semibold text-primary">Data Sources</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_less</span>
            </div>
            <div className="px-gutter pb-gutter flex flex-col gap-sm">
              {dataSources.map((src) => (
                <label key={src} className="flex items-center gap-sm cursor-pointer p-sm rounded bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(src)}
                    onChange={() => toggleSource(src)}
                    className="rounded text-primary"
                  />
                  <span className="text-sm">{src}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="border-b border-outline-variant/30 flex-1">
            <div className="flex items-center justify-between px-gutter py-sm">
              <span className="text-sm font-semibold text-primary">Indicators</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_less</span>
            </div>
            <div className="px-gutter pb-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input className="w-full pl-lg pr-sm py-1 rounded bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary" placeholder="Search indicators..." type="text" />
              </div>
            </div>
            <div className="px-gutter pb-gutter flex flex-col gap-xs">
              {indicators.map((ind, i) => (
                <div key={ind} className={`flex items-center justify-between p-xs rounded cursor-pointer group ${i === 2 ? 'bg-primary-fixed/20' : 'hover:bg-surface-container'}`}>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-outline text-[16px]">drag_indicator</span>
                    <span className={`text-sm ${i === 2 ? 'font-semibold' : ''}`}>{ind}</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    {i === 2 ? 'check_circle' : 'add_circle'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visualizations */}
          <div>
            <div className="flex items-center justify-between px-gutter py-sm">
              <span className="text-sm font-semibold text-primary">Visualizations</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_less</span>
            </div>
            <div className="px-gutter pb-gutter grid grid-cols-2 gap-sm">
              {vizTypes.map((viz) => (
                <div key={viz.label} className="aspect-square bg-surface-container-lowest border border-outline-variant/50 rounded flex flex-col items-center justify-center gap-xs cursor-pointer hover:border-primary hover:shadow-sm transition-all text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-[32px]">{viz.icon}</span>
                  <span className="text-xs font-semibold">{viz.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <section className="flex-1 p-lg overflow-y-auto bg-surface-container-low">
          <div className="max-w-4xl mx-auto flex flex-col gap-lg">
            {/* Report Header Block */}
            <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-md group relative">
              <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
              <input className="w-full bg-transparent border-none text-2xl font-bold text-primary outline-none mb-sm" defaultValue="Q3 Regional Performance Overview" />
              <textarea className="w-full bg-transparent border-none text-sm text-on-surface-variant outline-none resize-none" rows={2} defaultValue="Analysis of key reproductive health indicators across sub-Saharan regions, highlighting variations in adolescent birth rates." />
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-12 lg:col-span-8 bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-md min-h-[280px] flex flex-col group relative">
                <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                  <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">settings</span></button>
                  <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">drag_indicator</span></button>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-md">Adolescent Birth Rate Trend (2020–2024)</h3>
                <div className="flex-1 border-2 border-dashed border-outline-variant/40 rounded bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface-variant gap-sm">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant">show_chart</span>
                  <p className="text-sm">Line Chart Placeholder</p>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-md">
                <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-md flex-1 flex flex-col justify-center">
                  <span className="text-sm text-on-surface-variant mb-xs">Regional Average</span>
                  <span className="text-5xl font-black text-primary">42.8</span>
                  <span className="text-xs text-error flex items-center mt-sm">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+2.4% vs last cycle
                  </span>
                </div>
                <div className="bg-surface rounded-xl shadow-sm border border-l-4 border-secondary p-md flex-1 flex flex-col justify-center">
                  <span className="text-sm text-on-surface-variant mb-xs">Data Completeness</span>
                  <span className="text-5xl font-black text-primary">94%</span>
                  <div className="w-full bg-surface-container h-1 rounded-full mt-sm overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table Block */}
            <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 p-md group relative">
              <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                <button className="p-xs rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">drag_indicator</span></button>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-md">Summary Data Table</h3>
              <div className="border border-dashed border-outline-variant/40 rounded bg-surface-container-lowest flex items-center justify-center h-32 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mr-sm text-outline-variant">table_chart</span>
                <span className="text-sm">Data Table Placeholder</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Properties Panel */}
        <aside className="w-64 bg-surface border-l border-outline-variant/30 flex flex-col overflow-y-auto shrink-0 p-gutter">
          <h3 className="text-sm font-semibold text-primary mb-md">Properties</h3>
          <div className="flex flex-col gap-md">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Title</label>
              <input className="w-full bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm outline-none focus:border-primary" defaultValue="Adolescent Birth Rate Trend" />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Color Scheme</label>
              <select className="w-full bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm outline-none focus:border-primary">
                <option>Forest Green</option>
                <option>Gold</option>
                <option>Neutral</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Data Source</label>
              <select className="w-full bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm outline-none focus:border-primary">
                <option>Annual SRHR Surveys</option>
                <option>DHIS2 National Sync</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant mb-xs block">Date Range</label>
              <select className="w-full bg-surface-container border border-outline-variant rounded px-sm py-1 text-sm outline-none focus:border-primary">
                <option>2020–2024</option>
                <option>2022–2024</option>
                <option>Last 12 months</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
