/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'

interface AnswerProps {
  answer: boolean
  setAnswer: () => void
}

export const AnswerContext = createContext<AnswerProps>({
  answer: false,
  setAnswer: () => {},
})

export const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [answer, setAnswer] = useState(false)

  function change() {
    setAnswer((state) => !state)
  }

  return (
    <AnswerContext.Provider value={{ answer, setAnswer: change }}>
      {children}
    </AnswerContext.Provider>
  )
}
