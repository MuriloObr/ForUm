import jwt
from os import getenv
from pathlib import Path
from typing import Annotated, Union
from fastapi import FastAPI, Cookie, Depends, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from src.comment_actions import create_new_comment, get_all_comments_from_post, like_comment, rm_like_comment
from src.post_actions import choose_answer, close_or_open_post, create_new_post, delete_post, get_all_posts, get_all_posts_from_user, get_post_by_id, like_post, rm_like_post, view_post
from src.user_actions import create_new_user, get_user_by_id, login_with_user_or_email
from utils.errors import ErrorCode, ForUmError, register_error_handlers
from utils.api_types import (
    BestCommentRef, CommentRef, CommentResponse,
    NewComment, NewPost, NewUser, PostRef,
    PostResponse, UIDToken, UserPayload, UserResponse,
)

app = FastAPI()
register_error_handlers(app)

cors_raw = getenv("CORS_ORIGINS", "")
origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

secret_key = getenv("JWT_SECRET_KEY")

STATIC_DIR = Path(getenv("STATIC_DIR", "client/dist"))


def token_validation(uid: Union[str, None] = Cookie(None)):
    if not uid:
        raise ForUmError(401, ErrorCode.UNAUTHENTICATED, "Not authenticated")

    try:
      uid_token = jwt.decode(uid, secret_key, algorithms=["HS256"])
      return UIDToken.model_validate(uid_token)
    except Exception:
        raise ForUmError(401, ErrorCode.UNAUTHENTICATED, "Not authenticated")


def optional_token_validation(uid: Union[str, None] = Cookie(None)) -> Union[UIDToken, None]:
    if not uid:
        return None

    try:
        return UIDToken.model_validate(jwt.decode(uid, secret_key, algorithms=["HS256"]))
    except Exception:
        return None


@app.get("/api/logged", response_model=UserResponse)
async def logged(uid_token: Annotated[UIDToken, Depends(token_validation)]):
    return get_user_by_id(uid_token.user_id)[0]


@app.get("/api/user/{userID}", response_model=UserResponse)
async def getUserByID(userID: int):
    return get_user_by_id(userID)[0]


@app.get("/api/posts/{postID}", response_model=PostResponse)
async def getPostByID(
    postID: int,
    uid_token: Annotated[Union[UIDToken, None], Depends(optional_token_validation)],
):
    viewer = uid_token.user_id if uid_token else None
    return get_post_by_id(postID, currentUser=viewer)[0]


@app.get("/api/posts", response_model=list[PostResponse])
def getAllPosts(
    uid_token: Annotated[Union[UIDToken, None], Depends(optional_token_validation)],
):
    viewer = uid_token.user_id if uid_token else None
    return get_all_posts(currentUser=viewer)[0]


@app.get("/api/posts/user/{userID}", response_model=list[PostResponse])
def getAllPostsFromUser(
    userID: int,
    uid_token: Annotated[Union[UIDToken, None], Depends(optional_token_validation)],
):
    viewer = uid_token.user_id if uid_token else None
    return get_all_posts_from_user(userID, currentUser=viewer)[0]


@app.get("/api/comments/{postID}", response_model=list[CommentResponse])
def getAllCommentsFromPost(
    postID: int,
    uid_token: Annotated[Union[UIDToken, None], Depends(optional_token_validation)],
):
    viewer = uid_token.user_id if uid_token else None
    return get_all_comments_from_post(postID, currentUser=viewer)[0]


@app.post("/api/posts/create", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def createNewPost(uid_token: Annotated[UIDToken, Depends(token_validation)], new_post: NewPost):
    return create_new_post(post=new_post, currentUser=uid_token.user_id)[0]


@app.delete("/api/posts/delete/{postID}")
def deletePost(uid_token: Annotated[UIDToken, Depends(token_validation)], postID: int):
    delete_post(post_id=postID, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/posts/comment", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def createNewComment(uid_token: Annotated[UIDToken, Depends(token_validation)], new_comment: NewComment):
    return create_new_comment(comment=new_comment, currentUser=uid_token.user_id)[0]


@app.post("/api/posts/like")
def likePost(uid_token: Annotated[UIDToken, Depends(token_validation)], post_ref: PostRef):
    like_post(post_id=post_ref.post_id, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.delete("/api/posts/like")
def unlikePost(uid_token: Annotated[UIDToken, Depends(token_validation)], post_ref: PostRef):
    rm_like_post(post_id=post_ref.post_id, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/comments/like")
def likeComment(uid_token: Annotated[UIDToken, Depends(token_validation)], comment_ref: CommentRef):
    like_comment(comment_id=comment_ref.comment_id, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.delete("/api/comments/like")
def unlikeComment(uid_token: Annotated[UIDToken, Depends(token_validation)], comment_ref: CommentRef):
    rm_like_comment(comment_id=comment_ref.comment_id, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/api/comments/best", response_model=PostResponse)
def bestComment(uid_token: Annotated[UIDToken, Depends(token_validation)], best_comment_ref: BestCommentRef):
    return choose_answer(
        post_id=best_comment_ref.post_id,
        comment_id=best_comment_ref.comment_id,
        currentUser=uid_token.user_id,
    )[0]


@app.post("/api/posts/view")
def viewPost(uid_token: Annotated[UIDToken, Depends(token_validation)], post_ref: PostRef):
    view_post(post_id=post_ref.post_id, currentUser=uid_token.user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/api/posts/closed", response_model=PostResponse)
def closeOpenPost(uid_token: Annotated[UIDToken, Depends(token_validation)], post_ref: PostRef):
    return close_or_open_post(post_id=post_ref.post_id, currentUser=uid_token.user_id)[0]


@app.post("/api/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def createNewUser(new_user: NewUser):
    task = create_new_user(new_user)
    return task[0]


@app.post("/api/login", status_code=204)
def login(user: UserPayload, response: Response):
    token = login_with_user_or_email(user.user, user.password)
    response.set_cookie(key="uid", value=token, samesite="lax")


@app.post("/api/logout", status_code=204)
def logout(uid_token: Annotated[UIDToken, Depends(token_validation)], response: Response):
    response.set_cookie(key="uid", expires=0)


# --- SPA fallback (must be last) ---

@app.get("/{path:path}")
async def serve_spa(path: str):
    if path.startswith("api"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if STATIC_DIR.is_dir():
        file = STATIC_DIR / path
        if file.is_file():
            return FileResponse(file)
        index = STATIC_DIR / "index.html"
        if index.is_file():
            return FileResponse(index)

    return {"Hello": "World"}
