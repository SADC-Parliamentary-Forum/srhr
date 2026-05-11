import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

const stats = [
  { label: 'Active Countries', value: '16' },
  { label: 'Total Policies', value: '243' },
  { label: 'Budget Allocations', value: '$45M' },
  { label: 'Oversight Reports', value: '89' },
]

const featuredCountries = [
  { name: 'Angola', slug: 'angola', policies: 4 },
  { name: 'Botswana', slug: 'botswana', policies: 12 },
  { name: 'South Africa', slug: 'south-africa', policies: 28 },
  { name: 'Zambia', slug: 'zambia', policies: 9 },
]

export default function RootPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-grow">
        <section className="relative bg-[#00170d] text-white overflow-hidden py-16 px-5">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at right top, #fed65b, transparent 50%)' }}
          />
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0b2d20] text-[#abcfbb] w-fit shadow-[0_4px_12px_rgba(0,23,13,0.4)]">
                <span className="material-symbols-outlined text-sm">public</span>
                <span className="text-[12px] font-semibold tracking-wider uppercase">Regional Overview</span>
              </div>
              <h1 className="text-[40px] font-extrabold text-[#fed65b] leading-tight">
                SADC PF SRHR, HIV and AIDS Governance Dashboard
              </h1>
              <p className="text-[18px] text-[#e4e2e2] max-w-xl leading-relaxed">
                Tracking parliamentary action, evidence, budgets, legislation, oversight, and stories of change across
                the SADC region.
              </p>
              <div className="flex gap-3 mt-2">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-[#fed65b] text-[#745c00] rounded text-[14px] font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  Explore Dashboard
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 border border-[#c1c8c2] text-white rounded text-[14px] font-semibold hover:bg-[#0b2d20] transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="bg-white text-[#1b1c1c] rounded-xl p-6 shadow-[0_8px_24px_rgba(0,23,13,0.1)] border border-[#00170d]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fed65b]/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between mb-6 border-b border-[#c1c8c2]/30 pb-3">
                <h2 className="text-[24px] font-bold text-[#00170d] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#fed65b]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                  Public Project Snapshot
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[#f5f3f3] rounded-lg p-3 border border-[#c1c8c2]/20 shadow-sm">
                    <p className="text-[12px] font-semibold text-[#414844] uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-[32px] font-bold text-[#00170d]">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0b2d20]/10 rounded-lg p-3 flex items-start gap-3 border border-[#0b2d20]/20">
                <span className="material-symbols-outlined text-[#00170d] mt-0.5">info</span>
                <p className="text-[14px] text-[#414844]">
                  Data reflects the latest public updates from participating member states for the current fiscal year.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-5 bg-white">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-3">
              <div>
                <h2 className="text-[24px] font-bold text-[#00170d] mb-1.5">Explore by Country</h2>
                <p className="text-[16px] text-[#414844] max-w-2xl">
                  Access specific SRHR data, parliamentary resolutions, and national budgets for SADC member states.
                </p>
              </div>
              <Link
                href="/countries"
                className="px-3 py-1.5 border border-[#00170d] text-[#00170d] rounded text-[14px] font-semibold hover:bg-[#f5f3f3] transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                View All Countries
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredCountries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/countries/${country.slug}`}
                  className="group block relative rounded-lg overflow-hidden border border-[#c1c8c2]/30 shadow-sm hover:shadow-[0_8px_16px_rgba(0,23,13,0.08)] transition-all bg-white"
                >
                  <div className="h-32 bg-[#e4e2e2] relative flex items-end justify-start">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00170d]/80 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[20px] font-semibold text-white group-hover:text-[#fed65b] transition-colors">
                      {country.name}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-white">
                    <span className="px-1.5 py-0.5 bg-[#0b2d20]/10 text-[#00170d] rounded text-[10px] font-bold uppercase tracking-wider">
                      {country.policies} Policies
                    </span>
                    <span className="material-symbols-outlined text-[#727974] group-hover:text-[#00170d] transition-colors">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}
