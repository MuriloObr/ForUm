import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Post, formatMetric } from './Post'

describe('formatMetric', () => {
  it('formats plain counts below 1000 unchanged', () => {
    expect(formatMetric(250)).toBe(250)
  })

  it('abbreviates thousands and millions cleanly', () => {
    expect(formatMetric(1234)).toBe('1.2 k')
    expect(formatMetric(12345)).toBe('12.3 k')
    expect(formatMetric(1200000)).toBe('1.2 M')
    expect(formatMetric(2000000)).toBe('2 M')
  })

  it('renders the engagement ratio as a percentage', () => {
    expect(formatMetric(0.04, true)).toBe('4%')
    expect(formatMetric(0, true)).toBe('0%')
  })

  it('never emits Infinity or NaN percentages', () => {
    expect(formatMetric(Infinity, true)).toBe('0%')
    expect(formatMetric(NaN, true)).toBe('0%')
  })
})

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

  it('shows 0% ratio when there are likes but no views', () => {
    render(
      <Post.Footer
        views={0}
        likes={5}
        nickname="alice"
        createdAt="2026-08-02T00:00:00Z"
      />,
    )

    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
