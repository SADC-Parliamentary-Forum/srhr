'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Countries', href: '/countries' },
  { label: 'Reports', href: '/reports' },
  { label: 'Stories', href: '/stories' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
]

export function PublicHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[#00170d] sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center w-full px-5 py-2 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 shrink-0">
          <Image
            src="/sadc-pf-logo.jpg"
            alt="SADC PF Logo"
            width={44}
            height={44}
            unoptimized
            className="object-contain shrink-0"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-[#fed65b] tracking-wide">SADC PF</span>
            <span className="text-[11px] font-semibold text-[#abcfbb] tracking-wide hidden sm:block">SRHR Portal</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-1 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-[13px] font-semibold tracking-wide px-3 py-1.5 rounded transition-all',
                  isActive
                    ? 'text-[#fed65b] underline underline-offset-4 decoration-[#fed65b]'
                    : 'text-white hover:text-[#fed65b] hover:bg-[#0b2d20]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: auth buttons + hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:block px-3 py-1.5 border border-[#fed65b] text-[#fed65b] rounded text-[13px] font-semibold hover:bg-[#0b2d20] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login?tab=register"
            className="hidden md:block px-3 py-1.5 bg-[#fed65b] text-[#745c00] rounded text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Register
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="lg:hidden p-1.5 rounded text-white hover:bg-[#0b2d20] transition-colors"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#0b2d20] bg-[#00170d] px-5 pb-5 pt-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  'text-[15px] font-semibold px-3 py-2.5 rounded transition-all',
                  isActive ? 'text-[#fed65b] bg-[#0b2d20]' : 'text-white hover:text-[#fed65b] hover:bg-[#0b2d20]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#0b2d20]">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 border border-[#fed65b] text-[#fed65b] rounded text-[14px] font-semibold hover:bg-[#0b2d20] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 bg-[#fed65b] text-[#745c00] rounded text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
