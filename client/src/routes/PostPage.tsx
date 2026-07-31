import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { PostComment } from '../components/PostComment'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { AddButton } from '../components/ui/AddButton'
import { Modal } from '../components/Modal'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  useGetPostByIDApiPostsPostIDGet,
  useGetAllCommentsFromPostApiCommentsPostIDGet,
  useProfileApiProfileGet,
  useCreateNewCommentApiPostsCommentPost,
  useViewPostApiPostsViewPost,
  bestCommentApiCommentsBestPut,
} from '../api/generated/endpoints'
import { ArrowFatLinesRight } from '@phosphor-icons/react'
import { ConfigButton } from '../components/ui/ConfigButton'
import { AnswerContext } from '../context/AnswerContext'
import { LoadingSubmit } from '../components/LoadingSubmit'
import { markdownPurifiedStr } from '../utils/MDpurifiedHelper'

export function PostPage() {
  const { postID } = useParams()
  const parsedPostID = postID === undefined ? 0 : parseInt(postID)

  const {
    isLoading,
    isError,
    data: post,
    error,
  } = useGetPostByIDApiPostsPostIDGet(parsedPostID, {
    query: {
      staleTime: 15 * 60 * 1000,
    },
  })

  const { data: comments } = useGetAllCommentsFromPostApiCommentsPostIDGet(
    parsedPostID,
    {
      query: {
        enabled: !!post,
        retry: false,
      },
    },
  )

  const { data: profile } = useProfileApiProfileGet()

  const [owner, setOwner] = useState<boolean>(false)
  const { answer, setAnswer } = useContext(AnswerContext)

  const queryClient = useQueryClient()

  const [MainMDCont, setMainMDCont] = useState<string>('')
  const [CommentMDCont, setCommentMDCont] = useState<string[]>([])

  const { mutate: viewPost } = useViewPostApiPostsViewPost({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    },
  })

  useEffect(() => {
    if (parsedPostID === 0 || !post) return
    viewPost({ data: { post_id: parsedPostID } })
  }, [parsedPostID, post, viewPost])

  useEffect(() => {
    if (profile === undefined || post === undefined) return
    setOwner(profile.id === post.user_id)
  }, [profile, post])

  useEffect(() => {
    async function parseContMD() {
      const MDstr = await markdownPurifiedStr(post?.content ?? '')
      setMainMDCont(MDstr)
      const PromiseListMDstr = (comments ?? []).map(({ content }) =>
        markdownPurifiedStr(content),
      )
      const ListMDstr = await Promise.allSettled(PromiseListMDstr)
      setCommentMDCont(
        ListMDstr.map((promise) => {
          if (promise.status === 'fulfilled') {
            return promise.value
          } else {
            return ''
          }
        }),
      )
    }
    parseContMD()
  }, [post?.content, comments])

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [commentStatus, setCommentStatus] = useState<string>('')

  const { mutate, isLoading: mutateLoading } =
    useCreateNewCommentApiPostsCommentPost({
      mutation: {
        onSuccess: () => {
          modalRef.current?.close()
          queryClient.invalidateQueries({ queryKey: ['post'] })
        },
        onError: (error) => {
          if (error.response?.status === 401) {
            setCommentStatus('Você precisa estar logado para comentar!')
          }
        },
      },
    })

  async function melhorResposta(id: number) {
    try {
      await bestCommentApiCommentsBestPut({
        comment_id: id,
        post_id: parsedPostID,
      })
      setAnswer()
      queryClient.invalidateQueries({ queryKey: ['post'] })
    } catch {
      // error handled silently
    }
  }

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} />
  }

  return (
    <main className="w-full p-5 bg-slate-800 text-zinc-900 flex-1 relative">
      <ul className="h-fit flex flex-col">
        {post === undefined ? (
          ''
        ) : (
          <>
            {owner ? (
              <ConfigButton
                id={post.id}
                closed={post.is_closed}
                name={post.title}
              />
            ) : (
              ''
            )}
            <PostComment.Root isMain={true} key={post.id}>
              <PostComment.Header
                id={post.id}
                title={post.title}
                isClosed={post.is_closed}
                isMain={true}
              />
              <PostComment.Content>{MainMDCont}</PostComment.Content>
              <PostComment.Footer
                nickname={post.user.nickname}
                createdAt={post.created_at}
              />
            </PostComment.Root>
            {comments &&
              comments.map((comment, i) => {
                return (
                  <>
                    <PostComment.Root isMain={false} key={comment.id}>
                      {owner && answer ? (
                        <div className="flex absolute -left-10">
                          <input
                            type="button"
                            className="appearance-none h-8 w-8 rounded-full bg-emerald-500 hover:brightness-90"
                            onClick={() => melhorResposta(comment.id)}
                          />
                          <ArrowFatLinesRight
                            size={24}
                            className="absolute inset-0 m-auto pointer-events-none text-white"
                          />
                        </div>
                      ) : (
                        ''
                      )}
                      <PostComment.Header
                        id={comment.id}
                        title="comentario"
                        isClosed={false}
                        isMain={false}
                      />
                      <PostComment.Content
                        isAnswer={post.answer_id === comment.id}
                      >
                        {CommentMDCont[i]}
                      </PostComment.Content>
                      <PostComment.Footer
                        nickname={comment.user?.nickname ?? ''}
                        createdAt={comment.created_at}
                      />
                    </PostComment.Root>
                  </>
                )
              })}
          </>
        )}
        <AddButton
          text="+ Comment"
          className="right-0 mr-10"
          onClick={() => modalRef.current?.showModal()}
        />
        <Modal.Root
          ref={modalRef}
          res={commentStatus}
          submitLabel="Comentar"
          onSubmit={() =>
            mutate({
              data: {
                post_id: parsedPostID,
                content: inputTextareaRef.current?.value ?? '',
              },
            })
          }
        >
          <Modal.Area withMD label="Conteudo" ref={inputTextareaRef} />
          <LoadingSubmit isLoading={mutateLoading} />
        </Modal.Root>
      </ul>
    </main>
  )
}
