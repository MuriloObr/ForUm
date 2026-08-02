/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'

interface AnswerModeProps {
  answerMode: boolean
  toggleAnswerMode: () => void
}

export const AnswerContext = createContext<AnswerModeProps>({
  answerMode: false,
  toggleAnswerMode: () => {},
})

export const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [answerMode, setAnswerMode] = useState(false)

  function toggleAnswerMode() {
    setAnswerMode((state) => !state)
  }

  return (
    <AnswerContext.Provider value={{ answerMode, toggleAnswerMode }}>
      {children}
    </AnswerContext.Provider>
  )
}
