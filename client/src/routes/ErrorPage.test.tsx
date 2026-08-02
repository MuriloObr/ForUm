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

vi.mock('../api/generated/endpoints', () => ({
  useLoggedApiLoggedGet: () => ({ data: undefined }),
}))

function renderErrorPage() {
  return render(
    <MemoryRouter>
      <ErrorPage />
    </MemoryRouter>,
  )
}

describe('ErrorPage', () => {
  it('renders the 404 route error response with a home action', () => {
    mocks.routeError = {
      status: 404,
      statusText: 'Not Found',
      internal: false,
      data: undefined,
    }

    renderErrorPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Não encontramos o que você estava procurando.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/')
  })

  it('keeps the app chrome alive on error', () => {
    mocks.routeError = new Error('everything broke')

    renderErrorPage()

    expect(screen.getByText('ForUm')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

  it('renders a friendly 500 route error response', () => {
    mocks.routeError = {
      status: 500,
      statusText: 'Internal Server Error',
      internal: false,
      data: { message: 'boom' },
    }

    renderErrorPage()

    expect(screen.getByText('Algo deu errado no servidor.')).toBeInTheDocument()
    expect(screen.getByText('Erro 500 · boom')).toBeInTheDocument()
  })

  it('renders a generic fallback for a thrown Error', () => {
    mocks.routeError = new Error('everything broke')

    renderErrorPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Algo deu errado.' }),
    ).toBeInTheDocument()
  })

  it('renders a generic fallback for unknown error values', () => {
    mocks.routeError = 'mystery'

    renderErrorPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Algo deu errado.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/')
  })

  it('moves focus to the heading on mount', () => {
    mocks.routeError = new Error('everything broke')

    renderErrorPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
  })
})
