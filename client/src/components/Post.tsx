/* eslint-disable react-refresh/only-export-components */
import { Check, X, Target, ThumbsUp, TrendUp } from '@phosphor-icons/react'
import { PostProps } from '../types/typesComponents'

function verifyNumbers(num = 0, rel = false) {
  if (rel) {
    const number = (num * 100).toFixed()
    if (isNaN(parseInt(number))) return '0%'
    return `${number}%`
  }
  if (num > 1000000) {
    return `${num.toLocaleString('pt-BR').toString().slice(0, -6)} M`
  }
  if (num > 1000) {
    return `${num.toLocaleString('pt-BR').toString().slice(0, -2)} k`
  } else return num
}

export const Post = {
  Root,
  Header,
  Content,
  Footer,
}

function Root({ children, username, postID }: PostProps['root']) {
  return (
    <a
      href={`/${username}/${postID}`}
      className="h-fit w-3/4 mx-auto p-5 flex flex-col gap-y-4 text-zinc-900 bg-white rounded-md shadow-md 
      hover:shadow-xl hover:shadow-slate-950 shadow-slate-950 hover:cursor-pointer transition-all group/post"
    >
      {children}
    </a>
  )
}

function Header({ children, closed }: PostProps['header']) {
  return (
    <div className="flex items-center mt-1">
      <h2 className="text-xl group-hover/post:underline decoration-2">
        {children}
      </h2>
      <span
        className={
          'ml-auto flex items-center gap-2 p-1 rounded-md text-white font-bold' +
          ` ${closed ? 'bg-emerald-500' : 'bg-purple-600'}`
        }
      >
        {closed
          ? ['Closed', <X size={18} weight="bold" key={'iconX'} />]
          : ['Open', <Check size={18} weight="bold" key={'iconOpen'} />]}
      </span>
    </div>
  )
}

function Content({ children }: PostProps['content']) {
  return <p className="line-clamp-2">{children}</p>
}

function Footer({ views, likes, nickname, createdAt }: PostProps['footer']) {
  const date = new Date(createdAt)
  return (
    <div className="mt-auto">
      <ul className="flex justify-between">
        <span className="mr-4 flex items-center gap-1 text-amber-500">
          {verifyNumbers((likes ?? 0) / (views ?? 1), true)}
          <Target size={18} />
        </span>
        <span className="mr-4 flex items-center gap-1 text-blue-500">
          {verifyNumbers(views ?? 0)}
          <TrendUp size={18} />
        </span>
        <span className="mr-4 flex items-center gap-1 text-rose-500">
          {verifyNumbers(likes)}
          <ThumbsUp size={18} />
        </span>
        <span className="mr-4 ml-auto text-sm">{nickname}</span>
        <span className="text-zinc-700 text-sm">{date.toDateString()}</span>
      </ul>
    </div>
  )
}
