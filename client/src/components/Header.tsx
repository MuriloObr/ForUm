/* eslint-disable import/no-absolute-path */
import searchIcon from '/searchSvg.svg'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SearchContext } from '../context/SearchContext'
import { useGetLoggedUser } from '../api/generated/endpoints'

function SearchField({ className = '' }: { className?: string }) {
  const { search, setSearch } = useContext(SearchContext)

  return (
    <div
      className={`flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1.5 focus-within:border-zinc-400 ${className}`}
    >
      <img
        src={searchIcon}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0 opacity-50"
      />
      <input
        type="search"
        aria-label="Buscar posts"
        placeholder="Buscar posts"
        className="w-full bg-transparent text-base text-white placeholder-zinc-400 outline-none"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
    </div>
  )
}

const navLinkClass = (isActive: boolean) =>
  [
    'relative isolate rounded-md px-1 py-1.5 text-lg font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100 sm:px-2 sm:text-xl',
    "after:absolute after:inset-0 after:z-[-1] after:rounded-md after:bg-white/5 after:origin-left after:scale-x-0 after:content-[''] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)]",
    'hover:after:scale-x-100',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400',
    isActive ? 'text-white' : '',
  ]
    .filter(Boolean)
    .join(' ')

export function Header({ withoutSearchBar }: { withoutSearchBar?: true }) {
  const { data, isLoading } = useGetLoggedUser({
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  })

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-white/10 bg-slate-900 px-4 py-3 shadow-sm shadow-slate-950/20 sm:px-6">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-400"
      >
        <img src="/forUm.svg" alt="ForUm" className="h-9 w-9 invert" />
        <span className="hidden select-none text-xl font-bold text-white sm:inline">
          ForUm
        </span>
      </Link>

      {!withoutSearchBar && (
        <SearchField className="order-last w-full md:order-none md:w-64 lg:w-80 xl:w-96" />
      )}

      <nav className="flex items-center gap-1 sm:gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => navLinkClass(isActive)}
        >
          Posts
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          Sobre
        </NavLink>
        {isLoading ? (
          <span
            aria-hidden="true"
            className="h-9 w-16 animate-pulse rounded-md bg-white/5"
          />
        ) : data ? (
          <NavLink
            to="/profile"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            Perfil
          </NavLink>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-md bg-blue-700 px-3 font-semibold text-white transition-all duration-150 hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="inline-flex h-9 items-center rounded-md border border-amber-500/30 px-3 font-semibold text-amber-500/90 transition-all duration-150 hover:border-amber-500/60 hover:bg-amber-500/5 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              Registrar
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
