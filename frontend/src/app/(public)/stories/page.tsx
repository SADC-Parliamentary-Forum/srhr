'use client'

import { useState } from 'react'

interface Story {
  title: string
  country: string
  category: string
  excerpt: string
  date: string
  readTime: string
  featured?: boolean
}

const stories: Story[] = [
  {
    title: 'Empowering Youth in Rural Clinics: A Zambia Success Story',
    country: 'Zambia',
    category: 'Youth Health',
    excerpt: 'A new initiative in the Southern Province has successfully integrated youth-friendly spaces within existing rural health centers, leading to a 40% increase in adolescent service utilization over six months.',
    date: 'Oct 2023',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: "Namibia's Community Health Workers Transform Maternal Care",
    country: 'Namibia',
    category: 'Maternal Health',
    excerpt: 'Trained community health workers in rural Namibia are bridging the gap between remote communities and formal health facilities, reducing maternal mortality in targeted districts by 30%.',
    date: 'Sep 2023',
    readTime: '4 min read',
  },
  {
    title: 'Malawi Parliamentarians Champion Comprehensive Sex Education',
    country: 'Malawi',
    category: 'Legislation',
    excerpt: 'A coalition of young parliamentarians successfully advocated for CSE inclusion in the national school curriculum, marking a watershed moment for reproductive health education in Malawi.',
    date: 'Aug 2023',
    readTime: '6 min read',
  },
  {
    title: 'Botswana GBV Survivors Find Voice Through Advocacy Training',
    country: 'Botswana',
    category: 'Gender Violence',
    excerpt: 'A specialized program equipping GBV survivors with advocacy skills has produced a new generation of community leaders driving legislative change at the local and national level.',
    date: 'Jul 2023',
    readTime: '5 min read',
  },
  {
    title: 'Eswatini Sets Regional Benchmark for Adolescent Health Services',
    country: 'Eswatini',
    category: 'Youth Health',
    excerpt: "Eswatini's comprehensive adolescent health program, which integrates HIV prevention, reproductive health, and mental wellness, is now being studied as a model for replication across SADC.",
    date: 'Jun 2023',
    readTime: '7 min read',
  },
  {
    title: 'South Africa Civil Society Drives Budget Accountability for SRHR',
    country: 'South Africa',
    category: 'Budget & Finance',
    excerpt: 'A coalition of civil society organizations successfully monitored and influenced the national SRHR budget process, resulting in a 15% increase in reproductive health funding for underserved communities.',
    date: 'May 2023',
    readTime: '4 min read',
  },
  {
    title: 'Tanzania Midwives Program Reaches 10,000 Women in Remote Areas',
    country: 'Tanzania',
    category: 'Maternal Health',
    excerpt: 'A mobile midwifery program supported by the SADC PF SRHR project has provided quality ante-natal and post-natal care to over 10,000 women in previously unreachable communities.',
    date: 'Apr 2023',
    readTime: '5 min read',
  },
  {
    title: 'Angola Legislative Reform Opens Path to Universal SRHR Access',
    country: 'Angola',
    category: 'Legislation',
    excerpt: "Angola's landmark reproductive health bill, championed by parliamentarians trained through the SADC PF program, has passed into law, providing a strong legal framework for universal SRHR access.",
    date: 'Mar 2023',
    readTime: '6 min read',
  },
]

const categories = ['All', 'Youth Health', 'Maternal Health', 'Legislation', 'Gender Violence', 'Budget & Finance']
const allCountries = ['All', ...Array.from(new Set(stories.map((s) => s.country)))]

function categoryBadge(category: string) {
  const styles: Record<string, { bg: string; color: string }> = {
    'Youth Health': { bg: '#c6ebd7', color: '#002115' },
    'Maternal Health': { bg: '#e8f0fe', color: '#1a73e8' },
    'Legislation': { bg: '#0b2d20', color: '#abcfbb' },
    'Gender Violence': { bg: '#fce8e6', color: '#c5221f' },
    'Budget & Finance': { bg: '#ffe088', color: '#241a00' },
  }
  const s = styles[category] ?? { bg: '#efeded', color: '#414844' }
  return (
    <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{category}</span>
  )
}

export default function StoriesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [country, setCountry] = useState('All')

  const filtered = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || s.category === category
    const matchesCountry = country === 'All' || s.country === country
    return matchesSearch && matchesCategory && matchesCountry
  })

  const featuredStory = filtered.find((s) => s.featured)
  const otherStories = filtered.filter((s) => !s.featured)

  return (
    <div className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 py-10 flex flex-col gap-10">
        <section className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0b2d20] text-[#abcfbb] w-fit">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span className="text-[12px] font-semibold tracking-wider uppercase">Impact Stories</span>
          </div>
          <h1 className="text-[32px] font-bold text-[#00170d]">Stories of Change</h1>
          <p className="text-[18px] text-[#414844] max-w-3xl">Real stories of transformation from communities across the SADC region where SRHR interventions are making a measurable difference.</p>
        </section>

        <section className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727974]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c1c8c2] rounded focus:border-[#00170d] focus:ring-1 focus:ring-[#00170d] outline-none text-[16px] text-[#1b1c1c]"
              placeholder="Search stories..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              className="px-3 py-2.5 bg-white border border-[#c1c8c2] rounded text-[14px] text-[#1b1c1c] outline-none focus:border-[#00170d] min-w-[150px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {allCountries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </section>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
              style={{
                backgroundColor: category === cat ? '#00170d' : '#efeded',
                color: category === cat ? '#ffffff' : '#414844',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {featuredStory && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#00170d] rounded-2xl overflow-hidden">
            <div className="h-64 lg:h-auto bg-[#0b2d20] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#00170d]/50" />
              <div className="absolute top-4 left-4">{categoryBadge(featuredStory.category)}</div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-[#abcfbb] mb-1">{featuredStory.country}</span>
              <h2 className="text-[24px] font-bold text-white mb-4">{featuredStory.title}</h2>
              <p className="text-[16px] text-[#abcfbb] leading-relaxed mb-6">{featuredStory.excerpt}</p>
              <div className="flex items-center gap-4 text-[#abcfbb] text-[12px] font-semibold mb-6">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span> {featuredStory.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> {featuredStory.readTime}
                </span>
              </div>
              <button className="w-fit px-6 py-3 bg-[#fed65b] text-[#745c00] rounded text-[14px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                Read Full Story <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherStories.map((story) => (
            <article
              key={story.title}
              className="bg-white rounded-xl border border-[#c1c8c2]/20 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,23,13,0.08)] transition-shadow cursor-pointer flex flex-col"
            >
              <div className="h-40 bg-[#0b2d20] relative">
                <div className="absolute top-3 left-3">{categoryBadge(story.category)}</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[12px] font-semibold text-[#727974] mb-1">{story.country}</span>
                <h3 className="text-[20px] font-semibold text-[#00170d] mb-3 leading-snug">{story.title}</h3>
                <p className="text-[14px] text-[#414844] leading-relaxed flex-grow mb-4 line-clamp-3">{story.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#c1c8c2]/20">
                  <div className="flex items-center gap-3 text-[12px] font-semibold text-[#727974]">
                    <span>{story.date}</span>
                    <span>•</span>
                    <span>{story.readTime}</span>
                  </div>
                  <button className="text-[#00170d] hover:text-[#fed65b] transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-[#414844]">
              <span className="material-symbols-outlined text-[48px] text-[#c1c8c2] block mb-3">search_off</span>
              No stories match your filters.
            </div>
          )}
        </section>

        {otherStories.length > 0 && (
          <div className="flex justify-center">
            <button className="px-6 py-3 border border-[#00170d] text-[#00170d] rounded text-[14px] font-semibold hover:bg-[#f5f3f3] transition-colors flex items-center gap-1.5">
              Load More Stories <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
