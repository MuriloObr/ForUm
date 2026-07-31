import type { Meta, StoryObj } from '@storybook/react'

import { ConfigButton } from './ConfigButton'
import { AnswerProvider } from '../../context/AnswerContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IconContext } from '@phosphor-icons/react'
import { MemoryRouter } from 'react-router-dom'

const client = new QueryClient()

const meta: Meta<typeof ConfigButton> = {
  component: ConfigButton,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={client}>
          <IconContext.Provider value={{ size: 16, color: 'black' }}>
            <AnswerProvider>{Story()}</AnswerProvider>
          </IconContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ConfigButton>

export const Default: Story = {
  args: {
    id: 1,
    closed: false,
    name: 'ConfigButton',
  },
}
