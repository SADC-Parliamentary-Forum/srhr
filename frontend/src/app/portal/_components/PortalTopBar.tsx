'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { clearToken } from '@/lib/auth'

const centerLinks = [
  { label: 'Reports', href: '/portal/reports' },
  { label: 'Data', href: '/portal/data-capture' },
  { label: 'Library', href: '/portal/library/evidence' },
]

const profileMenuItems = [
  { label: 'My Profile', icon: 'person', href: '/portal/admin/configuration' },
  { label: 'Settings', icon: 'settings', href: '/portal/admin/configuration' },
  { label: 'Help & Support', icon: 'help', href: '#' },
]

const deadlines = [
  { report: 'April 2026 Monthly Report', due: 'Due 15 May 2026', status: 'Open' },
  { report: 'Q2 2026 Review Pack', due: 'Due 30 Jun 2026', status: 'Upcoming' },
  { report: 'Year 3 Annual Report', due: 'Due 31 Jul 2026', status: 'Upcoming' },
]

export default function PortalTopBar({
  focusMode = false,
  onToggleFocusMode,
}: {
  focusMode?: boolean
  onToggleFocusMode?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false)
      }
    }

    if (profileOpen || calendarOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen, calendarOpen])

  function handleLogout() {
    clearToken()
    router.replace('/login')
  }

  return (
    <header className="bg-surface shadow-sm flex items-center px-gutter h-14 w-full sticky top-0 z-50 border-b border-outline-variant gap-md">
      <Link href="/portal/dashboard" className="md:hidden flex items-center gap-sm shrink-0">
        <Image src="/sadc-pf-logo.jpg" alt="SADC PF" width={32} height={32} className="object-contain" unoptimized />
      </Link>

      <nav className="hidden sm:flex items-center gap-md flex-1">
        {centerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold py-sm transition-colors whitespace-nowrap ${
              pathname.startsWith(link.href)
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-sm ml-auto">
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-sm py-xs border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-32 lg:w-40 text-on-surface placeholder:text-on-surface-variant ml-xs"
            placeholder="Search..."
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="relative hidden sm:block" ref={calendarRef}>
          <button
            aria-label="Calendar"
            aria-expanded={calendarOpen}
            onClick={() => setCalendarOpen((value) => !value)}
            className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>

          {calendarOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-[#c1c8c2] z-50 overflow-hidden">
              <div className="px-md py-sm border-b border-[#c1c8c2] bg-[#f5f3f3] flex items-center justify-between gap-sm">
                <p className="text-sm font-bold text-[#00170d]">Reporting Calendar</p>
                <span className="text-xs font-semibold text-[#745c00]">Quick access</span>
              </div>
              <div className="p-md space-y-md">
                <div className="rounded-lg border border-[#c1c8c2] bg-[#f9f8f5] p-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#414844]">Current period</p>
                  <p className="mt-1 text-sm font-semibold text-[#00170d]">April 2026</p>
                  <p className="text-xs text-[#414844]">Use the selector in the header to switch reporting periods.</p>
                </div>
                <div className="space-y-xs">
                  {deadlines.map((item) => (
                    <div key={item.report} className="rounded-lg border border-[#c1c8c2] px-sm py-sm">
                      <div className="flex items-start justify-between gap-sm">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1b1c1c]">{item.report}</p>
                          <p className="text-xs text-[#414844]">{item.due}</p>
                        </div>
                        <span className="rounded-full bg-[#fed65b] px-xs py-[2px] text-[10px] font-bold text-[#745c00]">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-xs">
                  <Link href="/portal/reports" className="rounded-lg border border-[#c1c8c2] px-sm py-sm text-sm font-semibold text-[#00170d] hover:bg-[#f5f3f3] transition-colors">
                    Open Reports Workspace
                  </Link>
                  <Link href="/portal/data-capture" className="rounded-lg border border-[#c1c8c2] px-sm py-sm text-sm font-semibold text-[#00170d] hover:bg-[#f5f3f3] transition-colors">
                    Open Data Capture
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-sm border-l border-outline-variant pl-sm">
          {focusMode && onToggleFocusMode ? (
            <button
              onClick={onToggleFocusMode}
              className="text-xs font-semibold text-primary border border-primary rounded-full px-sm py-xs hover:bg-primary-fixed transition-colors whitespace-nowrap"
            >
              Exit Focus Mode
            </button>
          ) : null}
          <Link
            href="/portal/analysis/ai-insights"
            className="text-xs font-semibold text-primary border border-primary rounded-full px-sm py-xs hover:bg-primary-fixed transition-colors whitespace-nowrap"
          >
            AI Assistant
          </Link>
          <Link
            href="/portal/data-capture"
            className="hidden lg:block text-xs font-semibold bg-secondary-container text-on-secondary-container rounded-full px-sm py-xs hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Add Data
          </Link>
        </div>

        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((value) => !value)}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            className="w-8 h-8 rounded-full bg-[#00170d] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-[#fed65b] transition-all"
          >
            SR
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-lg border border-[#c1c8c2] z-50 overflow-hidden">
              <div className="px-md py-sm border-b border-[#c1c8c2] bg-[#f5f3f3]">
                <p className="text-xs font-bold text-[#00170d]">Ronald Windwaai</p>
                <p className="text-xs text-[#414844] truncate">ronaldwindwaai@gmail.com</p>
              </div>
              <div className="py-xs">
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-sm px-md py-sm text-sm text-[#414844] hover:bg-[#f5f3f3] hover:text-[#00170d] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-[#c1c8c2] py-xs">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-sm px-md py-sm text-sm text-[#93000a] hover:bg-[#ffdad6] transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
