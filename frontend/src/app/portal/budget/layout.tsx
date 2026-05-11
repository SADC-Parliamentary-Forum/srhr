'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/auth'

const navItems = [
  { label: 'Overview', icon: 'dashboard', href: '/portal/budget' },
  { label: 'Activities', icon: 'bar_chart', href: '/portal/budget/activities' },
  { label: 'Countries', icon: 'public', href: '/portal/budget/countries' },
  { label: 'No-Spend', icon: 'money_off', href: '/portal/budget/no-spend' },
  { label: 'Variance', icon: 'difference', href: '/portal/budget/variance' },
  { label: 'Reconciliation', icon: 'fact_check', href: '/portal/budget/reconciliation' },
  { label: 'Priority Actions', icon: 'priority_high', href: '/portal/budget/priority-actions' },
  { label: 'AI Insights', icon: 'lightbulb', href: '/portal/budget/ai-insights' },
]

function isNavActive(pathname: string, href: string): boolean {
  if (href === '/portal/budget') return pathname === href
  return pathname.startsWith(href)
}

function BudgetSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <aside className={`flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-outline-variant z-30 transition-transform duration-300 ease-in-out ${
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Logo area */}
      <div className="px-md py-sm flex items-center gap-sm border-b border-outline-variant/40 shrink-0">
        <Image src="/sadc-pf-logo.jpg" alt="SADC PF" width={40} height={40} className="object-contain shrink-0" unoptimized />
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold text-primary tracking-wide leading-tight">SADC PF</p>
          <p className="text-[10px] font-semibold text-on-surface-variant tracking-wide leading-tight">Budget Analysis</p>
        </div>
      </div>

      {/* New Analysis button */}
      <div className="px-md pb-md shrink-0">
        <button className="w-full flex items-center justify-center gap-xs bg-primary text-on-primary rounded-full py-sm px-md text-sm font-semibold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Analysis
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-sm flex flex-col gap-xs overflow-y-auto py-xs">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all duration-200 text-sm font-medium ${
                active
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Settings link */}
      <div className="px-sm pb-lg shrink-0">
        <Link
          href="/portal/admin/configuration"
          className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Settings
        </Link>
      </div>
    </aside>
  )
}

function BudgetTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-outline-variant h-16 flex items-center px-md gap-md">
      {/* Left */}
      <div className="flex items-center gap-md flex-1 min-w-0">
        <button
          className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors shrink-0"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h2 className="hidden md:block text-title-lg font-extrabold text-primary whitespace-nowrap shrink-0">
          Budget Analysis
        </h2>
        <div className="flex items-center gap-sm bg-surface-container-low rounded-full px-md py-sm flex-1 max-w-xs">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none flex-1 min-w-0"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-sm shrink-0">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">help_outline</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]">account_circle</span>
        </button>
      </div>
    </header>
  )
}

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    }
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <BudgetSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 md:ml-64 min-w-0">
        <BudgetTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
