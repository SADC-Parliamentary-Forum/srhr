'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/portal/dashboard' },
  { label: 'Reports Workspace', icon: 'work', href: '/portal/reports' },
  { label: 'Data Capture', icon: 'edit_note', href: '/portal/data-capture' },
  { label: 'Analysis', icon: 'analytics', href: '/portal/analysis' },
  { label: 'Library', icon: 'library_books', href: '/portal/library' },
  { label: 'Budget Analysis', icon: 'account_balance', href: '/portal/budget' },
  { label: 'Administration', icon: 'settings', href: '/portal/admin' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/portal/dashboard') return pathname === href
  return pathname.startsWith(href)
}

export default function PortalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-surface h-screen w-64 border-r border-outline-variant flex flex-col sticky top-0 shrink-0">
      <div className="p-lg flex items-center gap-sm">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary text-2xl">corporate_fare</span>
        </div>
        <div>
          <h1 className="text-h2 font-black text-primary">SRHR Portal</h1>
          <p className="text-xs text-on-surface-variant">Secure Reporting</p>
        </div>
      </div>

      <nav className="flex-1 px-sm py-md flex flex-col gap-xs overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-surface-container-low text-primary font-bold border-r-4 border-secondary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-lg">
        <button className="w-full py-sm px-md rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          Focus Mode
        </button>
      </div>
    </aside>
  )
}
