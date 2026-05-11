'use client'

import Link from 'next/link'
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
    <header className="bg-surface-bright shadow-sm flex justify-between items-center px-gutter py-xs w-full sticky top-0 z-50 border-b border-outline-variant">
      <div className="flex items-center gap-lg">
        <nav className="flex items-center gap-md">
          {centerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold py-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-md">
        <div className="flex items-center bg-surface-container-low rounded-full px-sm py-xs border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-40 text-on-surface placeholder:text-on-surface-variant ml-xs"
            placeholder="Search..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-sm">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
            <span className="material-symbols-outlined text-[20px]">public</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        </div>

        <div className="flex items-center gap-sm border-l border-outline-variant pl-md">
          <button className="text-sm font-semibold text-primary border border-primary rounded-full px-sm py-xs hover:bg-primary-fixed transition-colors">
            AI Assistant
          </button>
          <Link
            href="/portal/data-capture"
            className="text-sm font-semibold bg-primary text-on-primary rounded-full px-sm py-xs hover:opacity-90 transition-opacity"
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
