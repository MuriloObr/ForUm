from sqlmodel import Session, select
from src.db.models.user import User
from src.db.models.post import Post
from src.db.models.comment import Comment
from src.serializers import serialize_post
from utils.api_types import NewPost
from utils.error_decorators import errorHandler
from utils.errors import ErrorCode, ForUmError


@errorHandler("get")
def get_post_by_id(session: Session, id: int, currentUser=None):
    data = session.get(Post, id)

    if data is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")

    return serialize_post(session, data, currentUser)


@errorHandler("get")
def get_all_posts(session: Session, currentUser=None):
    data = session.exec(select(Post)).all()

    return [serialize_post(session, post, currentUser) for post in data]


@errorHandler("get")
def get_all_posts_from_user(session: Session, id, currentUser=None):
    user = session.get(User, id)

    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    data = session.exec(select(Post).where(Post.user_id == id)).all()

    return [serialize_post(session, post, currentUser) for post in data]


@errorHandler("post")
def create_new_post(session: Session, post: NewPost, currentUser):
    user = session.get(User, currentUser)

    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    data = Post(
        title=post.title,
        content=post.content,
        is_closed=False,
        user=user,
    )

    session.add(data)
    session.flush()

    return serialize_post(session, data, currentUser)


@errorHandler("post")
def delete_post(session: Session, post_id, currentUser):
    post = session.get(Post, post_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")
    if post.user_id != user.id:
        raise ForUmError(403, ErrorCode.NOT_POST_OWNER, "Only the post author can do that")

    session.delete(post)


@errorHandler("post")
def like_post(session: Session, post_id, currentUser):
    post = session.get(Post, post_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    for like in post.likes:
        if like.id == user.id:
            raise ForUmError(409, ErrorCode.POST_ALREADY_LIKED, "Post already liked")

    post.likes.append(user)


@errorHandler("post")
def rm_like_post(session: Session, post_id, currentUser):
    post = session.get(Post, post_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    try:
        post.likes.remove(user)
    except ValueError:
        raise ForUmError(409, ErrorCode.POST_NOT_LIKED, "Post not liked")


@errorHandler("post")
def choose_answer(session: Session, post_id, comment_id, currentUser):
    post = session.get(Post, post_id)
    comment = session.get(Comment, comment_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if comment is None:
        raise ForUmError(404, ErrorCode.COMMENT_NOT_FOUND, "Comment not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")
    if post.user_id != user.id:
        raise ForUmError(403, ErrorCode.NOT_POST_OWNER, "Only the post author can do that")
    if comment.post_id != post.id:
        raise ForUmError(400, ErrorCode.COMMENT_NOT_ON_POST, "Comment does not belong to this post")

    post.answer_id = comment.id

    return serialize_post(session, post, currentUser)


@errorHandler("post")
def close_or_open_post(session: Session, post_id, currentUser):
    post = session.get(Post, post_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")
    if post.user_id != user.id:
        raise ForUmError(403, ErrorCode.NOT_POST_OWNER, "Only the post author can do that")

    post.is_closed = not post.is_closed

    return serialize_post(session, post, currentUser)


@errorHandler("post")
def view_post(session: Session, post_id, currentUser):
    post = session.get(Post, post_id)
    user = session.get(User, currentUser)

    if post is None:
        raise ForUmError(404, ErrorCode.POST_NOT_FOUND, "Post not found")
    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    for view in post.views:
        if view.id == user.id:
            return

    post.views.append(user)
