import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Post } from './Post'

describe('Post Footer', () => {
  it('shows view and like counts and the engagement ratio', () => {
    render(
      <Post.Footer
        views={250}
        likes={10}
        nickname="alice"
        createdAt="2026-08-02T00:00:00Z"
      />,
    )

    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('4%')).toBeInTheDocument()
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('shows zeroed metrics when no counts are provided', () => {
    render(<Post.Footer nickname="alice" createdAt="2026-08-02T00:00:00Z" />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
