import { useContext, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SearchContext } from "../context/SearchContext.tsx";
import {
  useGetAllPostsApiPostsGet,
  useCreateNewPostApiPostsCreatePost,
} from "../api/generated/endpoints";
import { Post } from "../components/Post.tsx";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { AddButton } from "../components/ui/AddButton";
import { Modal } from "../components/Modal";
import { LoadingSubmit } from "../components/LoadingSubmit.tsx";

export function App() {
  const {
    isLoading: dataLoading,
    isError,
    data,
    error,
  } = useGetAllPostsApiPostsGet({
    query: {
      retry: 5,
      staleTime: 30 * 60 * 1000,
    },
  });

  const queryClient = useQueryClient();

  const { search } = useContext(SearchContext);

  const modalRef = useRef<HTMLDialogElement>(null);
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [postStatus, setPostStatus] = useState<string>("");

  const { mutate, isLoading: mutateLoading } =
    useCreateNewPostApiPostsCreatePost({
      mutation: {
        onSuccess: () => {
          modalRef.current?.close();
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
          if (error.response?.status === 401) {
            setPostStatus("Você precisa estar logado para postar!");
          }
        },
      },
    });

  const filteredPosts =
    search.length > 0
      ? data?.filter(({ title }) =>
          title.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  if (dataLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  return (
    <main className="w-full p-5 bg-slate-800 flex-1">
      <ul className="h-fit flex flex-col gap-5">
        {search.length > 0 ? (
          filteredPosts?.map(
            ({ id, title, content, user, is_closed, created_at }) => {
              return (
                <Post.Root username={user.username} postID={id} key={id}>
                  <Post.Header closed={is_closed}>{title}</Post.Header>
                  <Post.Content>{content}</Post.Content>
                  <Post.Footer
                    createdAt={created_at}
                    nickname={user.nickname}
                  />
                </Post.Root>
              );
            },
          )
        ) : data === undefined || data === "" ? (
          <div>No posts to see...</div>
        ) : (
          data.map(({ id, title, content, user, is_closed, created_at }) => {
            return (
              <Post.Root username={user.username} postID={id} key={id}>
                <Post.Header closed={is_closed}>{title}</Post.Header>
                <Post.Content>{content.replaceAll("#", "")}</Post.Content>
                <Post.Footer createdAt={created_at} nickname={user.nickname} />
              </Post.Root>
            );
          })
        )}
        <AddButton
          text="+ Post"
          className="mr-10"
          onClick={() => modalRef.current?.showModal()}
        />
        <Modal.Root
          ref={modalRef}
          res={postStatus}
          submitLabel="Postar"
          onSubmit={() =>
            mutate({
              data: {
                title: inputTitleRef.current?.value ?? "",
                content: inputTextareaRef.current?.value ?? "",
              },
            })
          }
        >
          <Modal.Field label="Titulo" type="text" ref={inputTitleRef} />
          <Modal.Area label="Conteúdo" withMD ref={inputTextareaRef} />
          <LoadingSubmit isLoading={mutateLoading} />
        </Modal.Root>
      </ul>
    </main>
  );
}
