import * as Popover from '@radix-ui/react-popover'
import { GearSix, X } from '@phosphor-icons/react'
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

  return (
    <Popover.Root>
      <Popover.Trigger className="w-fit ml-auto border rounded-md p-2">
        <GearSix className="text-white" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="relative w-fit mt-2 flex flex-col gap-2 pt-2 pb-4 px-3 bg-white border rounded-md text-white">
          <h2 className="mx-auto text-black opacity-80">Options</h2>
          {
            <button
              className={
                'p-1 hover:brightness-90 rounded-md' +
                (closed ? ' bg-emerald-500' : ' bg-purple-600')
              }
              onClick={() => toggleClosed()}
            >
              Mark as {closed ? 'Opened' : 'Closed'}
            </button>
          }
          <button
            className={
              'hover:brightness-90 rounded-md p-1' +
              (answerMode ? ' bg-slate-800' : ' bg-slate-600')
            }
            onClick={() => toggleAnswerMode()}
          >
            Choose Best Answer
          </button>
          <button
            className="bg-red-600 hover:brightness-90 rounded-md p-1"
            onClick={() => modalRef.current?.showModal()}
          >
            Delete Post
          </button>
          <Modal.Root
            ref={modalRef}
            message={statusMessage}
            onSubmit={() => {
              if (modalFieldRef.current?.value !== name) {
                setStatusMessage('Campo preenchido incorretamente')
                return
              }
              mutate({ postID: id })
            }}
            submitLabel="Deletar"
            tone="danger"
            disabled={mutateLoading}
          >
            <Modal.Field
              ref={modalFieldRef}
              type="text"
              label={`Digite "${name}" para confirmar a deleção`}
            />
            <LoadingSubmit isLoading={mutateLoading} />
          </Modal.Root>
          <Popover.Close className="absolute right-2 top-2 p-1 rounded-full hover:bg-black/30">
            <X className="text-black" />
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
