import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { PostComment } from './PostComment'
import {
  likePost,
  likeComment,
  unlikePost,
  unlikeComment,
  getGetPostQueryKey,
  getGetPostCommentsQueryKey,
} from '../api/generated/endpoints'
import type { QueryFunction, QueryKey } from '@tanstack/react-query'
import type { ComponentProps } from 'react'

vi.mock('../api/generated/endpoints', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    likePost: vi.fn(),
    likeComment: vi.fn(),
    unlikePost: vi.fn(),
    unlikeComment: vi.fn(),
  }
})

function renderHeader(headerProps: ComponentProps<typeof PostComment.Header>) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <PostComment.Header {...headerProps} />
    </QueryClientProvider>,
  )
}

function renderHeaderWithQuery(
  headerProps: ComponentProps<typeof PostComment.Header>,
  queryKey: QueryKey,
  queryFn: QueryFunction<string>,
) {
  const queryClient = new QueryClient()
  function Harness() {
    useQuery(queryKey, queryFn)
    return <PostComment.Header {...headerProps} />
  }
  return render(
    <QueryClientProvider client={queryClient}>
      <Harness />
    </QueryClientProvider>,
  )
}

function caretAt(index: number): Element {
  return document.querySelectorAll('svg')[index]
}

describe('PostComment Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the like tally', () => {
    renderHeader({
      id: 1,
      postId: 1,
      title: 'Hello',
      likes: 7,
      isClosed: false,
      isMain: true,
    })

    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('highlights the like caret when the current user already liked it', () => {
    renderHeader({
      id: 1,
      postId: 1,
      title: 'Hello',
      isClosed: false,
      isMain: true,
      liked: true,
    })

    expect(caretAt(0).getAttribute('class')).toContain('text-rose-400')
  })

  it('likes the main post and refreshes the post', async () => {
    const queryFn = vi.fn().mockReturnValue('data')
    vi.mocked(likePost).mockResolvedValue(undefined)

    renderHeaderWithQuery(
      {
        id: 1,
        postId: 1,
        title: 'Hello',
        isClosed: false,
        isMain: true,
      },
      getGetPostQueryKey(1),
      queryFn,
    )

    fireEvent.click(caretAt(0))

    await waitFor(() => expect(likePost).toHaveBeenCalledWith({ post_id: 1 }))
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('unlikes the main post and refreshes the post', async () => {
    const queryFn = vi.fn().mockReturnValue('data')
    vi.mocked(unlikePost).mockResolvedValue(undefined)

    renderHeaderWithQuery(
      {
        id: 1,
        postId: 1,
        title: 'Hello',
        isClosed: false,
        isMain: true,
      },
      getGetPostQueryKey(1),
      queryFn,
    )

    fireEvent.click(caretAt(1))

    await waitFor(() => expect(unlikePost).toHaveBeenCalledWith({ post_id: 1 }))
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('likes a comment and refreshes the comments', async () => {
    const queryFn = vi.fn().mockReturnValue('data')
    vi.mocked(likeComment).mockResolvedValue(undefined)

    renderHeaderWithQuery(
      {
        id: 5,
        postId: 1,
        title: 'comentario',
        isClosed: false,
        isMain: false,
      },
      getGetPostCommentsQueryKey(1),
      queryFn,
    )

    fireEvent.click(caretAt(0))

    await waitFor(() =>
      expect(likeComment).toHaveBeenCalledWith({
        comment_id: 5,
      }),
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it('unlikes a comment and refreshes the comments', async () => {
    const queryFn = vi.fn().mockReturnValue('data')
    vi.mocked(unlikeComment).mockResolvedValue(undefined)

    renderHeaderWithQuery(
      {
        id: 5,
        postId: 1,
        title: 'comentario',
        isClosed: false,
        isMain: false,
      },
      getGetPostCommentsQueryKey(1),
      queryFn,
    )

    fireEvent.click(caretAt(1))

    await waitFor(() =>
      expect(unlikeComment).toHaveBeenCalledWith({
        comment_id: 5,
      }),
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })
})
