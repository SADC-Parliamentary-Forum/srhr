'use client'

import { useState } from 'react'

interface Resource {
  title: string
  category: string
  type: string
  size: string
  icon: string
}

const resourceSections: { title: string; items: Resource[] }[] = [
  {
    title: 'Policy Frameworks',
    items: [
      { title: 'SADC SRHR Framework 2025', category: 'Policy', type: 'PDF', size: '2.1 MB', icon: 'picture_as_pdf' },
      { title: 'National SRHR Policy Guidelines', category: 'Policy', type: 'PDF', size: '1.4 MB', icon: 'picture_as_pdf' },
      { title: 'Parliamentary Oversight Manual', category: 'Policy', type: 'PDF', size: '3.2 MB', icon: 'gavel' },
      { title: 'SRHR Budget Allocation Guide', category: 'Policy', type: 'PDF', size: '800 KB', icon: 'account_balance' },
    ],
  },
  {
    title: 'Training Materials',
    items: [
      { title: 'Data Collection Methodology', category: 'Training', type: 'PPTX', size: '4.5 MB', icon: 'slideshow' },
      { title: 'M&E Framework Training Kit', category: 'Training', type: 'PPTX', size: '6.2 MB', icon: 'slideshow' },
      { title: 'Community Engagement Guide', category: 'Training', type: 'PDF', size: '1.8 MB', icon: 'groups' },
      { title: 'Evidence Collection Workbook', category: 'Training', type: 'XLSX', size: '540 KB', icon: 'table_chart' },
    ],
  },
  {
    title: 'Research Papers',
    items: [
      { title: 'SRHR Financing in Sub-Saharan Africa', category: 'Research', type: 'PDF', size: '3.8 MB', icon: 'picture_as_pdf' },
      { title: 'Youth Access to SRHR Services', category: 'Research', type: 'PDF', size: '2.1 MB', icon: 'picture_as_pdf' },
      { title: 'Legislative Impact Analysis 2024', category: 'Research', type: 'PDF', size: '5.1 MB', icon: 'science' },
      { title: 'GBV Intervention Outcomes Study', category: 'Research', type: 'PDF', size: '4.3 MB', icon: 'picture_as_pdf' },
    ],
  },
  {
    title: 'Tools & Templates',
    items: [
      { title: 'Indicator Reporting Template', category: 'Tools', type: 'XLSX', size: '210 KB', icon: 'table_chart' },
      { title: 'Evidence Submission Checklist', category: 'Tools', type: 'DOCX', size: '120 KB', icon: 'checklist' },
      { title: 'Budget Tracking Spreadsheet', category: 'Tools', type: 'XLSX', size: '380 KB', icon: 'table_chart' },
      { title: 'Report Builder Quick Guide', category: 'Tools', type: 'PDF', size: '650 KB', icon: 'help' },
    ],
  },
]

const typeColor: Record<string, string> = {
  PDF: 'text-error',
  PPTX: 'text-secondary',
  XLSX: 'text-primary',
  DOCX: 'text-on-surface-variant',
  DOCX2: 'text-primary',
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('')

  const filteredSections = resourceSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0)

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Knowledge Hub</h2>
          <p className="text-on-surface-variant mt-xs">Policy frameworks, training materials, research papers, and tools.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
        <input
          className="w-full pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Featured Banner */}
      <div className="bg-primary rounded-xl p-md flex items-center justify-between gap-md">
        <div>
          <h3 className="text-lg font-bold text-on-primary mb-xs">SADC SRHR Framework 2025 — Updated</h3>
          <p className="text-on-primary/80 text-sm">The latest framework document has been updated with new indicators and reporting requirements for 2025–2027.</p>
        </div>
        <button className="shrink-0 px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 whitespace-nowrap">
          Download Now
        </button>
      </div>

      {/* Resource Sections */}
      {filteredSections.map((section) => (
        <div key={section.title}>
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
            <button className="text-sm text-primary font-semibold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {section.items.map((resource, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className={`material-symbols-outlined text-[20px] ${typeColor[resource.type] ?? 'text-primary'}`}>{resource.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-on-surface leading-snug">{resource.title}</h4>
                  <div className="flex items-center gap-xs mt-xs">
                    <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-xs py-[2px] rounded">{resource.category}</span>
                    <span className="text-xs text-on-surface-variant">{resource.size}</span>
                  </div>
                </div>
                <button className="flex items-center gap-xs text-sm font-semibold text-primary hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download {resource.type}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
