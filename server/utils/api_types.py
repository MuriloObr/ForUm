from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UIDToken(BaseModel):
    user_id: int
    exp: int

class PostRef(BaseModel):
    post_id: int

class NewPost(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    content: str = Field(min_length=1, max_length=10000)

class CommentRef(BaseModel):
    comment_id: int

class NewComment(BaseModel):
    post_id: int
    content: str = Field(min_length=1, max_length=10000)

class BestCommentRef(BaseModel):
    post_id: int
    comment_id: int

class NewUser(BaseModel):
    username: str = Field(pattern=r"^[a-zA-Z0-9_]+$", min_length=3, max_length=30)
    nickname: str = Field(min_length=1, max_length=30)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)

class UserPayload(BaseModel):
    user: str
    password: str


# --- Response models ---

class UserResponse(BaseModel):
    id: int
    nickname: str
    username: str
    email: str
    created_at: datetime
    updated_at: datetime

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    is_closed: bool
    answer_id: int | None
    created_at: datetime
    updated_at: datetime
    user_id: int
    user: UserResponse
    like_count: int
    view_count: int
    is_liked: bool

class CommentResponse(BaseModel):
    id: int
    content: str
    post_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse | None = None
    like_count: int
    is_liked: bool
