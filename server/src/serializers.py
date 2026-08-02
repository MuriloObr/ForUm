from sqlmodel import Session

from src.db.models.comment import Comment
from src.db.models.post import Post
from src.user_actions import _get_user_data


def serialize_post(session: Session, post: Post, viewer_id: int | None = None) -> dict:
    data = post.model_dump()
    data["user"] = _get_user_data(session, post.user_id)
    like_ids = {like.id for like in post.likes}
    view_ids = {view.id for view in post.views}
    data["like_count"] = len(like_ids)
    data["view_count"] = len(view_ids)
    data["is_liked"] = viewer_id in like_ids
    return data


def serialize_comment(
    session: Session, comment: Comment, viewer_id: int | None = None
) -> dict:
    data = comment.model_dump()
    data["user"] = _get_user_data(session, comment.user_id)
    like_ids = {like.id for like in comment.likes}
    data["like_count"] = len(like_ids)
    data["is_liked"] = viewer_id in like_ids
    return data
