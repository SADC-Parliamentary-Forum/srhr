'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import { clearToken, getToken } from '@/lib/auth'
import PortalSidebar from './_components/PortalSidebar'
import PortalTopBar from './_components/PortalTopBar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false

    async function validateSession() {
      const token = getToken()

      if (!token) {
        router.replace('/login')
        return
      }

      try {
        await api.get('/auth/me', token)
        if (!cancelled) {
          setReady(true)
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearToken()
        }

        if (!cancelled) {
          router.replace('/login')
        }
      }
    }

    validateSession()

    return () => {
      cancelled = true
    }
  }, [router])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const stored = window.localStorage.getItem('srhr_focus_mode')
    setFocusMode(stored === 'true')
  }, [])

  function toggleFocusMode() {
    setFocusMode((current) => {
      const next = !current
      window.localStorage.setItem('srhr_focus_mode', String(next))
      if (next) {
        setSidebarOpen(false)
      }
      return next
    })
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin">
          progress_activity
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile (slide in), sticky on md+ */}
      {(!focusMode || sidebarOpen) && (
        <div className={`fixed md:sticky top-0 h-screen z-50 md:z-auto shrink-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <PortalSidebar focusMode={focusMode} onToggleFocusMode={toggleFocusMode} />
        </div>
      )}

      {/* Right column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar row — hamburger + topbar */}
        <div className="flex items-center sticky top-0 z-40 bg-surface border-b border-outline-variant">
          <button
            className="md:hidden p-3 text-on-surface-variant hover:text-primary shrink-0 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex-1 min-w-0">
            <PortalTopBar />
          </div>
        </div>

        <main className="flex-1 overflow-auto py-8 px-4 sm:px-6 lg:px-10 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
