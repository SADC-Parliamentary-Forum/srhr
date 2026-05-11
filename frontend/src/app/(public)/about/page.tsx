import React from 'react'

export default function AboutPage() {
  const tocSteps = [
    { icon: 'gavel', title: 'Legislative Capacity', desc: 'Equipping MPs with the knowledge and tools to draft and review SRHR legislation.' },
    { icon: 'campaign', title: 'Advocacy', desc: 'Championing budget allocations and policy implementation at the national level.' },
    { icon: 'group', title: 'Community Impact', desc: 'Improved access to services and realized rights for citizens across the region.' },
  ]

  const partners = [
    { name: 'Sida', desc: 'Primary funding partner — Swedish International Development Cooperation Agency' },
    { name: 'UNFPA', desc: 'Technical partner for reproductive health programming' },
    { name: 'UN Women', desc: 'Strategic partner on gender equality and GBV prevention' },
    { name: 'WHO AFRO', desc: 'Health systems strengthening and clinical standards' },
  ]

  const highlights = [
    { icon: 'public', value: '16', label: 'Member States' },
    { icon: 'gavel', value: '243', label: 'Policies Tracked' },
    { icon: 'people', value: '180+', label: 'Parliamentarians Trained' },
    { icon: 'description', value: '148', label: 'Reports Published' },
  ]

  return (
    <div className="bg-[#fbf9f8] flex flex-col min-h-screen">
      <section className="relative w-full h-[400px] flex items-center justify-center bg-[#0b2d20] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00170d] to-transparent opacity-80" />
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-white mb-6">Advancing SRHR in Southern Africa</h1>
          <p className="text-[18px] text-[#abcfbb] max-w-2xl mx-auto">
            The SADC Parliamentary Forum SRHR Project aims to build the capacity of national parliaments to promote Sexual and Reproductive Health and Rights through legislation and advocacy.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto w-full px-5 py-16 flex flex-col gap-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#f5f3f3] rounded-xl p-6 shadow-sm border border-[#c1c8c2]/30 flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-[#735c00] text-[32px]">info</span>
              <h2 className="text-[24px] font-bold text-[#00170d]">Project Overview</h2>
            </div>
            <p className="text-[16px] text-[#414844] flex-grow leading-relaxed">
              The Sexual and Reproductive Health and Rights (SRHR), HIV and AIDS Governance Project is a flagship initiative of the SADC Parliamentary Forum. Supported by Sida, the project empowers parliamentarians to domesticate regional and international commitments on SRHR into national laws and policies. We strive for a region where fundamental human rights are universally accessible, particularly for women, girls, and vulnerable populations.
            </p>
            <div className="mt-auto pt-3 border-t border-[#c1c8c2]/50">
              <span className="inline-flex items-center gap-1 bg-[#0b2d20]/10 text-[#00170d] px-3 py-1.5 rounded-full text-[12px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> Phase 3: 2024 - 2028
              </span>
            </div>
          </div>

          <div className="bg-[#00170d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,23,13,0.15)] flex flex-col gap-3 justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fed65b]/10 rounded-bl-full" />
            <div className="relative z-10 flex flex-col gap-3 items-center text-center">
              <span className="material-symbols-outlined text-[#fed65b] text-[48px] mb-1">visibility</span>
              <h2 className="text-[24px] font-bold text-white">Our Vision</h2>
              <p className="text-[16px] text-[#abcfbb]">
                A highly integrated SADC region wherein human rights are respected, protected, and fulfilled, leading to improved health outcomes and sustainable development for all citizens.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-10">
          <div>
            <h2 className="text-[32px] font-bold text-[#00170d] mb-1.5">Theory of Change</h2>
            <p className="text-[18px] text-[#414844] max-w-3xl">How legislative action translates to tangible community impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {tocSteps.map((step, i) => (
              <React.Fragment key={step.title}>
                <div
                  className="md:col-span-1 bg-[#fbf9f8] rounded-lg p-6 border border-[#c1c8c2]/30 flex flex-col gap-3 relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] shadow-sm"
                    style={{ backgroundColor: i === 2 ? '#00170d' : '#fed65b', color: i === 2 ? '#ffffff' : '#745c00' }}>
                    {i + 1}
                  </div>
                  <span className="material-symbols-outlined text-[#446555] text-[32px]">{step.icon}</span>
                  <h3 className="text-[20px] font-semibold text-[#00170d]">{step.title}</h3>
                  <p className="text-[14px] text-[#414844]">{step.desc}</p>
                </div>
                {i < tocSteps.length - 1 && (
                  <div className="hidden md:flex md:col-span-1 items-center justify-center">
                    <span className="material-symbols-outlined text-[#c1c8c2] text-[32px]">arrow_forward</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[32px] font-bold text-[#00170d] mb-1.5">Key Highlights</h2>
          <p className="text-[18px] text-[#414844] mb-10">What the project has achieved across the SADC region.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h) => (
              <div key={h.label} className="bg-[#00170d] rounded-xl p-6 text-white flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#fed65b] text-[36px] mb-3">{h.icon}</span>
                <span className="text-[40px] font-extrabold text-[#fed65b] leading-none">{h.value}</span>
                <span className="text-[14px] text-[#abcfbb] mt-1 font-semibold">{h.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-[32px] font-bold text-[#00170d] mb-1.5">Our Partners</h2>
            <p className="text-[18px] text-[#414844]">Working together to advance SRHR across the region.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p) => (
              <div key={p.name} className="bg-[#f5f3f3] rounded-xl p-6 border border-[#c1c8c2]/30 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0b2d20] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#fed65b]">handshake</span>
                </div>
                <h3 className="text-[20px] font-semibold text-[#00170d]">{p.name}</h3>
                <p className="text-[14px] text-[#414844]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0b2d20] rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-1.5">Get in Touch</h2>
            <p className="text-[16px] text-[#abcfbb]">Have questions about the project or want to collaborate?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:srhr@sadcpf.org"
              className="px-6 py-3 bg-[#fed65b] text-[#745c00] rounded text-[14px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Contact Us
            </a>
            <a
              href="https://www.sadcpf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#abcfbb] text-[#abcfbb] rounded text-[14px] font-semibold hover:bg-[#00170d] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              SADC PF Website
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
