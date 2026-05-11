'use client'

import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { label: 'Visual Explorer', href: '/portal/analysis' },
  { label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { label: 'AI Insights', href: '/portal/analysis/ai-insights' },
]

interface InsightCategory {
  id: string
  label: string
  unread: number
}

const categories: InsightCategory[] = [
  { id: 'anomalies', label: 'Data Anomalies', unread: 3 },
  { id: 'predictions', label: 'Trend Predictions', unread: 2 },
  { id: 'gaps', label: 'Gap Analysis', unread: 1 },
  { id: 'recommendations', label: 'Recommendations', unread: 4 },
]

interface Insight {
  title: string
  category: string
  confidence: number
  explanation: string
  indicators: string[]
}

const insights: Record<string, Insight[]> = {
  anomalies: [
    { title: 'Malawi O4.1 deviation detected', category: 'anomalies', confidence: 92, explanation: 'Youth access figures for Malawi Q1 2026 show a 34% deviation from the 3-year historical average. This may indicate data entry error or a genuine shift in service delivery patterns.', indicators: ['O4.1 — Youth Access', 'O4.2 — Youth Clinics'] },
    { title: 'Tanzania evidence gap — March 2026', category: 'anomalies', confidence: 88, explanation: 'Tanzania submitted indicator data for March 2026 but has no linked evidence documents. This violates the minimum evidence requirement for validated submissions.', indicators: ['O3.1 — Budget Allocation'] },
  ],
  predictions: [
    { title: 'Malawi maternal mortality trajectory', category: 'predictions', confidence: 78, explanation: 'Based on current trends, Malawi is projected to achieve its 2027 maternal mortality target ahead of schedule — by Q3 2026 at current pace.', indicators: ['O2.1 — Maternal Mortality Ratio'] },
  ],
  gaps: [
    { title: 'Missing youth data — 4 countries', category: 'gaps', confidence: 95, explanation: 'Angola, Mozambique, Eswatini, and Lesotho have not submitted O4 (Youth Access) indicators for Q1 2026. This creates gaps in the regional analysis.', indicators: ['O4.1', 'O4.2', 'O4.3'] },
  ],
  recommendations: [
    { title: 'Prioritize Zambia budget reporting', category: 'recommendations', confidence: 85, explanation: 'Zambia has submitted budget allocation figures below the SADC minimum threshold for 3 consecutive quarters. Immediate follow-up and technical support recommended.', indicators: ['O3.1 — Budget Allocation', 'O3.2 — Fund Disbursement'] },
    { title: 'Strengthen Kenya evidence linking', category: 'recommendations', confidence: 82, explanation: 'Kenya has excellent indicator data but only 60% of submissions have linked evidence. Recommend evidence linking training for the Kenya focal person.', indicators: ['Evidence Quality'] },
  ],
}

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
}

const initialMessages: ChatMessage[] = [
  { role: 'ai', text: 'Hello! I\'ve analysed the latest SRHR data for the region. I\'ve identified 10 insights across data quality, trends, and recommendations. What would you like to explore?' },
  { role: 'user', text: 'Which countries are at most risk of missing their Q2 targets?' },
  { role: 'ai', text: 'Based on current trajectory, Tanzania and Uganda are at highest risk of missing Q2 2026 targets. Tanzania shows declining youth access (-2%) and Uganda has a 38% evidence gap. I recommend scheduling review calls with both focal points this week.' },
]

export default function AIInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('anomalies')
  const [selectedInsight, setSelectedInsight] = useState<Insight>(insights.anomalies[0])
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: input }, { role: 'ai', text: 'I\'m analysing that question based on the available data. Please allow a moment...' }])
    setInput('')
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary text-[28px]">auto_awesome</span>
          <div>
            <h2 className="text-3xl font-bold text-primary">AI Insights</h2>
            <p className="text-on-surface-variant text-sm">Powered by AI analysis of SRHR data patterns</p>
          </div>
        </div>
        <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">description</span>
          Generate Report
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-outline-variant flex gap-lg text-sm font-semibold">
        {TABS.map((tab) => (
          <Link key={tab.label} href={tab.href} className={`pb-sm border-b-2 transition-colors whitespace-nowrap ${tab.href === '/portal/analysis/ai-insights' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left: Category List */}
        <div className="lg:col-span-3 flex flex-col gap-sm">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedInsight(insights[cat.id]?.[0]) }}
              className={`flex items-center justify-between p-sm rounded-lg text-left transition-colors ${selectedCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface hover:bg-surface-container-low'}`}
            >
              <span className="text-sm font-semibold">{cat.label}</span>
              {cat.unread > 0 && (
                <span className={`text-xs font-bold px-xs py-[2px] rounded-full ${selectedCategory === cat.id ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                  {cat.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Center: Insight Detail */}
        <div className="lg:col-span-5">
          {insights[selectedCategory]?.map((insight, i) => (
            <div
              key={i}
              onClick={() => setSelectedInsight(insight)}
              className={`rounded-xl border p-md mb-md cursor-pointer transition-all ${selectedInsight?.title === insight.title ? 'border-primary shadow-md' : 'border-outline-variant/20 bg-surface-container-lowest hover:shadow-sm'}`}
            >
              <div className="flex items-start justify-between mb-sm">
                <h3 className="text-sm font-bold text-primary leading-snug">{insight.title}</h3>
                <span className="text-xs font-semibold bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-full ml-sm shrink-0">
                  {insight.confidence}% High
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-sm">{insight.explanation}</p>
              <div className="flex flex-wrap gap-xs mb-sm">
                {insight.indicators.map((ind) => (
                  <span key={ind} className="text-xs bg-surface-container text-on-surface-variant px-xs py-[2px] rounded">{ind}</span>
                ))}
              </div>
              {selectedInsight?.title === insight.title && (
                <button className="w-full mt-sm px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90">
                  Take Action
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right: AI Chat */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm flex flex-col overflow-hidden">
          <div className="p-md border-b border-outline-variant/20 flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">chat</span>
            <h3 className="text-sm font-semibold text-primary">Ask AI</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-sm py-xs max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-md border-t border-outline-variant/20 flex gap-sm">
            <input
              className="flex-1 bg-surface-container border border-outline-variant rounded-full px-sm py-xs text-sm outline-none focus:border-primary"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="text-primary hover:text-secondary transition-colors p-xs">
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
