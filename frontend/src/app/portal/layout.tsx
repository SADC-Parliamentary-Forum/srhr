'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import PortalSidebar from './_components/PortalSidebar'
import PortalTopBar from './_components/PortalTopBar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

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
      <PortalSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <PortalTopBar />
        <main className="flex-1 overflow-auto py-lg px-gutter md:px-lg bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
