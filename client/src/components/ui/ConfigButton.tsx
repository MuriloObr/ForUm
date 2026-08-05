import { Check, CheckFat, Lock, Trash } from '@phosphor-icons/react'
import {
  useDeletePost,
  togglePostClosed,
  getGetPostQueryKey,
  getGetPostsQueryKey,
  getGetUserPostsQueryKey,
} from '../../api/generated/endpoints'
import { useQueryClient } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import { AnswerContext } from '../../context/AnswerContext'
import { ConfigProps } from '@mytypes/typesComponents'
import { Modal } from '@components/Modal'
import { LoadingSubmit } from '@components/LoadingSubmit'
import { useNavigate } from 'react-router-dom'

export function ConfigButton({ id, closed, name, userID }: ConfigProps) {
  const queryClient = useQueryClient()
  const { answerMode, toggleAnswerMode } = useContext(AnswerContext)
  const navigate = useNavigate()

  const modalRef = useRef<HTMLDialogElement>(null)
  const modalFieldRef = useRef<HTMLInputElement>(null)
  const [statusMessage, setStatusMessage] = useState('')

  const { mutate, isLoading: mutateLoading } = useDeletePost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetPostQueryKey(id),
        })
        queryClient.invalidateQueries({
          queryKey: getGetPostsQueryKey(),
        })
        if (userID !== undefined) {
          queryClient.invalidateQueries({
            queryKey: getGetUserPostsQueryKey(userID),
          })
        }
        navigate('/profile')
      },
      onError: () => {
        setStatusMessage(`Algo deu errado, ou voce não está logado!`)
      },
    },
  })

  async function toggleClosed() {
    try {
      await togglePostClosed({ post_id: id })
      queryClient.invalidateQueries({
        queryKey: getGetPostQueryKey(id),
      })
      queryClient.invalidateQueries({
        queryKey: getGetPostsQueryKey(),
      })
    } catch {
      // error handled silently
    }
  }

  const actionButtonClass =
    'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-white transition-all duration-150 hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400'

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-white/10 pt-4">
        <button
          className={
            actionButtonClass + (closed ? ' bg-emerald-700' : ' bg-purple-600')
          }
          aria-pressed={closed}
          onClick={() => toggleClosed()}
        >
          {closed ? <Check aria-hidden /> : <Lock aria-hidden />}
          {closed ? 'Reabrir' : 'Fechar'}
        </button>
        <button
          className={
            actionButtonClass +
            (answerMode ? ' bg-emerald-600' : ' bg-slate-600')
          }
          aria-pressed={answerMode}
          onClick={() => toggleAnswerMode()}
        >
          <CheckFat aria-hidden />
          Melhor resposta
        </button>
        <button
          className={actionButtonClass + ' bg-red-600'}
          onClick={() => modalRef.current?.showModal()}
        >
          <Trash aria-hidden />
          Excluir
        </button>
      </div>
      <Modal.Root
        ref={modalRef}
        message={statusMessage}
        submitLabel="Deletar"
        tone="danger"
        disabled={mutateLoading}
        onClose={() => setStatusMessage('')}
        onSubmit={() => {
          if (modalFieldRef.current?.value !== name) {
            setStatusMessage('Campo preenchido incorretamente')
            return
          }
          mutate({ postID: id })
        }}
      >
        <Modal.Field
          ref={modalFieldRef}
          type="text"
          label={`Digite "${name}" para confirmar a deleção`}
        />
        <LoadingSubmit isLoading={mutateLoading} />
      </Modal.Root>
    </>
  )
}
