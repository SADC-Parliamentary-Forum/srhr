'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ReportDetail {
  id: number
  title: string
  type: string
  summary: string | null
  country: string | null
  period: string | null
  published_at: string | null
  download_url: string | null
}

export default function PublicReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [report, setReport] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadReport() {
      try {
        const resolved = await params
        const response = await fetch(`/api/public/reports/${resolved.id}`, {
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Unable to load report.')
        }

        const data = await response.json()
        if (!cancelled) {
          setReport(data)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load this report.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      cancelled = true
    }
  }, [params])

  if (loading) {
    return (
      <div className="bg-[#fbf9f8] min-h-screen">
        <div className="max-w-[960px] mx-auto px-5 py-16 flex justify-center">
          <span className="material-symbols-outlined text-[40px] animate-spin text-[#00170d]">progress_activity</span>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="bg-[#fbf9f8] min-h-screen">
        <div className="max-w-[960px] mx-auto px-5 py-16">
          <p className="text-[#93000a] text-sm">{error ?? 'Report not found.'}</p>
          <Link href="/reports" className="inline-flex mt-6 px-4 py-2 rounded border border-[#00170d] text-[#00170d] text-sm font-semibold hover:bg-[#f5f3f3]">
            Back to Reports
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-[960px] mx-auto px-5 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/reports" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00170d] hover:text-[#446555]">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Reports
          </Link>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#c6ebd7] text-[#002115]">{report.type}</span>
            <span className="text-[12px] font-semibold bg-[#efeded] text-[#414844] px-3 py-1 rounded-full border border-[#c1c8c2]/30">{report.country ?? 'Regional'}</span>
            {report.period ? (
              <span className="text-[12px] font-semibold bg-white text-[#414844] px-3 py-1 rounded-full border border-[#c1c8c2]/30">{report.period}</span>
            ) : null}
          </div>
          <h1 className="text-[34px] font-bold text-[#00170d]">{report.title}</h1>
          <p className="text-[14px] text-[#414844]">
            Published: {report.published_at ?? 'N/A'}
          </p>
        </div>

        <article className="bg-white rounded-2xl border border-[#c1c8c2]/20 p-8 shadow-sm">
          <h2 className="text-[18px] font-semibold text-[#00170d] mb-4">Report Summary</h2>
          <p className="text-[16px] leading-8 text-[#414844] whitespace-pre-line">
            {report.summary?.trim() || 'No public summary is available for this report yet.'}
          </p>
        </article>

        <div className="flex flex-wrap gap-3">
          {report.download_url ? (
            <a
              href={report.download_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#00170d] text-white text-sm font-semibold hover:bg-[#446555] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download PDF
            </a>
          ) : null}
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-5 py-3 rounded border border-[#00170d] text-[#00170d] text-sm font-semibold hover:bg-[#f5f3f3] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Browse More Reports
          </Link>
        </div>
      </div>
    </div>
  )
}
