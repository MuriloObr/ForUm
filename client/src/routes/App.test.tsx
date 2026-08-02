import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { SearchProvider } from '../context/SearchContext'
import { App } from './App'
import type { PostResponse } from '../api/generated/model/postResponse'

const mocks = vi.hoisted(() => ({
  posts: {
    isLoading: false,
    isError: false,
    data: undefined as PostResponse[] | undefined,
    error: undefined as unknown,
  },
}))

vi.mock('../api/generated/endpoints', () => ({
  useGetAllPostsApiPostsGet: () => mocks.posts,
  useCreateNewPostApiPostsCreatePost: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
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

const samplePost: PostResponse = {
  id: 1,
  title: 'Hello ForUm',
  content: 'First post here',
  is_closed: false,
  answer_id: null,
  created_at: '2026-08-02T00:00:00Z',
  updated_at: '2026-08-02T00:00:00Z',
  user_id: 1,
  user: {
    id: 1,
    nickname: 'Alice',
    username: 'alice',
    email: 'alice@forum.dev',
    created_at: '2026-08-02T00:00:00Z',
    updated_at: '2026-08-02T00:00:00Z',
  },
}

function renderApp() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <App />
      </SearchProvider>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('renders the post list on success', () => {
    mocks.posts = {
      isLoading: false,
      isError: false,
      data: [samplePost],
      error: undefined,
    }

    renderApp()

    expect(screen.getByText('Hello ForUm')).toBeInTheDocument()
    expect(screen.getByText('First post here')).toBeInTheDocument()
  })

  it('renders the empty fallback when there are no posts', () => {
    mocks.posts = {
      isLoading: false,
      isError: false,
      data: [],
      error: undefined,
    }

    renderApp()

    expect(screen.getByText('No posts to see...')).toBeInTheDocument()
  })

  it('renders the error fallback when the request fails', () => {
    mocks.posts = {
      isLoading: false,
      isError: true,
      data: undefined,
      error: makeAxiosError(500),
    }

    renderApp()

    expect(
      screen.getByText(
        'Algo deu errado no servidor. Tente novamente em instantes.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the not-logged-in fallback on a 401 error', () => {
    mocks.posts = {
      isLoading: false,
      isError: true,
      data: undefined,
      error: makeAxiosError(401),
    }

    renderApp()

    expect(
      screen.getByText('Você precisa estar logado para acessar esta página!'),
    ).toBeInTheDocument()
  })
})
