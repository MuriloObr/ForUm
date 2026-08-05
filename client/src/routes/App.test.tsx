import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { SearchProvider } from '../context/SearchContext'
import { App } from './App'
import { getGetPostsQueryKey } from '../api/generated/endpoints'
import { QueryProbe, waitForIdle } from '../test/queryProbe'
import type { PostResponse } from '../api/generated/model/postResponse'

const mocks = vi.hoisted(() => ({
  posts: {
    isLoading: false,
    isError: false,
    data: undefined as PostResponse[] | undefined,
    error: undefined as unknown,
  },
  onCreatePost: undefined as (() => void) | undefined,
}))

vi.mock('../api/generated/endpoints', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useGetPosts: () => mocks.posts,
    useCreatePost: ({ mutation }: { mutation: { onSuccess: () => void } }) => {
      mocks.onCreatePost = mutation.onSuccess
      return { mutate: vi.fn(), isLoading: false }
    },
  }
})

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
  like_count: 0,
  view_count: 0,
  is_liked: false,
}

function renderApp() {
  const queryClient = new QueryClient()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <SearchProvider>
          <App />
        </SearchProvider>
      </QueryClientProvider>
    </MemoryRouter>,
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

  it('shows real view and like counts on post cards', () => {
    mocks.posts = {
      isLoading: false,
      isError: false,
      data: [{ ...samplePost, view_count: 250, like_count: 10 }],
      error: undefined,
    }

    renderApp()

    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders the empty fallback when there are no posts', () => {
    mocks.posts = {
      isLoading: false,
      isError: false,
      data: [],
      error: undefined,
    }

    renderApp()

    expect(screen.getByText('Nenhum post ainda')).toBeInTheDocument()
  })

  it('refreshes the feed when a new post is created', async () => {
    mocks.posts = {
      isLoading: false,
      isError: false,
      data: [samplePost],
      error: undefined,
    }

    const feedQueryFn = vi.fn().mockReturnValue('feed')

    const queryClient = new QueryClient()
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SearchProvider>
            <App />
            <QueryProbe
              queryKey={getGetPostsQueryKey()}
              queryFn={feedQueryFn}
            />
          </SearchProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    )

    await waitForIdle(queryClient, getGetPostsQueryKey())
    expect(feedQueryFn).toHaveBeenCalledTimes(1)

    mocks.onCreatePost?.()

    await waitFor(() => expect(feedQueryFn).toHaveBeenCalledTimes(2))
  })

  it('renders the error fallback when the request fails', () => {
    mocks.posts = {
      isLoading: false,
      isError: true,
      data: undefined,
      error: makeAxiosError(500),
    }

    renderApp()

    expect(screen.getByText('Algo deu errado no servidor.')).toBeInTheDocument()
    expect(
      screen.getByText('Tente novamente em instantes.'),
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
