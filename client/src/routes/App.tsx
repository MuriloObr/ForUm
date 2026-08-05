import { useContext, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SearchContext } from '../context/SearchContext.tsx'
import {
  useGetPosts,
  useCreatePost,
  getGetPostsQueryKey,
} from '../api/generated/endpoints'
import { Post } from '../components/Post.tsx'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { AddButton } from '../components/ui/AddButton'
import { Modal } from '../components/Modal'
import { LoadingSubmit } from '../components/LoadingSubmit.tsx'

export function App() {
  const {
    isLoading: dataLoading,
    isError,
    data,
    error,
    refetch,
  } = useGetPosts({
    query: {
      retry: 5,
      staleTime: 30 * 60 * 1000,
    },
  })

  const queryClient = useQueryClient()

  const { search } = useContext(SearchContext)

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTitleRef = useRef<HTMLInputElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [postMessage, setPostMessage] = useState<string>('')
  const [titleValue, setTitleValue] = useState('')
  const [contentValue, setContentValue] = useState('')

  const { mutate, isLoading: mutateLoading } = useCreatePost({
    mutation: {
      onSuccess: () => {
        modalRef.current?.close()
        queryClient.invalidateQueries({
          queryKey: getGetPostsQueryKey(),
        })
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          setPostMessage('Você precisa estar logado para postar!')
        } else {
          setPostMessage('Não foi possível postar. Tente novamente.')
        }
      },
    },
  })

  const filteredPosts =
    search.length > 0
      ? data?.filter(({ title }) =>
          title.toLowerCase().includes(search.toLowerCase()),
        )
      : []

  if (dataLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} onRetry={refetch} />
  }

  return (
    <main className="w-full p-5 bg-slate-800 flex-1">
      <div className="h-fit flex flex-col gap-5">
        {search.length > 0 ? (
          filteredPosts?.map(
            ({
              id,
              title,
              content,
              user,
              is_closed,
              created_at,
              view_count,
              like_count,
            }) => {
              return (
                <Post.Root username={user.username} postID={id} key={id}>
                  <Post.Header closed={is_closed}>{title}</Post.Header>
                  <Post.Content>{content}</Post.Content>
                  <Post.Footer
                    views={view_count}
                    likes={like_count}
                    createdAt={created_at}
                    nickname={user.nickname}
                  />
                </Post.Root>
              )
            },
          )
        ) : data === undefined || data.length === 0 ? (
          <div>No posts to see...</div>
        ) : (
          data.map(
            ({
              id,
              title,
              content,
              user,
              is_closed,
              created_at,
              view_count,
              like_count,
            }) => {
              return (
                <Post.Root username={user.username} postID={id} key={id}>
                  <Post.Header closed={is_closed}>{title}</Post.Header>
                  <Post.Content>{content.replaceAll('#', '')}</Post.Content>
                  <Post.Footer
                    views={view_count}
                    likes={like_count}
                    createdAt={created_at}
                    nickname={user.nickname}
                  />
                </Post.Root>
              )
            },
          )
        )}
        <AddButton
          text="+ Postar"
          position="fab"
          onClick={() => {
            setPostMessage('')
            modalRef.current?.showModal()
          }}
        />
        <Modal.Root
          ref={modalRef}
          message={postMessage}
          submitLabel="Postar"
          disabled={
            mutateLoading ||
            titleValue.trim() === '' ||
            contentValue.trim() === ''
          }
          onClose={() => setPostMessage('')}
          onSubmit={() =>
            mutate({
              data: {
                title: inputTitleRef.current?.value ?? '',
                content: inputTextareaRef.current?.value ?? '',
              },
            })
          }
        >
          <Modal.Field
            label="Título"
            type="text"
            ref={inputTitleRef}
            onChange={setTitleValue}
          />
          <Modal.Area
            label="Conteúdo"
            withMD
            ref={inputTextareaRef}
            onChange={setContentValue}
          />
          <LoadingSubmit isLoading={mutateLoading} />
        </Modal.Root>
      </div>
    </main>
  )
}
