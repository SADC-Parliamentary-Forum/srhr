'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getToken } from '@/lib/auth'

interface StoryFile {
  name: string
  size: string | null
  bytes: number | null
  url: string | null
}

interface StoryItem {
  id: number
  title: string
  description: string | null
  evidence_type: string
  country: string | null
  period: string | null
  status: string
  tags: string[]
  linked_indicators: string[]
  files_count: number
  files: StoryFile[]
  file_size: string | null
  owner: string
  created_at: string
  created_label: string
}

interface UploadFile {
  name: string
  size: string
  type: string
  file: File
}

type Metadata = {
  countries: Array<{ id: number; name: string }>
  periods: Array<{ id: number; label: string }>
  indicators: Array<{ code: string; name: string }>
}

const fileTypeIcon: Record<string, string> = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalizeStory(item: StoryItem): StoryItem {
  return {
    ...item,
    tags: Array.isArray(item.tags) ? item.tags : [],
    linked_indicators: Array.isArray(item.linked_indicators) ? item.linked_indicators : [],
    files: Array.isArray(item.files) ? item.files : [],
    files_count: typeof item.files_count === 'number' ? item.files_count : 0,
    owner: item.owner ?? 'System',
    created_label: item.created_label ?? item.created_at,
  }
}

function humanizeTag(tag: string): string {
  return tag
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function StoriesLibraryPage() {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [stories, setStories] = useState<StoryItem[]>([])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All Countries')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [storyHtml, setStoryHtml] = useState('<p></p>')
  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [linkedIndicators, setLinkedIndicators] = useState<string[]>([])
  const [files, setFiles] = useState<UploadFile[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    Promise.all([
      fetch('/api/portal/evidence', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
      fetch('/api/portal/evidence/metadata', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    ])
      .then(([storyPayload, metadataPayload]) => {
        const storyItems = (Array.isArray(storyPayload) ? storyPayload : [])
          .map(normalizeStory)
          .filter((item) => item.evidence_type === 'Story')
        setStories(storyItems)
        setMetadata(metadataPayload)
      })
      .catch(() => setError('Unable to load stories.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (uploadOpen && editorRef.current) {
      editorRef.current.innerHTML = storyHtml
    }
  }, [storyHtml, uploadOpen])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(stories.flatMap((story) => story.tags.map(humanizeTag)))).filter(Boolean)],
    [stories],
  )

  const countries = useMemo(
    () => ['All Countries', ...Array.from(new Set(stories.map((story) => story.country).filter(Boolean)))],
    [stories],
  )

  const filtered = useMemo(() => {
    return stories.filter((story) => {
      const storyCategories = story.tags.map(humanizeTag)
      const matchCategory = activeCategory === 'All' || storyCategories.includes(activeCategory)
      const matchCountry = countryFilter === 'All Countries' || story.country === countryFilter
      const matchSearch = [story.title, stripHtml(story.description ?? ''), story.country ?? '', story.owner]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchCategory && matchCountry && matchSearch
    })
  }, [activeCategory, countryFilter, search, stories])

  const featured = filtered[0]
  const grid = filtered.slice(1)

  const categoryColors: Record<string, string> = {
    'Youth Health': 'bg-primary-fixed text-on-primary-fixed',
    'Maternal Health': 'bg-secondary-fixed text-on-secondary-fixed-variant',
    Legislation: 'bg-primary text-on-primary',
    'Gender Violence': 'bg-error-container text-on-error-container',
  }

  function openUploadModal() {
    setUploadOpen(true)
    setMessage(null)
    setError(null)
  }

  function addTag() {
    const value = tagInput.trim()
    if (value && !tags.includes(value)) {
      setTags((current) => [...current, value])
      setTagInput('')
    }
  }

  function toggleIndicator(code: string) {
    setLinkedIndicators((current) => (
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
    ))
  }

  function execEditorCommand(command: string) {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command)
    setStoryHtml(editorRef.current.innerHTML)
  }

  async function submitStory() {
    const token = getToken()
    if (!token) return

    const editorContent = editorRef.current?.innerHTML ?? storyHtml
    const plainText = stripHtml(editorContent)
    if (title.trim() === '' || plainText === '') {
      setError('Add both a story title and story content.')
      return
    }

    setSubmitting(true)
    setMessage(null)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', editorContent)
    formData.append('evidence_type', 'Story')
    formData.append('status', 'submitted')
    if (selectedCountryId) formData.append('country_id', selectedCountryId)
    if (periodId) formData.append('reporting_period_id', periodId)
    tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag))
    linkedIndicators.forEach((indicator, index) => formData.append(`linked_indicators[${index}]`, indicator))
    files.forEach((item) => formData.append('files[]', item.file))

    try {
      const response = await fetch('/api/portal/evidence', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setError(payload?.message ?? 'Unable to upload story.')
        return
      }

      const refreshedStories = await fetch('/api/portal/evidence', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())

      setStories(
        (Array.isArray(refreshedStories) ? refreshedStories : [])
          .map(normalizeStory)
          .filter((item) => item.evidence_type === 'Story'),
      )

      setMessage(payload?.message ?? 'Story uploaded successfully.')
      setUploadOpen(false)
      setTitle('')
      setStoryHtml('<p></p>')
      setSelectedCountryId('')
      setPeriodId('')
      setTagInput('')
      setTags([])
      setLinkedIndicators([])
      setFiles([])
    } catch {
      setError('Unable to upload story.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between gap-md">
        <div>
          <h2 className="text-3xl font-bold text-primary">Stories of Change</h2>
          <p className="text-on-surface-variant mt-xs">Real stories of SRHR impact across the SADC region.</p>
        </div>
        <button
          onClick={openUploadModal}
          className="px-md py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Story
        </button>
      </div>

      {message ? <div className="rounded-xl bg-primary-fixed/10 border border-primary/15 px-md py-sm text-sm text-[#00170d]">{message}</div> : null}
      {error ? <div className="rounded-xl bg-error-container px-md py-sm text-sm text-on-error-container">{error}</div> : null}

      {featured && (
        <div className="bg-primary rounded-xl p-xl text-on-primary flex flex-col gap-md relative overflow-hidden">
          <div className="absolute -right-xl -bottom-xl w-80 h-80 bg-primary-container rounded-full opacity-20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-md max-w-3xl">
            <div className="flex gap-sm flex-wrap">
              {(featured.tags[0] ? [humanizeTag(featured.tags[0])] : ['Stories of Change']).map((category) => (
                <span key={category} className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full">{category}</span>
              ))}
              <span className="text-xs font-semibold bg-on-primary/10 text-on-primary px-sm py-xs rounded-full">{featured.country ?? 'Regional'}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-primary leading-snug">{featured.title}</h2>
            <p className="text-on-primary/80 text-base">{stripHtml(featured.description ?? '').slice(0, 240) || 'No story summary was provided.'}</p>
            <div className="flex items-center gap-md text-on-primary/60 text-xs">
              <span>{featured.created_label}</span>
              <span>-</span>
              <span>{featured.owner}</span>
            </div>
            <button
              onClick={openUploadModal}
              className="self-start px-lg py-sm rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Add Another Story
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            className="pl-lg pr-md py-sm rounded-full bg-surface-container border border-outline-variant text-sm outline-none focus:border-primary w-56"
            placeholder="Search stories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex gap-sm flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-sm py-xs rounded-full text-sm font-semibold transition-colors ${
                activeCategory === category ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="ml-auto bg-surface-container border border-outline-variant rounded-lg px-sm py-xs text-sm outline-none">
          {countries.map((country) => <option key={country}>{country}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <span className="material-symbols-outlined text-[40px] animate-spin text-[#00170d]">progress_activity</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {grid.map((story) => {
            const storyCategory = story.tags[0] ? humanizeTag(story.tags[0]) : 'Stories of Change'
            return (
              <div key={story.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-md flex flex-col gap-sm hover:shadow-md transition-shadow">
                <div className="flex gap-sm flex-wrap">
                  <span className={`text-xs font-semibold px-sm py-xs rounded-full ${categoryColors[storyCategory] ?? 'bg-surface-container text-on-surface-variant'}`}>{storyCategory}</span>
                  <span className="text-xs font-semibold bg-surface-container text-on-surface-variant px-sm py-xs rounded-full">{story.country ?? 'Regional'}</span>
                </div>
                <h3 className="text-sm font-bold text-primary leading-snug">{story.title}</h3>
                <p className="text-sm text-on-surface-variant flex-1 leading-relaxed">{stripHtml(story.description ?? '').slice(0, 180) || 'No story summary was provided.'}</p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-sm border-t border-outline-variant/20">
                  <span>{story.created_label}</span>
                  <span className="bg-surface-container px-xs py-[2px] rounded-full">{story.files_count} file{story.files_count === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-xs text-on-surface-variant truncate">{story.owner}</span>
                  {story.files[0]?.url ? (
                    <a href={story.files[0].url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                      Open Attachment
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-on-surface-variant">No attachment</span>
                  )}
                </div>
              </div>
            )
          })}

          {!loading && filtered.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] block mb-3">search_off</span>
              No stories match your filters.
            </div>
          ) : null}
        </div>
      )}

      {uploadOpen ? (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm px-md py-lg overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-xl p-lg">
            <div className="flex items-start justify-between gap-md">
              <div>
                <h3 className="text-xl font-bold text-[#00170d]">Capture Story</h3>
                <p className="text-sm text-on-surface-variant mt-xs">Use the editor below to format the story and attach images, PDFs, or Word documents.</p>
              </div>
              <button onClick={() => setUploadOpen(false)} className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-lg grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-lg">
              <div className="flex flex-col gap-md">
                <label className="flex flex-col gap-xs">
                  <span className="text-sm font-semibold text-on-surface">Story title</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} className="border border-outline-variant rounded-xl bg-surface px-md py-sm text-sm outline-none focus:border-primary" />
                </label>

                <div className="rounded-2xl border border-outline-variant overflow-hidden bg-surface">
                  <div className="flex flex-wrap gap-xs border-b border-outline-variant p-sm bg-surface-container-lowest">
                    <button type="button" onClick={() => execEditorCommand('bold')} className="px-sm py-xs rounded-lg bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-high">Bold</button>
                    <button type="button" onClick={() => execEditorCommand('italic')} className="px-sm py-xs rounded-lg bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-high">Italic</button>
                    <button type="button" onClick={() => execEditorCommand('insertUnorderedList')} className="px-sm py-xs rounded-lg bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-high">Bullets</button>
                    <button type="button" onClick={() => execEditorCommand('formatBlock')} className="px-sm py-xs rounded-lg bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-high">Paragraph</button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[320px] px-md py-md text-sm text-on-surface outline-none"
                    onInput={() => setStoryHtml(editorRef.current?.innerHTML ?? '<p></p>')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <label className="flex flex-col gap-xs">
                    <span className="text-sm font-semibold text-on-surface">Country</span>
                    <select value={selectedCountryId} onChange={(event) => setSelectedCountryId(event.target.value)} className="border border-outline-variant rounded-xl bg-surface px-md py-sm text-sm outline-none focus:border-primary">
                      <option value="">Regional</option>
                      {metadata?.countries.map((option) => <option key={option.id} value={String(option.id)}>{option.name}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-xs">
                    <span className="text-sm font-semibold text-on-surface">Period</span>
                    <select value={periodId} onChange={(event) => setPeriodId(event.target.value)} className="border border-outline-variant rounded-xl bg-surface px-md py-sm text-sm outline-none focus:border-primary">
                      <option value="">Select period</option>
                      {metadata?.periods.map((option) => <option key={option.id} value={String(option.id)}>{option.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-md">
                <div>
                  <div className="flex gap-sm mb-sm">
                    <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} className="flex-1 border border-outline-variant rounded-xl bg-surface px-md py-sm text-sm outline-none focus:border-primary" placeholder="Tag, e.g. youth-health" />
                    <button type="button" onClick={addTag} className="px-md py-sm rounded-full bg-primary text-on-primary text-sm font-semibold hover:opacity-90">Add Tag</button>
                  </div>
                  <div className="flex flex-wrap gap-xs">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-xs rounded-full bg-surface-container px-sm py-xs text-xs text-on-surface-variant">
                        {tag}
                        <button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))}>
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest px-md py-xl text-center cursor-pointer hover:border-primary/50">
                  <span className="material-symbols-outlined text-[40px] text-on-surface-variant">upload_file</span>
                  <p className="text-sm font-semibold text-on-surface mt-sm">Upload supporting files</p>
                  <p className="text-xs text-on-surface-variant mt-xs">Images, PDF, DOC, DOCX</p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => {
                      const selectedFiles = Array.from(event.target.files ?? []).map((file) => ({
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        type: file.name.split('.').pop()?.toLowerCase() ?? 'file',
                        file,
                      }))
                      setFiles((current) => [...current, ...selectedFiles])
                    }}
                  />
                </label>

                <div className="flex flex-col gap-sm max-h-[220px] overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="rounded-xl border border-outline-variant/20 bg-surface px-md py-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary">{fileTypeIcon[file.type] ?? 'attach_file'}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                        <p className="text-xs text-on-surface-variant">{file.size}</p>
                      </div>
                      <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-error">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-outline-variant/20 bg-surface px-md py-md">
                  <p className="text-sm font-semibold text-on-surface mb-sm">Linked indicators</p>
                  <div className="max-h-[220px] overflow-y-auto flex flex-col gap-xs">
                    {metadata?.indicators.map((indicator) => (
                      <label key={indicator.code} className="flex items-center gap-sm text-sm text-on-surface cursor-pointer">
                        <input type="checkbox" checked={linkedIndicators.includes(indicator.code)} onChange={() => toggleIndicator(indicator.code)} />
                        {indicator.code} - {indicator.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-lg flex flex-col-reverse sm:flex-row sm:justify-end gap-sm">
              <button type="button" onClick={() => setUploadOpen(false)} className="px-md py-sm rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:border-primary">
                Cancel
              </button>
              <button type="button" onClick={submitStory} disabled={submitting} className="px-lg py-sm rounded-full bg-[#00170d] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">
                {submitting ? 'Uploading...' : 'Publish Story'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
