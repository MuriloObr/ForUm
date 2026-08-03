import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Profile } from './Profile'
import type { UserResponse } from '../api/generated/model/userResponse'
import type { PostResponse } from '../api/generated/model/postResponse'

const sampleUser: UserResponse = {
  id: 1,
  nickname: 'Alice',
  username: 'alice',
  email: 'alice@forum.dev',
  created_at: '2026-08-02T00:00:00Z',
  updated_at: '2026-08-02T00:00:00Z',
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
  user: sampleUser,
  like_count: 10,
  view_count: 250,
  is_liked: false,
}

const mocks = vi.hoisted(() => ({
  user: undefined as unknown,
  posts: undefined as unknown,
}))

vi.mock('../api/generated/endpoints', () => ({
  useGetLoggedUser: () => mocks.user,
  useGetUserPosts: () => mocks.posts,
  useLogout: () => ({ mutate: vi.fn() }),
}))

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  )
}

describe('Profile', () => {
  it('shows real view and like counts on the user post cards', () => {
    mocks.user = {
      isLoading: false,
      isError: false,
      data: sampleUser,
      error: undefined,
      refetch: vi.fn(),
    }
    mocks.posts = { data: [samplePost] }

    renderProfile()

    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
