import {
  useGetLoggedUser,
  useGetUserPosts,
  useLogout,
} from '../api/generated/endpoints'
import { UserComponent } from '../components/UserComponent'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { SignOut } from '@phosphor-icons/react'
import { Post } from '../components/Post'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const {
    isLoading,
    isError,
    data: user,
    error,
    refetch,
  } = useGetLoggedUser({
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  })

  const { data: posts } = useGetUserPosts(user?.id ?? 0, {
    query: {
      enabled: user?.id !== undefined,
    },
  })

  const navigate = useNavigate()

  const { mutate: logout } = useLogout({
    mutation: {
      onSuccess: () => navigate('/'),
    },
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error error={error} onRetry={refetch} />
  }

  return (
    <main className="w-full bg-slate-800 flex-1">
      {user === undefined ? (
        ''
      ) : (
        <>
          <UserComponent.Root>
            <UserComponent.Content
              username={user.username}
              nickname={user.nickname}
              email={user.email}
              created_at={user.created_at}
            >
              <ul className="w-[60vw] flex flex-col gap-4">
                {posts === undefined
                  ? ''
                  : posts.map((post) => (
                      <Post.Root
                        username={post.user.username}
                        postID={post.id}
                        key={post.id}
                      >
                        <Post.Header closed={post.is_closed}>
                          {post.title}
                        </Post.Header>
                        <Post.Content>{post.content}</Post.Content>
                        <Post.Footer
                          views={post.view_count}
                          likes={post.like_count}
                          createdAt={post.created_at}
                          nickname={post.user.nickname}
                        />
                      </Post.Root>
                    ))}
              </ul>
            </UserComponent.Content>
          </UserComponent.Root>
          <button
            className="w-fit p-5 flex items-center gap-2 text-3xl font-bold text-zinc-100 mx-auto"
            onClick={() => logout()}
          >
            Logout
            <SignOut />
          </button>
        </>
      )}
    </main>
  )
}
