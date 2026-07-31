import { MouseEventHandler, ReactNode } from 'react'

export interface AddButtonProps {
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export type AddModalProps = {
  root: {
    children: ReactNode
    onSubmit: MouseEventHandler
    submitLabel: string
    res: string
  }
  field: {
    type: string
    label: string
  }
  area: {
    label: string
    withMD?: true
  }
}

export interface ConfigProps {
  id: number
  closed: boolean
  name: string
}

export type MyFormProps = {
  root: {
    action: () => void
    cautionMessage?: true
    children: ReactNode
  }
  field: {
    label: string
    type: string
    name: string
  }
}

export type PostProps = {
  root: {
    children: ReactNode
    username: string
    postID: number
  }
  header: {
    children: ReactNode
    closed: boolean
  }
  content: {
    children: ReactNode
  }
  footer: {
    views?: number
    likes?: number
    nickname: string
    createdAt: string
  }
}

export type PostCommentProps = {
  root: {
    children: ReactNode
    isMain?: boolean
  }
  header: {
    id: number
    title: string
    likes?: number
    isClosed: boolean
    isMain?: boolean
  }
  content: {
    children: string | TrustedHTML
    isAnswer?: boolean
  }
  footer: {
    nickname: string
    createdAt: string
  }
}

export type UserCompProps = {
  root: {
    children: ReactNode
  }
  content: {
    username: string
    nickname: string
    email: string
    children: ReactNode
    created_at: string
  }
}

export type MyHoverCardProps = {
  children: ReactNode
  trigger: ReactNode
}
