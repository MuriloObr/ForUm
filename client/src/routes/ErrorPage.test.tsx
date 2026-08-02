import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ErrorPage } from './ErrorPage'

const mocks = vi.hoisted(() => ({
  routeError: undefined as unknown,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useRouteError: () => mocks.routeError,
  }
})

describe('ErrorPage', () => {
  it('renders the 404 route error response', () => {
    mocks.routeError = {
      status: 404,
      statusText: 'Not Found',
      internal: false,
      data: undefined,
    }

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Oops!')).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('renders the message from a route error response', () => {
    mocks.routeError = {
      status: 500,
      statusText: 'Internal Server Error',
      internal: false,
      data: { message: 'boom' },
    }

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renders a generic fallback for a thrown Error', () => {
    mocks.routeError = new Error('everything broke')

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Oops! Algo deu errado.')).toBeInTheDocument()
    expect(screen.getByText('everything broke')).toBeInTheDocument()
  })

  it('renders a generic fallback for unknown error values', () => {
    mocks.routeError = 'mystery'

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Oops! Algo deu errado.')).toBeInTheDocument()
    expect(screen.getByText('Unexpected error')).toBeInTheDocument()
  })

  it('links back to the home page', () => {
    mocks.routeError = new Error('anything')

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Go Back to Home Page')).toHaveAttribute(
      'href',
      '/',
    )
  })
})
