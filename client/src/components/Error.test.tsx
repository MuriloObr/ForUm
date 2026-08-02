import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Error', () => {
  it('renders a friendly 401 message', () => {
    render(<ErrorFallback error={makeAxiosError(401)} />)

    expect(
      screen.getByText('Você precisa estar logado para acessar esta página!'),
    ).toBeInTheDocument()
  })

  it('renders a friendly 404 message', () => {
    render(<ErrorFallback error={makeAxiosError(404)} />)

    expect(
      screen.getByText('Não encontramos o que você estava procurando.'),
    ).toBeInTheDocument()
  })

  it('renders a friendly 500 message', () => {
    render(<ErrorFallback error={makeAxiosError(500)} />)

    expect(
      screen.getByText(
        'Algo deu errado no servidor. Tente novamente em instantes.',
      ),
    ).toBeInTheDocument()
  })

  it('renders a friendly unknown status message', () => {
    render(<ErrorFallback error={makeAxiosError(418)} />)

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })

  it('renders a connection message for network errors', () => {
    render(<ErrorFallback error={makeAxiosError()} />)

    expect(
      screen.getByText('Não foi possível conectar ao servidor.'),
    ).toBeInTheDocument()
  })

  it('renders a generic fallback for a plain Error', () => {
    render(<ErrorFallback error={new Error('boom')} />)

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })

  it('renders a generic fallback for unknown error values', () => {
    render(<ErrorFallback error={'weird'} />)

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })
})
