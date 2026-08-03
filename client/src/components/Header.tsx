/* eslint-disable import/no-absolute-path */
import searchIcon from '/searchSvg.svg'
import { useContext } from 'react'
import { SearchContext } from '../context/SearchContext'
import { useGetLoggedUser } from '../api/generated/endpoints'

export function Header({ withoutSearchBar }: { withoutSearchBar?: true }) {
  const { data } = useGetLoggedUser()

  const { search, setSearch } = useContext(SearchContext)

  return (
    <header className="p-4 flex items-center justify-between bg-zinc-900 border-b-2 border-zinc-600">
      <div className="flex items-center gap-2">
        <img src="/forUm.svg" alt="Logo" className="h-10 w-10 invert" />
        <span className="font-black text-2xl text-white select-none">
          ForUm
        </span>
      </div>
      {withoutSearchBar ? (
        ''
      ) : (
        <div className="sm:flex hidden items-center 2xl:w-[64%] lg:w-[55%] md:w-[42%] sm:w-[30%] ml-auto mr-5 py-1.5 px-3 bg-zinc-800 rounded-lg border border-zinc-500 focus-within:border-zinc-300">
          <img src={searchIcon} alt="Buscar" className="h-6 w-6 opacity-60" />
          <input
            type="text"
            className="w-full ml-2 bg-transparent text-lg text-white placeholder-zinc-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
      )}

      <nav className="text-xl text-zinc-100 font-semibold flex 2xl:gap-x-8 sm:gap-x-2 gap-x-0">
        <a
          href={`/`}
          className="py-1.5 sm:px-3 px-1 relative rounded-md transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Posts
        </a>
        <a
          href={`/about`}
          className="py-1.5 sm:px-3 px-1 relative rounded-md transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Sobre
        </a>
        {!data ? (
          <div className="flex gap-x-2">
            <a
              href={`/login`}
              className="font-bold text-blue-400 bg-transparent py-1.5 px-3 rounded-md border-2 border-blue-400/60 hover:bg-blue-400/10 hover:border-blue-400 transition-all duration-150"
            >
              Logar
            </a>
            <a
              href={`/register`}
              className="font-bold text-orange-400 bg-transparent py-1.5 px-3 rounded-md border-2 border-orange-400/60 hover:bg-orange-400/10 hover:border-orange-400 transition-all duration-150"
            >
              Registrar
            </a>
          </div>
        ) : (
          <a
            href={`/profile`}
            className="py-1.5 sm:px-3 px-1 relative rounded-md transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            Profile
          </a>
        )}
      </nav>
    </header>
  )
}
