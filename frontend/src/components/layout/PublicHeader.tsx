'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Countries', href: '/countries' },
  { label: 'Reports', href: '/reports' },
  { label: 'Stories', href: '/stories' },
  { label: 'Resources', href: '/resources' },
  { label: 'News & Events', href: '/news' },
  { label: 'About', href: '/about' },
]

export function PublicHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-[#00170d] sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center w-full px-5 py-3 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="text-[20px] font-semibold text-[#fed65b] flex items-center gap-2 leading-tight">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            health_and_safety
          </span>
          SADC PF SRHR Portal
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-[14px] font-semibold tracking-wide px-2 py-1 rounded-sm transition-all',
                  isActive
                    ? 'text-[#fed65b] border-b-2 border-[#fed65b] pb-0.5 opacity-90'
                    : 'text-white hover:text-[#fed65b] hover:bg-[#0b2d20]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block px-3 py-1.5 border border-[#fed65b] text-[#fed65b] rounded text-[14px] font-semibold hover:bg-[#0b2d20] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 bg-[#fed65b] text-[#745c00] rounded text-[14px] font-semibold hover:opacity-90 transition-opacity"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}
