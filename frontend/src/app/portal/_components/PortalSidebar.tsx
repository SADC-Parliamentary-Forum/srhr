'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/portal/dashboard' },
  { label: 'Reports Workspace', icon: 'work', href: '/portal/reports' },
  { label: 'Data Capture', icon: 'edit_note', href: '/portal/data-capture' },
  { label: 'Analysis', icon: 'analytics', href: '/portal/analysis' },
  { label: 'Library', icon: 'library_books', href: '/portal/library/evidence' },
  { label: 'Budget Analysis', icon: 'account_balance', href: '/portal/budget' },
  { label: 'Administration', icon: 'settings', href: '/portal/admin/users' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/portal/dashboard') return pathname === href
  if (href === '/portal/library/evidence') return pathname.startsWith('/portal/library')
  if (href === '/portal/admin/users') return pathname.startsWith('/portal/admin')
  return pathname.startsWith(href)
}

export default function PortalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-surface h-screen w-64 border-r border-outline-variant flex flex-col sticky top-0 shrink-0">
      {/* Logo */}
      <Link href="/portal/dashboard" className="px-md py-sm flex items-center gap-sm border-b border-outline-variant/40 hover:bg-surface-container-low transition-colors">
        <Image
          src="/sadc-pf-logo.jpg"
          alt="SADC PF Logo"
          width={40}
          height={40}
          className="object-contain shrink-0"
          unoptimized
        />
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold text-primary tracking-wide leading-tight">SADC PF</p>
          <p className="text-[10px] font-semibold text-on-surface-variant tracking-wide leading-tight">SRHR Portal</p>
        </div>
      </Link>

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
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span className="text-sm font-semibold truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-md border-t border-outline-variant/40">
        <button className="w-full py-sm px-md rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          Focus Mode
        </button>
      </div>
    </aside>
  )
}
