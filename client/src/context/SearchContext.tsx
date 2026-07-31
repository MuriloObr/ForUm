/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'

interface SearchProps {
  search: string
  setSearch: (value: string) => void
}

export const SearchContext = createContext<SearchProps>({
  search: '',
  setSearch: () => {},
})

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState('')

  function change(value: string) {
    setSearch(value)
  }

  return (
    <SearchContext.Provider value={{ search, setSearch: change }}>
      {children}
    </SearchContext.Provider>
  )
}
