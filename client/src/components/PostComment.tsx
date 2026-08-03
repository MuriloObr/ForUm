/* eslint-disable react-refresh/only-export-components */
import {
  X,
  Check,
  CaretUp,
  CaretDown,
  FunnelSimple,
  CheckFat,
} from '@phosphor-icons/react'
import {
  likePostApiPostsLikePost,
  likeCommentApiCommentsLikePost,
  unlikePostApiPostsLikeDelete,
  unlikeCommentApiCommentsLikeDelete,
  getGetPostByIDApiPostsPostIDGetQueryKey,
  getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey,
  getGetAllPostsApiPostsGetQueryKey,
} from '../api/generated/endpoints'
import { useQueryClient } from '@tanstack/react-query'
import { PostCommentProps } from '../types/typesComponents'

export const PostComment = {
  Root,
  Header,
  Content,
  Footer,
}

function Root({ children, isMain = false }: PostCommentProps['root']) {
  return (
    <div
      className={
        'w-5/6 mx-auto my-8 p-5 bg-white rounded-md relative' +
        (isMain ? ' mb-10' : ' flex items-center gap-5')
      }
    >
      {children}
      {isMain ? (
        <FunnelSimple
          size={32}
          className="text-white absolute -bottom-8 inset-x-0 mx-auto"
        />
      ) : (
        ''
      )}
    </div>
  )
}

function Header({
  id,
  title,
  likes = 0,
  liked = false,
  isClosed,
  isMain = false,
  postId,
}: PostCommentProps['header']) {
  const queryClient = useQueryClient()

  function refreshPostLikes() {
    queryClient.invalidateQueries({
      queryKey: getGetPostByIDApiPostsPostIDGetQueryKey(postId),
    })
    queryClient.invalidateQueries({
      queryKey: getGetAllPostsApiPostsGetQueryKey(),
    })
  }

  function refreshCommentLikes() {
    queryClient.invalidateQueries({
      queryKey: getGetAllCommentsFromPostApiCommentsPostIDGetQueryKey(postId),
    })
  }

  return (
    <div className="flex justify-between items-center gap-5">
      <span className="flex flex-col items-center">
        <CaretUp
          size={32}
          className={
            'border-transparent border rounded-md hover:border-zinc-500/70 transition-all cursor-pointer' +
            (liked ? ' text-rose-500' : '')
          }
          onClick={async () => {
            try {
              if (isMain) {
                await likePostApiPostsLikePost({ post_id: postId })
                refreshPostLikes()
              } else {
                await likeCommentApiCommentsLikePost({ comment_id: id })
                refreshCommentLikes()
              }
            } catch {
              // error handled silently
            }
          }}
        />
        <span className="select-none">{likes}</span>
        <CaretDown
          size={32}
          className="border-transparent border rounded-md hover:border-zinc-500/70 transition-all cursor-pointer"
          onClick={async () => {
            try {
              if (isMain) {
                await unlikePostApiPostsLikeDelete({ post_id: postId })
                refreshPostLikes()
              } else {
                await unlikeCommentApiCommentsLikeDelete({ comment_id: id })
                refreshCommentLikes()
              }
            } catch {
              // error handled silently
            }
          }}
        />
      </span>
      {isMain ? (
        <>
          <h1 className="mr-auto text-2xl">{title}</h1>
          <span
            className={
              'h-fit flex items-center gap-2 p-2 rounded-md text-white font-bold' +
              ` ${isClosed ? 'bg-emerald-500' : 'bg-purple-600'}`
            }
          >
            {isClosed
              ? ['Closed', <X size={18} weight="bold" key={'iconX'} />]
              : ['Open', <Check size={18} weight="bold" key={'iconOpen'} />]}
          </span>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

function Content({ children, isAnswer }: PostCommentProps['content']) {
  return (
    <p className="mt-5 mb-5 flex items-center gap-2">
      <pre
        className="font-[inherit] markdown"
        dangerouslySetInnerHTML={{ __html: children }}
      ></pre>
      {isAnswer ? <CheckFat className="text-emerald-500" size={32} /> : ''}
    </p>
  )
}

function Footer({ nickname, createdAt }: PostCommentProps['footer']) {
  const date = new Date(createdAt)
  return (
    <div className="w-fit ml-auto flex gap-5 self-end">
      <span className="hover:underline cursor-pointer">{nickname}</span>
      <span>{date.toDateString()}</span>
    </div>
  )
}
