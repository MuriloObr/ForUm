"""cascade deletes for posts and comments

Revision ID: edb19846af97
Revises: c677445c41bb
Create Date: 2026-08-02 19:09:08.301540

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'edb19846af97'
down_revision: Union[str, Sequence[str], None] = 'c677445c41bb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("comments_post_id_fkey", "comments", type_="foreignkey")
    op.create_foreign_key(
        "comments_post_id_fkey", "comments", "posts", ["post_id"], ["id"],
        ondelete="CASCADE",
    )
    op.drop_constraint("posts_likes_post_id_fkey", "posts_likes", type_="foreignkey")
    op.create_foreign_key(
        "posts_likes_post_id_fkey", "posts_likes", "posts", ["post_id"], ["id"],
        ondelete="CASCADE",
    )
    op.drop_constraint("posts_views_post_id_fkey", "posts_views", type_="foreignkey")
    op.create_foreign_key(
        "posts_views_post_id_fkey", "posts_views", "posts", ["post_id"], ["id"],
        ondelete="CASCADE",
    )
    op.drop_constraint("comments_likes_comment_id_fkey", "comments_likes", type_="foreignkey")
    op.create_foreign_key(
        "comments_likes_comment_id_fkey", "comments_likes", "comments", ["comment_id"], ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("comments_post_id_fkey", "comments", type_="foreignkey")
    op.create_foreign_key(
        "comments_post_id_fkey", "comments", "posts", ["post_id"], ["id"],
    )
    op.drop_constraint("posts_likes_post_id_fkey", "posts_likes", type_="foreignkey")
    op.create_foreign_key(
        "posts_likes_post_id_fkey", "posts_likes", "posts", ["post_id"], ["id"],
    )
    op.drop_constraint("posts_views_post_id_fkey", "posts_views", type_="foreignkey")
    op.create_foreign_key(
        "posts_views_post_id_fkey", "posts_views", "posts", ["post_id"], ["id"],
    )
    op.drop_constraint("comments_likes_comment_id_fkey", "comments_likes", type_="foreignkey")
    op.create_foreign_key(
        "comments_likes_comment_id_fkey", "comments_likes", "comments", ["comment_id"], ["id"],
    )
