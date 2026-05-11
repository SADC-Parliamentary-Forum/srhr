'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type ResourceItem = {
  title: string
  type: string
  country?: string
  date?: string
  description?: string
  href?: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    let mounted = true
    api.get<{ data?: ResourceItem[] }>('/public/resources')
      .then((data) => {
        if (!mounted) return
        setResources(Array.isArray(data.data) ? data.data : [])
      })
      .catch(() => {
        if (!mounted) return
        setResources([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const types = ['All', ...Array.from(new Set(resources.map((item) => item.type).filter(Boolean)))]
  const filtered = resources.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || (item.description ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'All' || item.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <section className="bg-[#efeded] border-b border-[#c1c8c2]/20">
        <div className="max-w-[1440px] mx-auto px-5 py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b2d20] text-[#abcfbb] mb-4">
            <span className="material-symbols-outlined text-sm">folder_open</span>
            <span className="text-[12px] font-semibold tracking-wider uppercase">Resources</span>
          </div>
          <h1 className="text-[32px] font-bold text-[#00170d]">Resources Library</h1>
          <p className="mt-2 text-[16px] text-[#414844] max-w-3xl">
            Guidance documents, manuals, templates, and reference material for SRHR reporting and analysis.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-grow relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727974]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c1c8c2] rounded focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none text-[16px] text-[#1b1c1c]"
              placeholder="Search resources..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2.5 bg-white border border-[#c1c8c2] rounded text-[14px] text-[#1b1c1c] outline-none focus:border-[#00170d] min-w-[180px]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#c1c8c2] bg-white p-8 text-[#414844]">
            Loading resources...
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <article key={`${item.title}-${item.type}`} className="rounded-xl border border-[#c1c8c2] bg-white p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-[#00170d] leading-snug">{item.title}</h2>
                  <span className="shrink-0 rounded-full bg-[#ffe088] text-[#574500] px-3 py-1 text-xs font-semibold">{item.type}</span>
                </div>
                {item.description && <p className="text-sm text-[#414844] leading-relaxed">{item.description}</p>}
                <div className="flex items-center justify-between gap-3 text-xs text-[#727974]">
                  <span>{item.country ?? 'Regional'}</span>
                  <span>{item.date ?? 'Published'}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <button className="rounded-full bg-[#00170d] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                    Open
                  </button>
                  {item.href && (
                    <a className="text-sm font-semibold text-[#745c00] hover:text-[#00170d] transition-colors" href={item.href}>
                      Download
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#c1c8c2] bg-white p-8 text-center text-[#414844]">
            <span className="material-symbols-outlined text-[40px] text-[#c1c8c2] block mb-3">search_off</span>
            No resources are available yet.
          </div>
        )}
      </div>
    </div>
  )
}
