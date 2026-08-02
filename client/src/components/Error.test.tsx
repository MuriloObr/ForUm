import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Error as ErrorFallback } from './Error'

function makeAxiosError(status?: number): AxiosError {
  const response = status
    ? ({
        status,
        statusText: '',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {},
      } satisfies AxiosResponse)
    : undefined

  return new AxiosError(
    'Request failed with status code',
    undefined,
    undefined,
    undefined,
    response,
  )
}

function renderError(error: unknown, onRetry?: () => void) {
  return render(
    <MemoryRouter>
      <ErrorFallback error={error} onRetry={onRetry} />
    </MemoryRouter>,
  )
}

describe('Error', () => {
  it('renders an alert region with a heading', () => {
    renderError(makeAxiosError(404))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders a friendly 401 message with a login action', () => {
    renderError(makeAxiosError(401))

    expect(
      screen.getByText('Você precisa estar logado para acessar esta página!'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('renders a friendly 404 message with a home action', () => {
    renderError(makeAxiosError(404))

    expect(
      screen.getByText('Não encontramos o que você estava procurando.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/')
  })

  it('renders a friendly 500 message', () => {
    renderError(makeAxiosError(500))

    expect(screen.getByText('Algo deu errado no servidor.')).toBeInTheDocument()
    expect(
      screen.getByText('Tente novamente em instantes.'),
    ).toBeInTheDocument()
  })

  it('renders a friendly unknown status message', () => {
    renderError(makeAxiosError(418))

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })

  it('renders a connection message for network errors', () => {
    renderError(makeAxiosError())

    expect(
      screen.getByText('Não foi possível conectar ao servidor.'),
    ).toBeInTheDocument()
  })

  it('renders a generic fallback for a plain Error', () => {
    renderError(new Error('boom'))

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })

  it('renders a generic fallback for unknown error values', () => {
    renderError('weird')

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })

  it('calls onRetry when retrying', () => {
    const onRetry = vi.fn()
    renderError(makeAxiosError(500), onRetry)

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalled()
  })

  it('offers a home escape when retry is available', () => {
    renderError(makeAxiosError(500), vi.fn())

    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/')
  })

  it('shows the raw error detail in development', () => {
    renderError(makeAxiosError(500))

    expect(
      screen.getByText('Erro 500 · Request failed with status code'),
    ).toBeInTheDocument()
  })
})
