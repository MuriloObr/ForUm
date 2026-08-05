import { describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Login } from './Login'

const mocks = vi.hoisted(() => ({
  onError: undefined as ((error: unknown) => void) | undefined,
}))

vi.mock('../api/generated/endpoints', () => ({
  useLogin: ({
    mutation,
  }: {
    mutation: { onError: (error: unknown) => void }
  }) => {
    mocks.onError = mutation.onError
    return { mutate: vi.fn(), isLoading: false }
  },
}))

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

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('shows an invalid-credentials fallback on a 500 error', () => {
    renderLogin()

    act(() => {
      mocks.onError?.(makeAxiosError(500))
    })

    expect(screen.getByText('Usuário ou senha inválidos.')).toBeInTheDocument()
  })

  it('shows an invalid-credentials fallback on a 401 error', () => {
    renderLogin()

    act(() => {
      mocks.onError?.(makeAxiosError(401))
    })

    expect(screen.getByText('Usuário ou senha inválidos.')).toBeInTheDocument()
  })

  it('shows a connection fallback on a network error', () => {
    renderLogin()

    act(() => {
      mocks.onError?.(makeAxiosError())
    })

    expect(
      screen.getByText('Não foi possível conectar ao servidor.'),
    ).toBeInTheDocument()
  })
})
