'use client'

import Link from 'next/link'

const recentSubmissions = [
  { type: 'Indicators', country: 'Malawi', period: 'Q1 2026', status: 'Validated', statusColor: 'bg-primary-fixed text-on-primary-fixed', submittedBy: 'Ronald W.', date: 'May 8, 2026' },
  { type: 'Evidence', country: 'Kenya', period: 'Mar 2026', status: 'Pending', statusColor: 'bg-secondary-fixed text-on-secondary-fixed-variant', submittedBy: 'Jane M.', date: 'May 7, 2026' },
  { type: 'Indicators', country: 'Tanzania', period: 'Q4 2025', status: 'Rejected', statusColor: 'bg-error-container text-on-error-container', submittedBy: 'Amos K.', date: 'May 5, 2026' },
  { type: 'Evidence', country: 'Uganda', period: 'Apr 2026', status: 'Validated', statusColor: 'bg-primary-fixed text-on-primary-fixed', submittedBy: 'Sarah M.', date: 'May 3, 2026' },
  { type: 'Indicators', country: 'Zambia', period: 'Q1 2026', status: 'Pending', statusColor: 'bg-secondary-fixed text-on-secondary-fixed-variant', submittedBy: 'Bongani N.', date: 'May 1, 2026' },
  { type: 'Evidence', country: 'Mozambique', period: 'Mar 2026', status: 'Validated', statusColor: 'bg-primary-fixed text-on-primary-fixed', submittedBy: 'Fatima D.', date: 'Apr 29, 2026' },
]

export default function DataCapturePage() {
  return (
    <div className="flex flex-col gap-lg max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-primary">Data Capture</h2>
        <p className="text-on-surface-variant mt-xs">Guided reporting and information entry for SRHR indicators and evidence.</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {/* Primary: Upload Indicators */}
        <div className="md:col-span-2 bg-primary rounded-xl p-md shadow-sm border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
          <div className="absolute -right-xl -top-xl w-64 h-64 bg-primary-container rounded-full opacity-20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-md">
              <div className="w-12 h-12 rounded-full bg-on-primary/10 border border-on-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[28px]">upload_file</span>
              </div>
              <span className="text-xs font-semibold bg-secondary-container/20 text-secondary-fixed px-sm py-xs rounded-full">Priority Action</span>
            </div>
            <h3 className="text-lg font-semibold text-on-primary mb-xs">Upload Reporting Indicators</h3>
            <p className="text-on-primary/80 text-sm">Submit your core quarterly or annual reporting indicators for processing and analysis.</p>
          </div>
          <div className="relative z-10 mt-lg">
            <Link
              href="/portal/data-capture/indicators/type"
              className="inline-flex items-center gap-xs bg-secondary text-on-secondary px-lg py-sm rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start Upload
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Secondary: Start Monthly Report */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Start Monthly Report</h4>
            <p className="text-sm text-on-surface-variant">Compile and submit standard monthly progress updates.</p>
          </div>
          <Link href="/portal/reports" className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm border border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors">
            Continue Draft
          </Link>
        </div>

        {/* Upload Evidence */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Upload Evidence</h4>
            <p className="text-sm text-on-surface-variant">Attach supporting documents, photos, and research to your reports.</p>
          </div>
          <Link href="/portal/data-capture/evidence" className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm bg-transparent text-primary rounded-full text-sm font-semibold hover:bg-surface-container transition-colors">
            Upload Evidence
          </Link>
        </div>

        {/* Add Activity */}
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 hover:shadow-md transition-all flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-on-surface mb-xs">Add Activity</h4>
            <p className="text-sm text-on-surface-variant">Log new organizational activities or field events.</p>
          </div>
          <button className="mt-lg w-full flex justify-center items-center gap-xs px-md py-sm bg-transparent text-primary rounded-full text-sm font-semibold hover:bg-surface-container transition-colors">
            Log Activity
          </button>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant/20">
          <h3 className="text-base font-semibold text-primary">Recent Submissions</h3>
          <button className="text-sm text-primary font-semibold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Type</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Country</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Period</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Status</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Submitted By</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Date</th>
                <th className="text-left text-xs font-semibold text-on-surface-variant px-md py-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((row, i) => (
                <tr key={i} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${row.type === 'Indicators' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-md py-sm text-sm text-on-surface">{row.country}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{row.period}</td>
                  <td className="px-md py-sm">
                    <span className={`text-xs font-semibold px-sm py-xs rounded-full ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{row.submittedBy}</td>
                  <td className="px-md py-sm text-sm text-on-surface-variant">{row.date}</td>
                  <td className="px-md py-sm">
                    <button className="text-primary text-sm font-semibold hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
