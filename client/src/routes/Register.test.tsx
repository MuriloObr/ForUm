import { describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Register } from './Register'

const mocks = vi.hoisted(() => ({
  onError: undefined as ((error: unknown) => void) | undefined,
}))

vi.mock('../api/generated/endpoints', () => ({
  useCreateNewUserApiRegisterPost: ({
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

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  )
}

describe('Register', () => {
  it('shows a duplicate/invalid fallback on a 500 error', () => {
    renderRegister()

    act(() => {
      mocks.onError?.(makeAxiosError(500))
    })

    expect(
      screen.getByText('Algo deu errado. Usuário ou email já cadastrados.'),
    ).toBeInTheDocument()
  })

  it('shows a connection fallback on a network error', () => {
    renderRegister()

    act(() => {
      mocks.onError?.(makeAxiosError())
    })

    expect(
      screen.getByText('Não foi possível conectar ao servidor.'),
    ).toBeInTheDocument()
  })
})
