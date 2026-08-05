import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ConfigButton } from './ConfigButton'
import { AnswerContext } from '../../context/AnswerContext'
import { QueryProbe, waitForIdle } from '../../test/queryProbe'
import {
  togglePostClosed,
  getGetPostQueryKey,
  getGetPostsQueryKey,
  getGetUserPostsQueryKey,
} from '../../api/generated/endpoints'
import type { PostResponse } from '../../api/generated/model/postResponse'

const samplePost: PostResponse = {
  id: 7,
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

const mocks = vi.hoisted(() => ({
  onDelete: undefined as (() => void) | undefined,
}))

vi.mock('../../api/generated/endpoints', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useDeletePost: ({ mutation }: { mutation: { onSuccess: () => void } }) => {
      mocks.onDelete = mutation.onSuccess
      return { mutate: vi.fn(), isLoading: false }
    },
    togglePostClosed: vi.fn(),
  }
})

function renderConfig({
  probe = null,
  closed = false,
}: {
  probe?: ReactNode
  closed?: boolean
} = {}) {
  const queryClient = new QueryClient()
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <QueryClientProvider client={queryClient}>
              <AnswerContext.Provider
                value={{ answerMode: false, toggleAnswerMode: vi.fn() }}
              >
                <ConfigButton id={7} closed={closed} name="Hello" userID={7} />
                {probe}
              </AnswerContext.Provider>
            </QueryClientProvider>
          }
        />
        <Route path="/profile" element={<div>profile marker</div>} />
      </Routes>
    </MemoryRouter>,
  )
  return { queryClient }
}

describe('ConfigButton', () => {
  it('refreshes the feed and the profile list after deleting a post', async () => {
    const feedQueryFn = vi.fn().mockReturnValue('feed')
    const userPostsQueryFn = vi.fn().mockReturnValue('user-posts')
    const { queryClient } = renderConfig({
      probe: (
        <>
          <QueryProbe queryKey={getGetPostsQueryKey()} queryFn={feedQueryFn} />
          <QueryProbe
            queryKey={getGetUserPostsQueryKey(7)}
            queryFn={userPostsQueryFn}
          />
        </>
      ),
    })

    await waitFor(() => expect(feedQueryFn).toHaveBeenCalledTimes(1))
    await waitForIdle(queryClient, getGetPostsQueryKey())
    await waitForIdle(queryClient, getGetUserPostsQueryKey(7))

    mocks.onDelete?.()

    await waitFor(() => expect(feedQueryFn).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(userPostsQueryFn).toHaveBeenCalledTimes(2))
    expect(screen.getByText('profile marker')).toBeInTheDocument()
  })

  it('shows the owner actions inline without opening a menu', () => {
    renderConfig()

    expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /melhor resposta/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()
  })

  it('reflects the closed state on the reopen toggle', () => {
    renderConfig({ closed: true })

    const toggle = screen.getByRole('button', { name: /reabrir/i })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('refreshes the post after closing or reopening it', async () => {
    vi.mocked(togglePostClosed).mockResolvedValue(samplePost)

    const queryFn = vi.fn().mockReturnValue('post-data')
    const { queryClient } = renderConfig({
      probe: <QueryProbe queryKey={getGetPostQueryKey(7)} queryFn={queryFn} />,
    })

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1))
    await waitForIdle(queryClient, getGetPostQueryKey(7))

    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))

    await waitFor(() =>
      expect(togglePostClosed).toHaveBeenCalledWith({
        post_id: 7,
      }),
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })
})
