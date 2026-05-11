'use client'

import { useState } from 'react'

const CATEGORIES = ['All', 'Youth Health', 'Maternal Health', 'Legislation', 'Gender Violence']
const COUNTRIES = ['All Countries', 'Malawi', 'Kenya', 'Tanzania', 'Zambia', 'Uganda', 'Zimbabwe']

interface Story {
  title: string
  category: string
  country: string
  date: string
  readTime: string
  excerpt: string
  featured?: boolean
}

const stories: Story[] = [
  {
    title: 'How Mobile Clinics Changed Maternal Health in Rural Malawi',
    category: 'Maternal Health', country: 'Malawi', date: 'May 5, 2026', readTime: '6 min read',
    excerpt: 'A programme deploying mobile health units across Malawi\'s rural districts has reduced maternal mortality by 28% in participating communities over two years. This story traces the journey from policy to impact.',
    featured: true,
  },
  { title: 'Youth-Led Advocacy Leads to New SRHR Legislation in Kenya', category: 'Legislation', country: 'Kenya', date: 'Apr 28, 2026', readTime: '4 min read', excerpt: 'A coalition of youth advocates successfully lobbied for inclusive SRHR legislation, resulting in a landmark bill passed in March 2026.' },
  { title: 'Community Health Workers Transform GBV Response in Tanzania', category: 'Gender Violence', country: 'Tanzania', date: 'Apr 20, 2026', readTime: '5 min read', excerpt: 'Trained community health workers in Tanzania\'s rural districts are now first responders for gender-based violence cases, providing referrals and psychosocial support.' },
  { title: 'School Health Programmes Reach 50,000 Adolescents in Zambia', category: 'Youth Health', country: 'Zambia', date: 'Apr 10, 2026', readTime: '3 min read', excerpt: 'Zambia\'s integrated school health programme has successfully delivered SRHR education to over 50,000 students across 12 districts.' },
  { title: 'Parliamentary SRHR Champions Drive Budget Increases in Uganda', category: 'Legislation', country: 'Uganda', date: 'Mar 30, 2026', readTime: '4 min read', excerpt: 'A group of parliamentarians trained under the SADC-PF programme successfully advocated for a 3% increase in SRHR budget allocation.' },
  { title: 'Midwife Training Programme Reduces Birth Complications in Zimbabwe', category: 'Maternal Health', country: 'Zimbabwe', date: 'Mar 15, 2026', readTime: '5 min read', excerpt: 'A targeted midwife capacity building initiative has contributed to a 22% reduction in preventable birth complications in participating provinces.' },
]

export default function StoriesLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [country, setCountry] = useState('All Countries')
  const [search, setSearch] = useState('')

  const filtered = stories.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    const matchCountry = country === 'All Countries' || s.country === country
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchCountry && matchSearch
  })

  const featured = filtered.find((s) => s.featured)
  const grid = filtered.filter((s) => !s.featured)

  const categoryColors: Record<string, string> = {
    'Youth Health': 'bg-primary-fixed text-on-primary-fixed',
    'Maternal Health': 'bg-secondary-fixed text-on-secondary-fixed-variant',
    'Legislation': 'bg-primary text-on-primary',
    'Gender Violence': 'bg-error-container text-on-error-container',
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Stories of Change</h2>
          <p className="text-on-surface-variant mt-xs">Real stories of SRHR impact across the SADC region.</p>
        </div>
        <button className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Story
        </button>
      </div>

      {/* Featured Hero */}
      {featured && (
        <div className="bg-primary rounded-xl p-xl text-on-primary flex flex-col gap-md relative overflow-hidden">
          <div className="absolute -right-xl -bottom-xl w-80 h-80 bg-primary-container rounded-full opacity-20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-md max-w-3xl">
            <div className="flex gap-sm flex-wrap">
              <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full">{featured.category}</span>
              <span className="text-xs font-semibold bg-on-primary/10 text-on-primary px-sm py-xs rounded-full">{featured.country}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-primary leading-snug">{featured.title}</h2>
            <p className="text-on-primary/80 text-base">{featured.excerpt}</p>
            <div className="flex items-center gap-md text-on-primary/60 text-xs">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <button className="self-start px-lg py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity">
              Read Full Story
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary w-56" placeholder="Search stories..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-sm flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-sm py-xs rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {cat}
            </button>
          ))}
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="ml-auto bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {grid.map((story, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm hover:shadow-md transition-shadow">
            <div className="flex gap-sm flex-wrap">
              <span className={`text-xs font-semibold px-sm py-xs rounded-full ${categoryColors[story.category] ?? 'bg-surface-container text-on-surface-variant'}`}>{story.category}</span>
              <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-sm py-xs rounded-full">{story.country}</span>
            </div>
            <h3 className="text-sm font-bold text-primary leading-snug">{story.title}</h3>
            <p className="text-sm text-on-surface-variant flex-1 leading-relaxed">{story.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-sm border-t border-outline-variant/20">
              <span>{story.date}</span>
              <span className="bg-surface-container px-xs py-[2px] rounded-full">{story.readTime}</span>
            </div>
            <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors text-left">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
