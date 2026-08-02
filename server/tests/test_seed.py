import importlib

from sqlmodel import Session, select

from src.db.models.comment import Comment
from src.db.models.post import Post
from src.db.models.user import User


class TestSeed:
    def test_seed_populates_demo_data(self, test_engine, db_session):
        seed = importlib.import_module("src.seed")
        seed.engine = test_engine

        seed.seed()

        users = db_session.exec(select(User)).all()
        posts = db_session.exec(select(Post)).all()
        comments = db_session.exec(select(Comment)).all()

        assert len(users) == 4
        assert {u.username for u in users} == {"admin", "alice", "bob", "carol"}
        assert len(posts) == 5
        assert len(comments) == 9

        closed = [p for p in posts if p.is_closed]
        assert len(closed) == 1
        assert closed[0].answer_id is not None
        assert closed[0].answer_id in {c.id for c in comments}

        liked_posts = [p for p in posts if p.likes]
        assert len(liked_posts) == 3
        assert all(p.views for p in posts)
        assert any(c.likes for c in comments)

    def test_seed_is_idempotent(self, test_engine, db_session):
        seed = importlib.import_module("src.seed")
        seed.engine = test_engine

        seed.seed()
        seed.seed()

        users = db_session.exec(select(User)).all()
        posts = db_session.exec(select(Post)).all()

        assert len(users) == 4
        assert len(posts) == 5

    def test_passwords_are_bcrypt_hashed(self, test_engine, db_session):
        seed = importlib.import_module("src.seed")
        seed.engine = test_engine

        seed.seed()

        user = db_session.exec(select(User).where(User.username == "admin")).one()
        assert user.password != "password123"
        assert user.password.startswith("$2")
