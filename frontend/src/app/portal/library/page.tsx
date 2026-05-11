'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LibraryRoot() {
  const router = useRouter()
  useEffect(() => { router.replace('/portal/library/evidence') }, [router])
  return null
}
