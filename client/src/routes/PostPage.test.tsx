import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { PostPage } from './PostPage'
import { AnswerContext } from '../context/AnswerContext'
import { QueryProbe, waitForIdle } from '../test/queryProbe'
import {
  bestCommentApiCommentsBestPut,
  getGetPostByIDApiPostsPostIDGetQueryKey,
  getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey,
  getGetAllPostsApiPostsGetQueryKey,
} from '../api/generated/endpoints'
import type { PostResponse } from '../api/generated/model/postResponse'
import type { CommentResponse } from '../api/generated/model/commentResponse'

const mocks = vi.hoisted(() => ({
  post: {
    isLoading: false,
    isError: false,
    data: undefined as PostResponse | undefined,
    error: undefined as unknown,
    refetch: vi.fn(),
  },
  comments: {
    data: undefined as CommentResponse[] | undefined,
  },
  profile: {
    data: undefined as { id: number } | undefined,
  },
  onViewPost: undefined as (() => void) | undefined,
  onCreateComment: undefined as (() => void) | undefined,
}))

vi.mock('../api/generated/endpoints', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useGetPostByIDApiPostsPostIDGet: () => mocks.post,
    useGetAllCommentsFromPostApiCommentsPostIDGet: () => mocks.comments,
    useLoggedApiLoggedGet: () => mocks.profile,
    useViewPostApiPostsViewPost: ({
      mutation,
    }: {
      mutation: { onSuccess: () => void }
    }) => {
      mocks.onViewPost = mutation.onSuccess
      return { mutate: vi.fn(), isLoading: false }
    },
    useCreateNewCommentApiPostsCommentPost: ({
      mutation,
    }: {
      mutation: { onSuccess: () => void }
    }) => {
      mocks.onCreateComment = mutation.onSuccess
      return { mutate: vi.fn(), isLoading: false }
    },
    useDeletePostApiPostsDeletePostIDDelete: () => ({
      mutate: vi.fn(),
      isLoading: false,
    }),
    bestCommentApiCommentsBestPut: vi.fn(),
  }
})

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

const sampleComment: CommentResponse = {
  id: 5,
  content: 'A reply',
  post_id: 1,
  user_id: 2,
  created_at: '2026-08-02T00:00:00Z',
  updated_at: '2026-08-02T00:00:00Z',
  like_count: 0,
  is_liked: false,
  user: {
    id: 2,
    nickname: 'Bob',
    username: 'bob',
    email: 'bob@forum.dev',
    created_at: '2026-08-02T00:00:00Z',
    updated_at: '2026-08-02T00:00:00Z',
  },
}

function renderPage({
  answerMode = false,
  probe = null,
}: {
  answerMode?: boolean
  probe?: ReactNode
} = {}) {
  const queryClient = new QueryClient()
  const toggleAnswerMode = vi.fn()
  render(
    <MemoryRouter initialEntries={['/alice/1']}>
      <Routes>
        <Route
          path="/:username/:postID"
          element={
            <QueryClientProvider client={queryClient}>
              <AnswerContext.Provider value={{ answerMode, toggleAnswerMode }}>
                <PostPage />
                {probe}
              </AnswerContext.Provider>
            </QueryClientProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
  return { queryClient, toggleAnswerMode }
}

describe('PostPage', () => {
  it('refreshes the feed when the post gets a view', async () => {
    mocks.post.data = samplePost
    mocks.profile.data = { id: 2 }

    const queryFn = vi.fn().mockReturnValue('feed')
    const { queryClient } = renderPage({
      probe: (
        <QueryProbe
          queryKey={getGetAllPostsApiPostsGetQueryKey()}
          queryFn={queryFn}
        />
      ),
    })

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1))
    await waitForIdle(queryClient, getGetAllPostsApiPostsGetQueryKey())

    mocks.onViewPost?.()

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('refreshes the comments list when a new comment is created', async () => {
    mocks.post.data = samplePost
    mocks.profile.data = { id: 2 }

    const queryFn = vi.fn().mockReturnValue('comments-data')
    const { queryClient } = renderPage({
      probe: (
        <QueryProbe
          queryKey={getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey(1)}
          queryFn={queryFn}
        />
      ),
    })

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1))
    await waitForIdle(
      queryClient,
      getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey(1),
    )

    mocks.onCreateComment?.()

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('refreshes the post after marking a best answer', async () => {
    mocks.post.data = samplePost
    mocks.comments.data = [sampleComment]
    mocks.profile.data = { id: 1 }
    vi.mocked(bestCommentApiCommentsBestPut).mockResolvedValue(samplePost)

    const queryFn = vi.fn().mockReturnValue('post-data')
    const { queryClient, toggleAnswerMode } = renderPage({
      answerMode: true,
      probe: (
        <QueryProbe
          queryKey={getGetPostByIDApiPostsPostIDGetQueryKey(1)}
          queryFn={queryFn}
        />
      ),
    })

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1))
    await waitForIdle(queryClient, getGetPostByIDApiPostsPostIDGetQueryKey(1))

    const answerButton = document.querySelector('input[type="button"]')
    expect(answerButton).not.toBeNull()
    fireEvent.click(answerButton as Element)

    await waitFor(() =>
      expect(bestCommentApiCommentsBestPut).toHaveBeenCalledWith({
        comment_id: 5,
        post_id: 1,
      }),
    )
    expect(toggleAnswerMode).toHaveBeenCalled()
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('renders the error fallback when the request fails', () => {
    mocks.post.data = undefined
    mocks.post.isError = true
    mocks.post.error = new Error('boom')

    renderPage()

    expect(
      screen.getByText('Algo deu errado ao carregar os dados.'),
    ).toBeInTheDocument()
  })
})
