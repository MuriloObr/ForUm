/* eslint-disable react-refresh/only-export-components */
import { Check, X, Target, ThumbsUp, TrendUp } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { PostProps } from '../types/typesComponents'

export function formatMetric(value = 0, isRatio = false) {
  if (isRatio) {
    if (!Number.isFinite(value)) return '0%'
    return `${Math.round(value * 100)}%`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')} M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')} k`
  }
  return value
}

function formatRelativeDate(date: Date) {
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))
  if (minutes < 1) return 'agora mesmo'
  if (minutes < 60) return `${minutes} min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h atrás`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} d atrás`
  return date.toLocaleDateString('pt-BR')
}

export const Post = {
  Root,
  Header,
  Content,
  Footer,
}

function Root({ children, username, postID }: PostProps['root']) {
  return (
    <Link
      to={`/${encodeURIComponent(username)}/${postID}`}
      className="h-fit w-3/4 mx-auto p-5 flex flex-col gap-y-4 text-zinc-200 bg-slate-900 rounded-md border border-white/10
      hover:border-white/25 transition-all group/post
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
    >
      {children}
    </Link>
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
          ` ${closed ? 'bg-emerald-700' : 'bg-purple-600'}`
        }
      >
        {closed
          ? ['Fechado', <X size={18} weight="bold" key={'iconX'} />]
          : ['Aberto', <Check size={18} weight="bold" key={'iconOpen'} />]}
      </span>
    </div>
  )
}

function Content({ children }: PostProps['content']) {
  return <p className="line-clamp-2">{children}</p>
}

function Footer({ views, likes, nickname, createdAt }: PostProps['footer']) {
  const ratio = (views ?? 0) > 0 ? (likes ?? 0) / (views ?? 0) : 0
  const date = new Date(createdAt)
  return (
    <div className="mt-auto">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-4">
          <span
            className="flex items-center gap-1 text-amber-400"
            title="Proporção de curtidas por visualização"
          >
            {formatMetric(ratio, true)}
            <Target size={18} aria-hidden />
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            {formatMetric(views)}
            <TrendUp size={18} aria-hidden />
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            {formatMetric(likes)}
            <ThumbsUp size={18} aria-hidden />
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-zinc-100">{nickname}</span>
          <span aria-hidden>·</span>
          <span>{formatRelativeDate(date)}</span>
        </div>
      </div>
    </div>
  )
}
