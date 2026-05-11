import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PublicFooter } from '@/components/layout/PublicFooter'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('PublicFooter', () => {
  it('renders SADC PF branding', () => {
    render(<PublicFooter />)
    expect(screen.getByText(/SADC PF SRHR Portal/)).toBeInTheDocument()
  })

  it('renders portal navigation links', () => {
    render(<PublicFooter />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
    expect(screen.getByText('Reports Library')).toBeInTheDocument()
  })

  it('renders content links', () => {
    render(<PublicFooter />)
    expect(screen.getByText('Stories of Change')).toBeInTheDocument()
    expect(screen.getByText('News & Events')).toBeInTheDocument()
    expect(screen.getByText('About SADC PF')).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<PublicFooter />)
    expect(screen.getByText(/SADC Parliamentary Forum/)).toBeInTheDocument()
  })
})
