import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '@/app/(auth)/login/page'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('LoginPage', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    localStorage.clear()
  })

  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders Login securely button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /login securely/i })).toBeInTheDocument()
  })

  it('shows forgot password link', () => {
    render(<LoginPage />)
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('shows error message on 401 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })
    render(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'bad@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /login securely/i }))
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('stores token and redirects on successful login', async () => {
    const mockAssign = vi.fn()
    Object.defineProperty(window, 'location', { writable: true, value: { href: '' } })
    window.location.href = ''

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token-abc' }),
    })
    render(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'user@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'validpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /login securely/i }))
    await waitFor(() => {
      expect(localStorage.getItem('srhr_token')).toBe('test-token-abc')
    })
  })
})
