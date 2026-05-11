'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const centerLinks = [
  { label: 'Reports', href: '/portal/reports' },
  { label: 'Data', href: '/portal/data-capture' },
  { label: 'Library', href: '/portal/library' },
]

export default function PortalTopBar() {
  const pathname = usePathname()
  const [search, setSearch] = useState('')

  return (
    <header className="bg-surface shadow-sm flex items-center px-gutter h-14 w-full sticky top-0 z-50 border-b border-outline-variant gap-md">
      {/* Logo — visible on mobile when sidebar is hidden */}
      <Link href="/portal/dashboard" className="md:hidden flex items-center gap-sm shrink-0">
        <Image src="/sadc-pf-logo.jpg" alt="SADC PF" width={32} height={32} className="object-contain" />
      </Link>

      {/* Center nav links */}
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

      {/* Right side */}
      <div className="flex items-center gap-sm ml-auto">
        {/* Search — hide on very small screens */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-sm py-xs border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-32 lg:w-40 text-on-surface placeholder:text-on-surface-variant ml-xs"
            placeholder="Search..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-xs">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors p-xs">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-sm border-l border-outline-variant pl-sm">
          <button className="text-xs font-semibold text-primary border border-primary rounded-full px-sm py-xs hover:bg-primary-fixed transition-colors whitespace-nowrap">
            AI Assistant
          </button>
          <Link
            href="/portal/data-capture"
            className="hidden lg:block text-xs font-semibold bg-secondary-container text-on-secondary-container rounded-full px-sm py-xs hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Add Data
          </Link>
        </div>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shrink-0">
          SR
        </div>
      </div>
    </header>
  )
}
