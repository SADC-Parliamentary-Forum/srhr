'use client'

import { useState } from 'react'
import BudgetSubnav from '../_components/BudgetSubnav'

interface Prompt {
  icon: string
  label: string
  description: string
  filled?: boolean
  highlight?: boolean
}

const prompts: Prompt[] = [
  {
    icon: 'pie_chart',
    label: 'Summarise Utilisation',
    description: 'Generate a high-level summary of current spend vs. allocated budget.',
  },
  {
    icon: 'trending_down',
    label: 'Explain Variance',
    description: 'Identify key drivers behind current budget deviations.',
  },
  {
    icon: 'description',
    label: 'Draft Finance Report',
    description: 'Create a comprehensive narrative for the upcoming committee review.',
    filled: true,
    highlight: true,
  },
  {
    icon: 'assignment_turned_in',
    label: 'Recommend Follow-ups',
    description: 'List actionable next steps for flagged budget items.',
  },
]

const draftedNarrative = `Based on the current financial data, here is a draft summary for the monthly review:

Overall budget health is stable, however, critical attention is required regarding activity implementation. Only 13.1% of the National Activities budget has been utilised to date, which falls significantly below the Q2 target threshold.

Furthermore, immediate follow-up is required for designated no-spend countries. Specifically, regions alpha and delta have reported zero financial activity against allocated community grants for the past two consecutive periods.

It is recommended that country directors provide a status update by Friday to clarify operational bottlenecks before the next fund disbursement cycle.`

export default function AiInsightsPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(2)

  return (
    <div>
      <div className="mb-xl">
        <h1 className="text-h1 font-h1 text-on-background mb-xs">AI Insights</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Intelligent analysis and actionable recommendations based on current budget data.
        </p>
      </div>

      <div className="mb-lg">
        <BudgetSubnav />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left Column: Prompts */}
        <div className="lg:col-span-4 flex flex-col gap-sm">
          <h2 className="text-h3 font-h3 text-on-background mb-xs">Suggested Actions</h2>

          {prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrompt(i)}
              className={`flex flex-col items-start p-md rounded-xl border text-left shadow-sm shadow-primary/5 transition-all ${
                prompt.highlight
                  ? 'bg-secondary-container border-secondary/20 relative overflow-hidden group'
                  : selectedPrompt === i
                  ? 'bg-surface-container-high border-outline-variant'
                  : 'bg-surface-container border-transparent hover:border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              {prompt.highlight && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              )}
              <div className="flex items-center gap-sm mb-xs relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  prompt.highlight
                    ? 'bg-on-secondary-container/10 text-on-secondary-container'
                    : 'bg-primary-container/20 text-primary'
                }`}>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={prompt.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {prompt.icon}
                  </span>
                </div>
                <span className={`text-label-lg font-label-lg ${prompt.highlight ? 'text-on-secondary-container' : 'text-on-background'}`}>
                  {prompt.label}
                </span>
              </div>
              <p className={`text-body-sm font-body-sm pl-10 relative z-10 ${
                prompt.highlight ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'
              }`}>
                {prompt.description}
              </p>
            </button>
          ))}
        </div>

        {/* Right Column: AI Output Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-surface rounded-xl border border-outline-variant shadow-sm shadow-primary/5 flex flex-col overflow-hidden" style={{ minHeight: '480px' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center gap-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <h3 className="text-h3 font-h3 text-on-background">Drafted Narrative</h3>
              </div>
              <span className="px-sm py-xs bg-surface-container-high text-on-surface-variant rounded-full text-label-md font-label-md flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                Generated Just Now
              </span>
            </div>

            {/* Content */}
            <div className="p-md flex-1 bg-surface-bright text-body-lg font-body-lg text-on-background leading-relaxed overflow-y-auto">
              <p className="mb-sm">Based on the current financial data, here is a draft summary for the monthly review:</p>
              <div className="bg-surface-container p-md rounded-lg border-l-4 border-primary space-y-sm">
                <p>
                  "Overall budget health is stable, however, critical attention is required regarding activity implementation.
                  Only <strong>13.1%</strong> of the National Activities budget has been utilised to date, which falls
                  significantly below the Q2 target threshold.
                </p>
                <p>
                  Furthermore, immediate follow-up is required for designated <strong>no-spend countries</strong>. Specifically,
                  regions alpha and delta have reported zero financial activity against allocated community grants for the past two
                  consecutive periods.
                </p>
                <p>
                  It is recommended that country directors provide a status update by Friday to clarify operational bottlenecks
                  before the next fund disbursement cycle."
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-sm flex-wrap">
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-xs px-md py-sm bg-surface-container hover:bg-surface-container-high text-on-surface text-label-lg font-label-lg rounded-full border border-outline-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  Regenerate
                </button>
                <button className="flex items-center gap-xs px-md py-sm bg-surface-container hover:bg-surface-container-high text-on-surface text-label-lg font-label-lg rounded-full border border-outline-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  Refine with more data
                </button>
              </div>
              <button className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary text-label-lg font-label-lg rounded-full hover:opacity-90 transition-opacity shadow-sm">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                Copy to Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
