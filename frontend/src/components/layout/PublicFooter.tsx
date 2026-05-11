import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="bg-[#00170d] text-white mt-auto">
      <div className="max-w-[1440px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-[#fed65b] font-semibold text-[18px] mb-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                health_and_safety
              </span>
              SADC PF SRHR Portal
            </div>
            <p className="text-[14px] text-[#749684] leading-relaxed">
              Tracking parliamentary action on Sexual and Reproductive Health Rights across the SADC region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#fed65b] font-semibold text-[14px] uppercase tracking-wider mb-3">
              Portal
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Countries', href: '/countries' },
                { label: 'Reports Library', href: '/reports' },
                { label: 'Legislative Tracking', href: '/legislative-tracking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#749684] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-[#fed65b] font-semibold text-[14px] uppercase tracking-wider mb-3">
              Content
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Stories of Change', href: '/stories' },
                { label: 'Resources', href: '/resources' },
                { label: 'News & Events', href: '/news' },
                { label: 'About SADC PF', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#749684] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Access */}
          <div>
            <h3 className="text-[#fed65b] font-semibold text-[14px] uppercase tracking-wider mb-3">
              Access
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Login', href: '/login' },
                { label: 'Request Access', href: '/register' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#749684] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#0b2d20] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-[#749684]">
            © {new Date().getFullYear()} SADC Parliamentary Forum. All rights reserved.
          </p>
          <p className="text-[12px] text-[#749684]">
            SRHR, HIV and AIDS Governance Dashboard
          </p>
        </div>
      </div>
    </footer>
  )
}
