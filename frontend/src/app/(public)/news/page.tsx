'use client'

import { useState } from 'react'

interface NewsItem {
  title: string
  category: string
  date: string
  excerpt: string
  readTime: string
  featured?: boolean
}

interface Event {
  month: string
  day: string
  type: string
  title: string
  time: string
  location?: string
}

const newsItems: NewsItem[] = [
  {
    title: 'New SRHR Framework Adopted to Enhance Youth Access Across SADC',
    category: 'Regional Update',
    date: 'Oct 24, 2024',
    excerpt: 'The parliamentary forum has unanimously agreed on the new guidelines aimed at standardizing reproductive health education and services for young people across member states.',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: 'Committee Reviews Maternal Health Budget Allocations',
    category: 'Press Release',
    date: 'Oct 22, 2024',
    excerpt: 'A detailed breakdown of the proposed budget increases for maternal care facilities in rural areas was presented to the forum today.',
    readTime: '3 min read',
  },
  {
    title: 'Youth Advocates Lead Local Awareness Campaigns',
    category: 'Community Story',
    date: 'Oct 18, 2024',
    excerpt: 'Highlighting successful grassroots initiatives led by young parliamentarians to educate local communities on SRHR rights.',
    readTime: '4 min read',
  },
  {
    title: 'Draft Bill on Cross-Border Health Services Published for Comment',
    category: 'Legislation',
    date: 'Oct 15, 2024',
    excerpt: 'The comprehensive document outlines mechanisms for shared medical resources across SADC borders, aiming to improve accessibility for transient populations.',
    readTime: '6 min read',
  },
  {
    title: 'Zambia Reports 40% Increase in Adolescent Service Utilization',
    category: 'Country Update',
    date: 'Oct 10, 2024',
    excerpt: "Zambia's youth-friendly health center initiative shows remarkable results after six months of expanded outreach and service integration.",
    readTime: '3 min read',
  },
  {
    title: 'SADC PF Releases Comprehensive CSE Curriculum Guidelines',
    category: 'Policy Brief',
    date: 'Oct 5, 2024',
    excerpt: 'New guidelines provide member states with a standardized framework for integrating comprehensive sexuality education into national curricula.',
    readTime: '5 min read',
  },
]

const events: Event[] = [
  { month: 'Nov', day: '12', type: 'Webinar', title: 'Integrating SRHR in National Budgets', time: '10:00 AM - 12:00 PM CAT' },
  { month: 'Nov', day: '25', type: 'In-Person', title: 'Annual Parliamentary Review Summit', time: '', location: 'Gaborone, Botswana' },
  { month: 'Dec', day: '05', type: 'Workshop', title: 'Youth Leadership in Policy Making', time: '09:00 AM - 04:00 PM SAST' },
  { month: 'Dec', day: '14', type: 'Webinar', title: 'GBV Prevention Strategies Across the Region', time: '2:00 PM - 4:00 PM CAT' },
]

function eventTypeBadge(type: string) {
  if (type === 'Webinar') return <span className="inline-block bg-[#c6ebd7] text-[#002115] text-[12px] font-semibold px-2 py-0.5 rounded-full mb-1">{type}</span>
  if (type === 'Workshop') return <span className="inline-block bg-[#c6ebd7] text-[#002115] text-[12px] font-semibold px-2 py-0.5 rounded-full mb-1">{type}</span>
  return <span className="inline-block bg-[#e4e2e2] text-[#414844] text-[12px] font-semibold px-2 py-0.5 rounded-full mb-1">{type}</span>
}

export default function NewsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = newsItems.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === '' || (typeFilter === 'news' && n.category !== 'Webinar') || (typeFilter === 'events')
    return matchesSearch && matchesType
  })

  const featuredItem = filtered.find((n) => n.featured)
  const latestItems = filtered.filter((n) => !n.featured)

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <section className="bg-[#efeded] py-10 px-5 border-b border-[#c1c8c2]/10">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-[32px] font-bold text-[#00170d] mb-6">News & Events</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#414844]">search</span>
              <input
                className="w-full pl-10 pr-3 py-3 rounded bg-white border border-[#c1c8c2] focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] text-[16px] text-[#1b1c1c] outline-none"
                placeholder="Search news, events, topics..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-3 py-3 rounded bg-white border border-[#c1c8c2] text-[14px] text-[#1b1c1c] min-w-[120px] outline-none focus:border-[#00170d]"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="news">News</option>
                <option value="events">Events</option>
              </select>
              <select className="px-3 py-3 rounded bg-white border border-[#c1c8c2] text-[14px] text-[#1b1c1c] min-w-[150px] outline-none focus:border-[#00170d]">
                <option>All Topics</option>
                <option>Maternal Health</option>
                <option>Youth</option>
                <option>Legislation</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 py-16 flex flex-col lg:flex-row gap-16">
        <div className="lg:w-2/3 flex flex-col gap-16">
          {featuredItem && (
            <section>
              <h2 className="text-[24px] font-bold text-[#1b1c1c] mb-6">Featured Story</h2>
              <div className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                <div className="w-full h-72 bg-[#0b2d20]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00170d]/90 via-[#00170d]/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                  <span className="bg-[#fed65b] text-[#745c00] text-[12px] font-semibold px-2 py-1 rounded-full w-max mb-3">{featuredItem.category}</span>
                  <h3 className="text-[32px] font-bold text-white mb-3 leading-tight">{featuredItem.title}</h3>
                  <p className="text-[16px] text-[#e4e2e2] hidden md:block mb-4 max-w-2xl">{featuredItem.excerpt}</p>
                  <div className="flex items-center text-[#e4e2e2] text-[12px] font-semibold gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span> {featuredItem.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> {featuredItem.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex justify-between items-end mb-6 border-b border-[#c1c8c2]/20 pb-3">
              <h2 className="text-[24px] font-bold text-[#1b1c1c]">Latest News</h2>
              <button className="text-[12px] font-semibold text-[#00170d] hover:text-[#735c00] flex items-center">
                View All <span className="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#fbf9f8] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,23,13,0.04)] border border-[#c1c8c2]/10 hover:shadow-[0_4px_12px_rgba(0,23,13,0.08)] transition-shadow flex flex-col cursor-pointer"
                >
                  <div className="h-48 bg-[#0b2d20] relative">
                    <div className="absolute top-3 left-3 bg-[#efeded] text-[#1b1c1c] text-[12px] font-semibold px-2 py-1 rounded-full">{item.category}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-[#414844] text-[12px] font-semibold mb-1">{item.date}</div>
                    <h4 className="text-[20px] font-semibold text-[#1b1c1c] mb-3">{item.title}</h4>
                    <p className="text-[14px] text-[#414844] flex-grow mb-4">{item.excerpt}</p>
                    <button className="text-[12px] font-semibold text-[#00170d] hover:text-[#fed65b] transition-colors self-start">Read More</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-[#fbf9f8] rounded-xl shadow-[0_2px_8px_rgba(0,23,13,0.04)] border border-[#c1c8c2]/10 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b border-[#c1c8c2]/20 pb-3">
              <h2 className="text-[24px] font-bold text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00170d]">event_upcoming</span> Upcoming Events
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {events.map((event) => (
                <div key={event.title} className="group border-b border-[#c1c8c2]/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex gap-3 items-start">
                    <div className="bg-[#efeded] rounded-lg p-2 text-center min-w-[60px] border border-[#c1c8c2]/20 group-hover:bg-[#00170d] group-hover:text-white transition-colors">
                      <div className="text-[12px] font-semibold uppercase text-[#735c00] group-hover:text-[#fed65b]">{event.month}</div>
                      <div className="text-[24px] font-bold leading-none text-[#1b1c1c] group-hover:text-white">{event.day}</div>
                    </div>
                    <div>
                      {eventTypeBadge(event.type)}
                      <h4 className="text-[20px] font-semibold text-[#1b1c1c] mb-1 group-hover:text-[#00170d] transition-colors">{event.title}</h4>
                      <div className="text-[14px] text-[#414844] flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[16px]">{event.location ? 'location_on' : 'schedule'}</span>
                        {event.location ?? event.time}
                      </div>
                      <button className="text-[12px] font-semibold text-[#00170d] border border-[#00170d] px-3 py-1 rounded hover:bg-[#0b2d20] hover:text-white transition-colors">
                        {event.location ? 'View Details' : 'Register'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-3 border-t border-[#c1c8c2]/20 text-center">
              <button className="text-[12px] font-semibold text-[#fed65b] bg-[#00170d] rounded px-4 py-2 inline-block w-full hover:bg-[#0b2d20] transition-colors">
                View Full Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
