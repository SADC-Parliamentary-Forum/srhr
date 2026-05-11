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
]

const vizTypes = [
  { icon: 'bar_chart', label: 'Bar Chart', value: 'Bar' },
  { icon: 'show_chart', label: 'Line Chart', value: 'Trend' },
  { icon: 'table_chart', label: 'Data Table', value: 'Table' },
  { icon: 'map', label: 'Heatmap', value: 'Map' },
]

const chartBars = [
  { country: 'Malawi', value: 78, target: 70 },
  { country: 'Zambia', value: 62, target: 68 },
  { country: 'Mozambique', value: 55, target: 64 },
  { country: 'Zimbabwe', value: 71, target: 69 },
  { country: 'Angola', value: 49, target: 62 },
  { country: 'South Africa', value: 83, target: 76 },
]

const trendData = [
  { year: '2020', regional: 48, target: 55 },
  { year: '2021', regional: 52, target: 58 },
  { year: '2022', regional: 59, target: 62 },
  { year: '2023', regional: 65, target: 66 },
  { year: '2024', regional: 72, target: 70 },
]

const heatMapData = [
  { country: 'Malawi', outcome2: 76, outcome3: 68, outcome4: 82 },
  { country: 'Zambia', outcome2: 64, outcome3: 71, outcome4: 58 },
  { country: 'Mozambique', outcome2: 53, outcome3: 49, outcome4: 61 },
  { country: 'Zimbabwe', outcome2: 70, outcome3: 75, outcome4: 69 },
  { country: 'Angola', outcome2: 46, outcome3: 52, outcome4: 57 },
  { country: 'South Africa', outcome2: 84, outcome3: 80, outcome4: 86 },
]

const yTicks = [0, 25, 50, 75, 100]

const dottedCanvasStyle = {
  backgroundImage: 'radial-gradient(#e4e2e2 2px, transparent 2px)',
  backgroundSize: '40px 40px',
}

function formatCountry(country: string) {
  return country === 'South Africa' ? 'S. Africa' : country
}

function getHeatColor(value: number) {
  if (value >= 80) return '#00170d'
  if (value >= 70) return '#2d6b47'
  if (value >= 60) return '#6ea983'
  if (value >= 50) return '#c6ebd7'
  return '#fed65b'
}

function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-sm text-xs font-semibold text-on-surface-variant">
      <span className="inline-flex items-center gap-xs">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        Actual
      </span>
      <span className="inline-flex items-center gap-xs">
        <span className="h-2.5 w-2.5 rounded-full bg-secondary-container" />
        Target
      </span>
      <span className="inline-flex items-center gap-xs">
        <span className="h-2.5 w-2.5 rounded-full bg-primary-fixed" />
        Approved source
      </span>
    </div>
  )
}

function BarGraph() {
  const chartWidth = 620
  const chartHeight = 300
  const left = 48
  const right = 20
  const top = 24
  const bottom = 54
  const innerWidth = chartWidth - left - right
  const innerHeight = chartHeight - top - bottom
  const slotWidth = innerWidth / chartBars.length
  const barWidth = Math.min(46, slotWidth * 0.48)
  const y = (value: number) => top + innerHeight - (value / 100) * innerHeight

  return (
    <div className="space-y-sm">
      <div className="h-[260px] w-full rounded-lg bg-surface-container-lowest p-sm sm:h-[300px]">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" role="img" aria-label="Country performance bar chart">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={left} x2={chartWidth - right} y1={y(tick)} y2={y(tick)} stroke="#e4e2e2" strokeWidth="1" />
              <text x={left - 12} y={y(tick) + 4} textAnchor="end" className="fill-on-surface-variant text-[11px] font-semibold">
                {tick}
              </text>
            </g>
          ))}
          <line x1={left} x2={left} y1={top} y2={top + innerHeight} stroke="#c1c8c2" />
          <line x1={left} x2={chartWidth - right} y1={top + innerHeight} y2={top + innerHeight} stroke="#c1c8c2" />
          {chartBars.map((bar, index) => {
            const x = left + index * slotWidth + (slotWidth - barWidth) / 2
            const actualY = y(bar.value)
            const targetY = y(bar.target)
            return (
              <g key={bar.country}>
                <line x1={x - 5} x2={x + barWidth + 5} y1={targetY} y2={targetY} stroke="#fed65b" strokeWidth="3" strokeLinecap="round" />
                <rect x={x} y={actualY} width={barWidth} height={top + innerHeight - actualY} rx="5" fill="#00170d" />
                <text x={x + barWidth / 2} y={actualY - 8} textAnchor="middle" className="fill-primary text-[12px] font-bold">
                  {bar.value}%
                </text>
                <text x={x + barWidth / 2} y={top + innerHeight + 20} textAnchor="middle" className="fill-on-surface-variant text-[11px] font-semibold">
                  {formatCountry(bar.country)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <GraphLegend />
    </div>
  )
}

function TrendGraph() {
  const chartWidth = 620
  const chartHeight = 300
  const left = 48
  const right = 24
  const top = 24
  const bottom = 48
  const innerWidth = chartWidth - left - right
  const innerHeight = chartHeight - top - bottom
  const x = (index: number) => left + (index / (trendData.length - 1)) * innerWidth
  const y = (value: number) => top + innerHeight - (value / 100) * innerHeight
  const actualPath = trendData.map((item, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(item.regional)}`).join(' ')
  const targetPath = trendData.map((item, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(item.target)}`).join(' ')

  return (
    <div className="space-y-sm">
      <div className="h-[260px] w-full rounded-lg bg-surface-container-lowest p-sm sm:h-[300px]">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" role="img" aria-label="Regional trend line chart">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={left} x2={chartWidth - right} y1={y(tick)} y2={y(tick)} stroke="#e4e2e2" strokeWidth="1" />
              <text x={left - 12} y={y(tick) + 4} textAnchor="end" className="fill-on-surface-variant text-[11px] font-semibold">
                {tick}
              </text>
            </g>
          ))}
          <line x1={left} x2={left} y1={top} y2={top + innerHeight} stroke="#c1c8c2" />
          <line x1={left} x2={chartWidth - right} y1={top + innerHeight} y2={top + innerHeight} stroke="#c1c8c2" />
          <path d={targetPath} fill="none" stroke="#fed65b" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
          <path d={actualPath} fill="none" stroke="#00170d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {trendData.map((item, index) => (
            <g key={item.year}>
              <circle cx={x(index)} cy={y(item.regional)} r="6" fill="#00170d" stroke="#ffffff" strokeWidth="3" />
              <circle cx={x(index)} cy={y(item.target)} r="4" fill="#fed65b" />
              <text x={x(index)} y={top + innerHeight + 22} textAnchor="middle" className="fill-on-surface-variant text-[12px] font-semibold">
                {item.year}
              </text>
              <text x={x(index)} y={y(item.regional) - 12} textAnchor="middle" className="fill-primary text-[12px] font-bold">
                {item.regional}%
              </text>
            </g>
          ))}
        </svg>
      </div>
      <GraphLegend />
    </div>
  )
}

function HeatMapGraph() {
  const columns = [
    { key: 'outcome2', label: 'Legislation' },
    { key: 'outcome3', label: 'Budgeting' },
    { key: 'outcome4', label: 'Oversight' },
  ] as const

  return (
    <div className="space-y-sm">
      <div className="overflow-x-auto rounded-lg bg-surface-container-lowest p-sm">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[128px_repeat(3,minmax(0,1fr))] gap-xs">
            <div />
            {columns.map((column) => (
              <div key={column.key} className="px-sm py-xs text-center text-xs font-bold uppercase tracking-wide text-on-surface-variant">
                {column.label}
              </div>
            ))}
            {heatMapData.map((row) => (
              <div key={row.country} className="contents">
                <div className="flex items-center rounded-md bg-surface-container-low px-sm py-sm text-sm font-semibold text-primary">
                  {row.country}
                </div>
                {columns.map((column) => {
                  const value = row[column.key]
                  return (
                    <div
                      key={`${row.country}-${column.key}`}
                      className="flex min-h-14 items-center justify-center rounded-md text-sm font-black"
                      style={{
                        backgroundColor: getHeatColor(value),
                        color: value >= 70 ? '#ffffff' : '#00170d',
                      }}
                    >
                      {value}%
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-xs text-xs font-semibold text-on-surface-variant">
        {[40, 50, 60, 70, 80].map((value) => (
          <span key={value} className="inline-flex items-center gap-xs">
            <span className="h-3 w-5 rounded-sm" style={{ backgroundColor: getHeatColor(value) }} />
            {value}+
          </span>
        ))}
      </div>
    </div>
  )
}

function ChartTable({ selectedIndicator }: { selectedIndicator: string }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-surface-container-lowest">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-bold uppercase tracking-wide text-on-surface-variant">
            <th className="px-sm py-sm">Country</th>
            <th className="px-sm py-sm">Actual</th>
            <th className="px-sm py-sm">Target</th>
            <th className="px-sm py-sm">Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-highest text-on-surface">
          {chartBars.map((bar) => {
            const variance = bar.value - bar.target
            return (
              <tr key={bar.country}>
                <td className="px-sm py-sm font-semibold">{bar.country}</td>
                <td className="px-sm py-sm">{bar.value}%</td>
                <td className="px-sm py-sm">{bar.target}%</td>
                <td className="px-sm py-sm">
                  <span className={`rounded-full px-sm py-xs text-xs font-bold ${variance >= 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container'}`}>
                    {variance >= 0 ? '+' : ''}{variance} pts
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
        <caption className="caption-bottom px-sm py-sm text-left text-xs font-semibold text-on-surface-variant">
          {selectedIndicator} by country, compared with approved reporting targets.
        </caption>
      </table>
    </div>
  )
}

function ChartRenderer({ selectedViz, selectedIndicator }: { selectedViz: string; selectedIndicator: string }) {
  if (selectedViz === 'Bar') return <BarGraph />
  if (selectedViz === 'Table') return <ChartTable selectedIndicator={selectedIndicator} />
  if (selectedViz === 'Map') return <HeatMapGraph />
  return <TrendGraph />
}

function PropertiesPanel({
  selectedIndicator,
  selectedSources,
  onClose,
  onIndicatorChange,
  onApply,
}: {
  selectedIndicator: string
  selectedSources: string[]
  onClose: () => void
  onIndicatorChange: (value: string) => void
  onApply: () => void
}) {
  return (
    <aside className="fixed inset-x-container bottom-container top-24 z-50 flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_8px_32px_-8px_rgba(0,23,13,0.16)] xl:static xl:h-auto xl:w-80 xl:shrink-0 xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none">
      <div className="border-b border-outline-variant/30 bg-surface px-md py-md">
        <div className="flex items-center justify-between gap-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-[22px] text-primary">tune</span>
            <h2 className="text-h3 font-semibold text-primary">Properties</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            aria-label="Hide properties"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-md overflow-y-auto p-md">
        <label className="block">
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Selected Block</span>
          <select className="w-full rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-primary outline-none focus:border-primary">
            <option>Chart: {selectedIndicator}</option>
            <option>Report Heading</option>
            <option>Metric: Regional Average</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Chart Title</span>
          <input
            className="w-full rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-primary outline-none focus:border-primary"
            value={selectedIndicator}
            onChange={(event) => onIndicatorChange(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Color Scheme</span>
          <select className="w-full rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-primary outline-none focus:border-primary">
            <option>Forest Green</option>
            <option>Warm Gold</option>
            <option>Neutral</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Data Source</span>
          <select className="w-full rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-primary outline-none focus:border-primary">
            {selectedSources.length > 0 ? (
              selectedSources.map((source) => <option key={source}>{source}</option>)
            ) : (
              <option>No source selected</option>
            )}
          </select>
        </label>

        <label className="block">
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Date Range</span>
          <select className="w-full rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-primary outline-none focus:border-primary">
            <option>2020-2024</option>
            <option>2022-2024</option>
            <option>Last 12 months</option>
          </select>
        </label>

        <div>
          <span className="mb-xs block text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Export Includes</span>
          <div className="space-y-xs">
            {['Filters', 'Narrative', 'Evidence list'].map((item) => (
              <label key={item} className="flex items-center justify-between rounded border border-outline-variant bg-surface-container px-sm py-base">
                <span className="text-body-sm font-semibold text-primary">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 bg-surface p-md">
        <button
          type="button"
          onClick={onApply}
          className="flex w-full items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm text-label-lg font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[18px]">done</span>
          Apply Changes
        </button>
      </div>
    </aside>
  )
}

export default function ReportBuilderPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['Annual SRHR Surveys'])
  const [selectedIndicator, setSelectedIndicator] = useState('Adolescent Birth Rate')
  const [selectedViz, setSelectedViz] = useState('Trend')
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [reportTitle, setReportTitle] = useState('Q3 Regional Performance Overview')
  const [reportSummary, setReportSummary] = useState(
    'Analysis of key reproductive health indicators across sub-Saharan regions, highlighting variations in adolescent birth rates.'
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
    <div className="-m-4 flex min-h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-surface-container-low sm:-m-6 lg:-m-10">
      {propertiesOpen && (
        <button
          type="button"
          aria-label="Close properties overlay"
          onClick={() => setPropertiesOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
        />
      )}

      <section className="shrink-0 border-b border-outline-variant/30 bg-surface p-gutter">
        <div className="flex flex-col gap-md 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex flex-col gap-md xl:flex-row xl:items-center">
            <h1 className="text-h3 font-semibold text-primary">Custom Report Builder</h1>
            <div className="hidden h-8 w-px bg-outline-variant xl:block" />
            <div className="flex flex-wrap items-center gap-sm">
              <select className="rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-on-surface outline-none focus:border-primary focus:ring-0">
                <option>All Countries</option>
                <option>Malawi</option>
                <option>Zambia</option>
                <option>Zimbabwe</option>
              </select>
              <select className="rounded border border-outline-variant bg-surface-container px-sm py-base text-body-sm text-on-surface outline-none focus:border-primary focus:ring-0">
                <option>Q3 2024</option>
                <option>Q2 2024</option>
                <option>Year to Date</option>
              </select>
              <button type="button" className="flex items-center gap-xs rounded border border-outline-variant bg-surface px-sm py-base text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                More Filters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            <button type="button" className="flex items-center gap-xs rounded px-sm py-base text-label-lg font-semibold text-primary transition-colors hover:bg-surface-container">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Preview Report
            </button>
            <button type="button" className="flex items-center gap-xs rounded border border-outline-variant px-sm py-base text-label-lg font-semibold text-primary transition-colors hover:bg-surface-container">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              Schedule Automation
            </button>
            <button
              type="button"
              aria-pressed={propertiesOpen}
              onClick={() => setPropertiesOpen((value) => !value)}
              className={`flex items-center gap-xs rounded border px-sm py-base text-label-lg font-semibold transition-colors ${
                propertiesOpen
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant text-primary hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Properties
            </button>
            <button
              type="button"
              onClick={() => showMessage('Template saved as draft.')}
              className="rounded-lg bg-primary px-md py-base text-label-lg font-semibold text-on-primary transition-colors hover:bg-primary-container"
            >
              Save Template
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className="absolute right-md top-20 z-50 rounded-lg border border-outline-variant bg-primary-fixed px-md py-sm text-body-sm font-semibold text-on-primary-fixed shadow-[0_8px_32px_-8px_rgba(0,23,13,0.16)]">
          {message}
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r border-outline-variant/30 bg-surface lg:flex">
          <div className="border-b border-outline-variant/30">
            <button type="button" className="flex w-full items-center justify-between p-gutter text-left transition-colors hover:bg-surface-container-lowest">
              <span className="text-h3 font-semibold text-primary">Data Sources</span>
              <span className="material-symbols-outlined text-on-surface-variant">expand_less</span>
            </button>
            <div className="flex flex-col gap-sm px-gutter pb-gutter">
              {dataSources.map((source) => {
                const selected = selectedSources.includes(source.name)
                return (
                  <label
                    key={source.name}
                    className="flex cursor-pointer items-start gap-sm rounded border border-outline-variant/50 bg-surface-container-lowest p-sm text-body-sm transition-colors hover:border-primary/50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSource(source.name)}
                      className="mt-[3px] rounded-sm accent-primary"
                    />
                    <span>
                      <span className="block font-semibold text-on-surface">{source.name}</span>
                      <span className="block text-xs text-on-surface-variant">{source.freshness}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="border-b border-outline-variant/30">
            <button type="button" className="flex w-full items-center justify-between p-gutter text-left transition-colors hover:bg-surface-container-lowest">
              <span className="text-h3 font-semibold text-primary">Indicators</span>
              <span className="material-symbols-outlined text-on-surface-variant">expand_less</span>
            </button>
            <div className="px-gutter pb-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
                <input className="w-full rounded border-none bg-surface-container py-base pl-lg pr-sm text-body-sm text-primary outline-none placeholder:text-outline focus:ring-1 focus:ring-primary" placeholder="Search indicators..." type="text" />
              </div>
            </div>
            <div className="flex flex-col gap-xs px-gutter pb-gutter">
              {indicators.map((indicator) => {
                const selected = indicator.name === selectedIndicator
                return (
                  <button
                    key={indicator.name}
                    type="button"
                    onClick={() => setSelectedIndicator(indicator.name)}
                    className={`group flex items-center justify-between rounded p-xs text-left text-body-sm transition-colors ${
                      selected ? 'bg-primary-fixed/20 font-semibold text-primary' : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-sm">
                      <span className={`material-symbols-outlined text-[16px] text-outline ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>drag_indicator</span>
                      <span className="truncate">{indicator.name}</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-primary">{selected ? 'check_circle' : 'add_circle'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <button type="button" className="flex w-full items-center justify-between p-gutter text-left transition-colors hover:bg-surface-container-lowest">
              <span className="text-h3 font-semibold text-primary">Visualizations</span>
              <span className="material-symbols-outlined text-on-surface-variant">expand_less</span>
            </button>
            <div className="grid grid-cols-2 gap-sm px-gutter pb-gutter">
              {vizTypes.map((viz) => {
                const selected = selectedViz === viz.value
                return (
                  <button
                    key={viz.value}
                    type="button"
                    onClick={() => setSelectedViz(viz.value)}
                    className={`aspect-square rounded border bg-surface-container-lowest px-sm text-center transition-all hover:border-primary hover:shadow-sm ${
                      selected ? 'border-primary text-primary' : 'border-outline-variant/50 text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined block text-[32px]">{viz.icon}</span>
                    <span className="mt-xs block text-label-md font-semibold">{viz.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-md sm:p-lg" style={dottedCanvasStyle}>
          <div className="mx-auto flex max-w-5xl flex-col gap-lg">
            <section className="group relative rounded-xl border border-outline-variant/10 bg-surface p-md shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)]">
              <div className="absolute right-sm top-sm flex gap-xs opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                {['edit', 'delete'].map((icon) => (
                  <button key={icon} type="button" className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container" aria-label={icon}>
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  </button>
                ))}
              </div>
              <input
                className="mb-sm w-full border-none bg-transparent p-0 pr-20 text-h2 font-bold text-primary outline-none focus:ring-0"
                value={reportTitle}
                onChange={(event) => setReportTitle(event.target.value)}
              />
              <textarea
                className="h-auto w-full resize-none border-none bg-transparent p-0 text-body-md leading-relaxed text-on-surface-variant outline-none focus:ring-0"
                rows={2}
                value={reportSummary}
                onChange={(event) => setReportSummary(event.target.value)}
              />
            </section>

            <div className="grid grid-cols-12 gap-md">
              <section className="group relative col-span-12 flex min-h-[320px] flex-col rounded-xl border border-outline-variant/10 bg-surface p-md shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)] lg:col-span-8">
                <div className="absolute right-sm top-sm flex gap-xs rounded bg-surface/80 p-xs opacity-100 backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <button type="button" onClick={() => setPropertiesOpen(true)} className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container" aria-label="Chart settings">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container" aria-label="Move chart">
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                </div>
                <h2 className="mb-md max-w-[85%] text-h3 font-semibold text-primary">
                  {selectedIndicator} Trend (2020-2024)
                </h2>
                <div className="min-h-0 flex-1">
                  <ChartRenderer selectedViz={selectedViz} selectedIndicator={selectedIndicator} />
                </div>
              </section>

              <aside className="col-span-12 flex flex-col gap-md sm:grid sm:grid-cols-2 lg:col-span-4 lg:flex">
                <div className="group relative flex min-h-40 flex-col justify-center rounded-xl border border-outline-variant/10 bg-surface p-md shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)]">
                  <button type="button" className="absolute right-sm top-sm flex h-8 w-8 items-center justify-center rounded text-on-surface-variant opacity-100 transition-opacity hover:bg-surface-container sm:opacity-0 sm:group-hover:opacity-100" aria-label="Move metric">
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                  <span className="mb-xs text-body-sm text-on-surface-variant">Regional Average</span>
                  <span className="text-display font-extrabold leading-none text-primary">42.8</span>
                  <span className="mt-sm flex items-center text-label-md font-semibold text-error">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    +2.4% vs last cycle
                  </span>
                </div>

                <div className="group relative flex min-h-40 flex-col justify-center rounded-xl border border-l-4 border-outline-variant/10 border-l-secondary bg-surface p-md shadow-[0_4px_24px_-4px_rgba(0,23,13,0.04)]">
                  <button type="button" className="absolute right-sm top-sm flex h-8 w-8 items-center justify-center rounded text-on-surface-variant opacity-100 transition-opacity hover:bg-surface-container sm:opacity-0 sm:group-hover:opacity-100" aria-label="Move metric">
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                  <span className="mb-xs text-body-sm text-on-surface-variant">Data Completeness</span>
                  <span className="text-display font-extrabold leading-none text-primary">94%</span>
                  <div className="mt-sm h-1 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-secondary" style={{ width: '94%' }} />
                  </div>
                </div>
              </aside>

              <button
                type="button"
                onClick={() => showMessage('Drop zone selected. Choose a component from the sidebar.')}
                className="col-span-12 flex min-h-60 flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed border-primary/20 bg-surface-container-lowest/50 p-xl text-center text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-primary-fixed/5"
              >
                <span className="material-symbols-outlined text-[32px] text-primary">add_box</span>
                <span className="text-body-md font-semibold text-primary">Drag and drop a visualization or indicator here</span>
                <span className="text-body-sm">Use the sidebar to select data components</span>
              </button>
            </div>
          </div>
        </main>

        {propertiesOpen && (
          <PropertiesPanel
            selectedIndicator={selectedIndicator}
            selectedSources={selectedSources}
            onClose={() => setPropertiesOpen(false)}
            onIndicatorChange={setSelectedIndicator}
            onApply={() => showMessage('Properties applied.')}
          />
        )}
      </div>
    </div>
  )
}
