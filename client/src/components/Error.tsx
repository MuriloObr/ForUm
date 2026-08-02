import { AxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import { Link, isRouteErrorResponse } from 'react-router-dom'

type ErrorContext = 'inline' | 'route'

type ErrorInfo = {
  status: number | null
  heading: string
  body: string
  rawDetail: string
}

function getStatus(error: unknown): number | null {
  if (error instanceof AxiosError) {
    return error.response?.status ?? null
  }
  if (isRouteErrorResponse(error)) {
    return error.status
  }
  return null
}

function getDataMessage(data: unknown): string | null {
  if (data !== null && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message
    return typeof message === 'string' ? message : null
  }
  return null
}

function getRawDetail(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message
  }
  if (isRouteErrorResponse(error)) {
    return getDataMessage(error.data) ?? error.statusText
  }
  if (error instanceof globalThis.Error) {
    return error.message
  }
  return ''
}

function getErrorInfo(error: unknown, context: ErrorContext): ErrorInfo {
  const status = getStatus(error)
  const rawDetail = getRawDetail(error)

  if (status === 401) {
    return {
      status,
      heading: 'Você precisa estar logado para acessar esta página!',
      body: 'Entre novamente para continuar.',
      rawDetail,
    }
  }
  if (status === 404) {
    return {
      status,
      heading: 'Não encontramos o que você estava procurando.',
      body: 'Esta página pode ter sido movida ou removida.',
      rawDetail,
    }
  }
  if (status === 500) {
    return {
      status,
      heading: 'Algo deu errado no servidor.',
      body: 'Tente novamente em instantes.',
      rawDetail,
    }
  }
  if (status === null && error instanceof AxiosError && !error.response) {
    return {
      status,
      heading: 'Não foi possível conectar ao servidor.',
      body: 'Verifique sua conexão com a internet.',
      rawDetail,
    }
  }

  return {
    status,
    heading:
      context === 'route'
        ? 'Algo deu errado.'
        : 'Algo deu errado ao carregar os dados.',
    body: 'Não foi possível carregar esta página. Tente novamente em instantes.',
    rawDetail,
  }
}

type Action = {
  label: string
  to?: string
  onRetry?: () => void
}

function getAction(status: number | null, onRetry?: () => void): Action {
  if (status === 401) {
    return { label: 'Entrar', to: '/login' }
  }
  if (status === 404) {
    return { label: 'Voltar ao início', to: '/' }
  }
  if (onRetry) {
    return { label: 'Tentar novamente', onRetry }
  }
  return { label: 'Voltar ao início', to: '/' }
}

type ErrorProps = {
  error: unknown
  onRetry?: () => void
  context?: ErrorContext
}

export function Error({ error, onRetry, context = 'inline' }: ErrorProps) {
  const { status, heading, body, rawDetail } = getErrorInfo(error, context)
  const action = getAction(status, onRetry)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const HeadingTag = context === 'route' ? 'h1' : 'h2'

  useEffect(() => {
    if (context === 'route') {
      headingRef.current?.focus()
    }
  }, [context])

  const actionButtonClass =
    action.to === '/login'
      ? 'bg-blue-700'
      : action.onRetry !== undefined
        ? 'bg-emerald-700'
        : 'bg-slate-900'

  return (
    <main className="flex w-full flex-1 items-center justify-center bg-slate-800 p-5">
      <div
        role="alert"
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-md bg-white p-5 text-center shadow-md shadow-slate-950"
      >
        <HeadingTag
          ref={headingRef}
          tabIndex={context === 'route' ? -1 : undefined}
          className={`font-bold text-zinc-900 ${
            context === 'route' ? 'text-2xl' : 'text-xl'
          }`}
        >
          {heading}
        </HeadingTag>

        <p className="text-base text-zinc-700">{body}</p>

        {action.to !== undefined ? (
          <Link
            to={action.to}
            className={`rounded-md px-4 py-2 font-bold text-white transition-all duration-150 hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${actionButtonClass}`}
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onRetry}
            className={`rounded-md px-4 py-2 font-bold text-white transition-all duration-150 hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${actionButtonClass}`}
          >
            {action.label}
          </button>
        )}

        {action.onRetry !== undefined && (
          <Link
            to="/"
            className="text-sm text-zinc-500 underline underline-offset-2 transition-colors duration-150 hover:text-zinc-900"
          >
            Voltar ao início
          </Link>
        )}

        {import.meta.env.DEV && rawDetail !== '' && (
          <p className="text-xs text-zinc-500">
            {status !== null ? `Erro ${status} · ${rawDetail}` : rawDetail}
          </p>
        )}
      </div>
    </main>
  )
}
