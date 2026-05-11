'use client'

import Link from 'next/link'

const kpis = [
  { label: 'Total Beneficiaries', value: '124k', trend: '+8%', up: true },
  { label: 'Facilities Active', value: '287', trend: '+12%', up: true },
  { label: 'Supplies Distributed', value: '45k', trend: '-3%', up: false },
]

const tableRows = [
  { indicator: 'Maternal Mortality Ratio', baseline: '450', current: '380', target: '300', status: 'On Track' },
  { indicator: 'Contraceptive Prevalence', baseline: '32%', current: '41%', target: '55%', status: 'On Track' },
  { indicator: 'Adolescent Birth Rate', baseline: '68', current: '59', target: '40', status: 'At Risk' },
  { indicator: 'Skilled Birth Attendance', baseline: '72%', current: '85%', target: '90%', status: 'On Track' },
  { indicator: 'HIV Prevalence Youth', baseline: '4.2%', current: '3.8%', target: '2.0%', status: 'On Track' },
  { indicator: 'SRHR Budget Allocation', baseline: '8%', current: '11%', target: '15%', status: 'At Risk' },
  { indicator: 'Legal Frameworks Enacted', baseline: '2', current: '4', target: '6', status: 'On Track' },
  { indicator: 'Community Outreach Events', baseline: '120', current: '198', target: '200', status: 'On Track' },
]

export default function ReportPreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Report Preview: Malawi Q4 2023</h2>
          <p className="text-on-surface-variant mt-xs">ID: {params.id} · Generated May 10, 2026</p>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF
          </button>
          <button className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            Export Excel
          </button>
          <Link href={`/portal/reports/${params.id}/sharing`} className="flex items-center gap-xs px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </Link>
          <button className="flex items-center gap-xs px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit
          </button>
        </div>
      </div>

      {/* Report Canvas */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        {/* Cover Page */}
        <div className="bg-primary p-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-on-primary/10 rounded-full flex items-center justify-center mb-md">
            <span className="material-symbols-outlined text-on-primary text-[32px]">corporate_fare</span>
          </div>
          <h1 className="text-3xl font-black text-on-primary mb-sm">SRHR Portal</h1>
          <h2 className="text-xl font-semibold text-on-primary/80 mb-xs">Malawi Q4 2023 Performance Report</h2>
          <p className="text-on-primary/60 text-sm">SADC Parliamentary Forum · Generated May 2026</p>
        </div>

        <div className="p-lg flex flex-col gap-lg">
          {/* Executive Summary */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-sm">Executive Summary</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              This report presents the Q4 2023 performance data for Malawi&apos;s SRHR programming under the SADC Parliamentary Forum framework. Overall performance shows positive trends across most indicators, with maternal mortality continuing its downward trajectory. Contraceptive prevalence has increased significantly, reflecting improved access to family planning services. However, adolescent birth rates remain a concern and require targeted intervention. Budget allocation for SRHR programmes has increased but remains below the targeted 15%.
            </p>
          </div>

          {/* KPI Cards */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-md">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">{kpi.label}</p>
                  <p className="text-4xl font-black text-primary">{kpi.value}</p>
                  <div className={`flex items-center gap-xs text-sm font-semibold mt-xs ${kpi.up ? 'text-primary' : 'text-error'}`}>
                    <span className="material-symbols-outlined text-[16px]">{kpi.up ? 'trending_up' : 'trending_down'}</span>
                    {kpi.trend} vs Q3
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Placeholder */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-md">Demographic Breakdown</h3>
            <div className="bg-surface-container-low rounded-xl border border-dashed border-outline-variant h-48 flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] text-outline-variant block mb-sm">bar_chart</span>
                <p className="text-sm">Bar Chart: Demographic Breakdown</p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-md">Detailed Indicator Performance</h3>
            <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Indicator</th>
                    <th className="text-right text-xs font-semibold text-on-surface-variant px-md py-sm">Baseline</th>
                    <th className="text-right text-xs font-semibold text-on-surface-variant px-md py-sm">Current</th>
                    <th className="text-right text-xs font-semibold text-on-surface-variant px-md py-sm">Target</th>
                    <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm text-sm text-on-surface font-medium">{row.indicator}</td>
                      <td className="px-md py-sm text-sm text-on-surface-variant text-right">{row.baseline}</td>
                      <td className="px-md py-sm text-sm text-primary font-semibold text-right">{row.current}</td>
                      <td className="px-md py-sm text-sm text-on-surface-variant text-right">{row.target}</td>
                      <td className="px-md py-sm">
                        <span className={`text-xs font-semibold px-sm py-xs rounded-full ${
                          row.status === 'On Track' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
