'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const subTabs = [
  { label: 'Overview', href: '/portal/budget' },
  { label: 'Activities', href: '/portal/budget/activities' },
  { label: 'Countries', href: '/portal/budget/countries' },
  { label: 'No-Spend', href: '/portal/budget/no-spend' },
  { label: 'Variance', href: '/portal/budget/variance' },
  { label: 'Reconciliation', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', href: '/portal/budget/priority-actions' },
]

export default function BudgetSubnav({ showAiInsights = true }: { showAiInsights?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="border-b border-outline-variant flex gap-xs flex-wrap items-center">
      {subTabs.map((tab) => {
        const active = tab.href === '/portal/budget' ? pathname === tab.href : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-md py-sm text-sm font-semibold whitespace-nowrap transition-colors shrink-0 border-b-2 ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}

      {showAiInsights ? (
        <Link
          href="/portal/budget/ai-insights"
          className={`ml-auto inline-flex items-center gap-xs px-sm py-xs rounded-full text-sm font-semibold transition-colors ${
            pathname.startsWith('/portal/budget/ai-insights')
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          AI Insights
        </Link>
      ) : null}
    </div>
  )
}
