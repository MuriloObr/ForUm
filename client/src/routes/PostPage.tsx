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
  useLoggedApiLoggedGet,
  useCreateNewCommentApiPostsCommentPost,
  useViewPostApiPostsViewPost,
  bestCommentApiCommentsBestPut,
  getGetPostByIDApiPostsPostIDGetQueryKey,
  getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey,
  getGetAllPostsApiPostsGetQueryKey,
} from '../api/generated/endpoints'
import { ArrowFatLinesRight } from '@phosphor-icons/react'
import { ConfigButton } from '../components/ui/ConfigButton'
import { AnswerContext } from '../context/AnswerContext'
import { LoadingSubmit } from '../components/LoadingSubmit'
import { markdownPurifiedStr } from '../utils/MDpurifiedHelper'

export function PostPage() {
  const { postID } = useParams()
  const postId = postID === undefined ? 0 : parseInt(postID)

  const {
    isLoading,
    isError,
    data: post,
    error,
    refetch,
  } = useGetPostByIDApiPostsPostIDGet(postId, {
    query: {
      staleTime: 15 * 60 * 1000,
    },
  })

  const { data: comments } = useGetAllCommentsFromPostApiCommentsPostIDGet(
    postId,
    {
      query: {
        enabled: !!post,
        retry: false,
      },
    },
  )

  const { data: profile } = useLoggedApiLoggedGet()

  const [isOwner, setIsOwner] = useState<boolean>(false)
  const { answerMode, toggleAnswerMode } = useContext(AnswerContext)

  const queryClient = useQueryClient()

  const [postHtml, setPostHtml] = useState<string>('')
  const [commentHtmlList, setCommentHtmlList] = useState<string[]>([])

  const { mutate: viewPost } = useViewPostApiPostsViewPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllPostsApiPostsGetQueryKey(),
        })
      },
    },
  })

  useEffect(() => {
    if (postId === 0 || !post) return
    viewPost({ data: { post_id: postId } })
  }, [postId, post, viewPost])

  useEffect(() => {
    if (profile === undefined || post === undefined) return
    setIsOwner(profile.id === post.user_id)
  }, [profile, post])

  useEffect(() => {
    async function renderMarkdown() {
      const purifiedHtml = await markdownPurifiedStr(post?.content ?? '')
      setPostHtml(purifiedHtml)
      const markdownPromises = (comments ?? []).map(({ content }) =>
        markdownPurifiedStr(content),
      )
      const markdownResults = await Promise.allSettled(markdownPromises)
      setCommentHtmlList(
        markdownResults.map((promise) => {
          if (promise.status === 'fulfilled') {
            return promise.value
          } else {
            return ''
          }
        }),
      )
    }
    renderMarkdown()
  }, [post?.content, comments])

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [commentMessage, setCommentMessage] = useState<string>('')

  const { mutate, isLoading: mutateLoading } =
    useCreateNewCommentApiPostsCommentPost({
      mutation: {
        onSuccess: () => {
          modalRef.current?.close()
          queryClient.invalidateQueries({
            queryKey:
              getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey(postId),
          })
        },
        onError: (error) => {
          if (error.response?.status === 401) {
            setCommentMessage('Você precisa estar logado para comentar!')
          }
        },
      },
    })

  async function markAsBestAnswer(id: number) {
    try {
      await bestCommentApiCommentsBestPut({
        comment_id: id,
        post_id: postId,
      })
      toggleAnswerMode()
      queryClient.invalidateQueries({
        queryKey: getGetPostByIDApiPostsPostIDGetQueryKey(postId),
      })
    } catch {
      // error handled silently
    }
  }

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} onRetry={refetch} />
  }

  return (
    <main className="w-full p-5 bg-slate-800 text-zinc-900 flex-1 relative">
      <ul className="h-fit flex flex-col">
        {post === undefined ? (
          ''
        ) : (
          <>
            {isOwner ? (
              <ConfigButton
                id={post.id}
                closed={post.is_closed}
                name={post.title}
                userID={profile?.id}
              />
            ) : (
              ''
            )}
            <PostComment.Root isMain={true} key={post.id}>
              <PostComment.Header
                id={post.id}
                postId={postId}
                title={post.title}
                likes={post.like_count}
                liked={post.is_liked}
                isClosed={post.is_closed}
                isMain={true}
              />
              <PostComment.Content>{postHtml}</PostComment.Content>
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
                      {isOwner && answerMode ? (
                        <div className="flex absolute -left-10">
                          <input
                            type="button"
                            className="appearance-none h-8 w-8 rounded-full bg-emerald-500 hover:brightness-90"
                            onClick={() => markAsBestAnswer(comment.id)}
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
                        postId={postId}
                        title="comentario"
                        likes={comment.like_count}
                        liked={comment.is_liked}
                        isClosed={false}
                        isMain={false}
                      />
                      <PostComment.Content
                        isAnswer={post.answer_id === comment.id}
                      >
                        {commentHtmlList[i]}
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
          message={commentMessage}
          submitLabel="Comentar"
          onSubmit={() =>
            mutate({
              data: {
                post_id: postId,
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
