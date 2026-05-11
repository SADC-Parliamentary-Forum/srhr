import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterPage from '@/app/(auth)/register/page'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('RegisterPage', () => {
  beforeEach(() => mockFetch.mockReset())

  it('renders all required fields', () => {
    render(<RegisterPage />)
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('jane@organisation.org')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Institution')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Min. 12 characters/)).toBeInTheDocument()
  })

  it('renders Register Request submit button', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('button', { name: /register request/i })).toBeInTheDocument()
  })

  it('shows success message after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    render(<RegisterPage />)

    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('jane@organisation.org'), {
      target: { value: 'jane@test.org' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your Institution'), { target: { value: 'Test Org' } })
    fireEvent.change(screen.getByPlaceholderText(/Min. 12 characters/), {
      target: { value: 'password123456' },
    })

    // Select country
    const countrySelect = screen.getByDisplayValue('Select a country')
    fireEvent.change(countrySelect, { target: { value: 'Zimbabwe' } })

    // Select role
    const roleSelect = screen.getByDisplayValue('Select a role')
    fireEvent.change(roleSelect, { target: { value: 'srhr_researcher' } })

    fireEvent.click(screen.getByRole('button', { name: /register request/i }))

    await waitFor(() => {
      expect(screen.getByText(/Your registration request has been received/)).toBeInTheDocument()
    })
  })

  it('shows error on failed submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Too many requests' }),
    })
    render(<RegisterPage />)

    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('jane@organisation.org'), {
      target: { value: 'jane@test.org' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your Institution'), { target: { value: 'Test Org' } })
    fireEvent.change(screen.getByPlaceholderText(/Min. 12 characters/), {
      target: { value: 'password123456' },
    })

    const countrySelect = screen.getByDisplayValue('Select a country')
    fireEvent.change(countrySelect, { target: { value: 'Zimbabwe' } })
    const roleSelect = screen.getByDisplayValue('Select a role')
    fireEvent.change(roleSelect, { target: { value: 'srhr_researcher' } })

    fireEvent.click(screen.getByRole('button', { name: /register request/i }))

    await waitFor(() => {
      expect(screen.getByText('Too many requests')).toBeInTheDocument()
    })
  })
})
