import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PublicHeader } from '@/components/layout/PublicHeader'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('PublicHeader', () => {
  it('renders all 8 navigation links', () => {
    render(<PublicHeader />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Stories')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('News & Events')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders Login and Register CTAs', () => {
    render(<PublicHeader />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('renders the SADC PF brand name', () => {
    render(<PublicHeader />)
    expect(screen.getByText(/SADC PF SRHR Portal/)).toBeInTheDocument()
  })

  it('Login links to /login', () => {
    render(<PublicHeader />)
    const loginLink = screen.getByText('Login').closest('a')
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('Register links to /register', () => {
    render(<PublicHeader />)
    const registerLink = screen.getByText('Register').closest('a')
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})
