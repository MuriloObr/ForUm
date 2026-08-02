import bcrypt
from sqlmodel import Session, select

from src.db.engine import engine
from src.db.models.comment import Comment
from src.db.models.post import Post
from src.db.models.user import User

DEMO_PASSWORD = "password123"


def _make_user(username: str, nickname: str, email: str) -> User:
    hashed = bcrypt.hashpw(DEMO_PASSWORD.encode("utf-8"), bcrypt.gensalt())
    return User(
        username=username,
        nickname=nickname,
        password=hashed.decode("utf-8"),
        email=email,
    )


def seed() -> None:
    with Session(engine) as session:
        if session.exec(select(User)).first() is not None:
            print("seed: users already present, skipping")
            return

        admin = _make_user("admin", "Admin", "admin@forum.dev")
        alice = _make_user("alice", "Alice Developer", "alice@forum.dev")
        bob = _make_user("bob", "Bob Tester", "bob@forum.dev")
        carol = _make_user("carol", "Carol Designer", "carol@forum.dev")

        session.add_all([admin, alice, bob, carol])
        session.commit()

        welcome = Post(
            title="Welcome to ForUm — a demo forum",
            content=(
                "This instance was seeded with example data.\n\n"
                "You can log in with any of the demo users "
                "(password: `password123`) and start exploring.\n\n"
                "- `admin` / admin@forum.dev\n"
                "- `alice` / alice@forum.dev\n"
                "- `bob` / bob@forum.dev\n"
                "- `carol` / carol@forum.dev\n\n"
                "Everything you create here lives in your local database."
            ),
            user=admin,
        )

        hot_reload = Post(
            title="How do I set up hot-reload for FastAPI inside Docker?",
            content=(
                "I'm running uvicorn inside a container with `--reload`, but "
                "my code changes don't seem to apply. I've mounted my `src/` "
                "directory as a volume.\n\n"
                "What am I missing?"
            ),
            user=alice,
        )

        answer_modeling = Post(
            title="Modeling a forum's accepted answer",
            content=(
                "I'm designing a forum backend and want to mark one comment as "
                "the accepted answer for a post. Should I add a boolean flag on "
                "the comment, or point the post at the comment?\n\n"
                "What's the tradeoff between the two approaches?"
            ),
            user=bob,
        )

        design_tokens = Post(
            title="Feedback on my Tailwind design tokens for the forum",
            content=(
                "I've been refactoring the component styles around a small set "
                "of design tokens:\n\n"
                "```\n"
                "--color-primary: oklch(0.6 0.2 260);\n"
                "--radius-card: 0.75rem;\n"
                "```\n\n"
                "Anyone have opinions before I roll this out?"
            ),
            user=carol,
        )

        data_loss = Post(
            title="Why does my Postgres container lose data on `down`?",
            content=(
                "I run `docker compose down` to stop the dev stack and when I "
                "start it again my tables are empty.\n\n"
                "Do I need a named volume for the database service?"
            ),
            user=alice,
        )

        session.add_all([welcome, hot_reload, answer_modeling, design_tokens, data_loss])
        session.commit()

        reload_answer = Comment(
            content=(
                "You need to run uvicorn with `--reload` *and* make sure "
                "the watcher can see the mounted files. With Docker Desktop "
                "on macOS, use `--reload-dir /app/src` to force polling."
            ),
            post=hot_reload,
            user=bob,
        )
        reload_tip = Comment(
            content=(
                "Also check you're not overriding the entrypoint in a way "
                "that drops the `--reload` flag from the uvicorn command."
            ),
            post=hot_reload,
            user=carol,
        )
        reload_thanks = Comment(
            content="This solved it for me, thanks!",
            post=hot_reload,
            user=alice,
        )
        design_take = Comment(
            content=(
                "I'd add: avoid changing tokens that affect layout in the same "
                "PR as the refactor."
            ),
            post=design_tokens,
            user=bob,
        )
        design_fallback = Comment(
            content=(
                "The oklch values read great — how do they fall back for "
                "non-supporting browsers?"
            ),
            post=design_tokens,
            user=admin,
        )
        volume_answer = Comment(
            content="Yes, add a named volume under `db` and the data survives `down`.",
            post=data_loss,
            user=admin,
        )
        volume_caveat = Comment(
            content="`down -v` will still wipe it, so be careful with that flag.",
            post=data_loss,
            user=carol,
        )
        modeling_answer = Comment(
            content=(
                "Point the post at the comment. You only need one marker, it "
                "keeps the invariant `post.answer_id` unique, and there is no "
                "risk of a comment being flagged as the answer for two posts."
            ),
            post=answer_modeling,
            user=alice,
        )
        welcome_comment = Comment(
            content="Nice to have you here, everyone.",
            post=welcome,
            user=alice,
        )

        session.add_all(
            [
                reload_answer,
                reload_tip,
                reload_thanks,
                design_take,
                design_fallback,
                volume_answer,
                volume_caveat,
                modeling_answer,
                welcome_comment,
            ]
        )
        session.commit()

        answer_modeling.answer_id = modeling_answer.id
        answer_modeling.is_closed = True
        session.commit()

        hot_reload.likes.extend([bob, carol])
        design_tokens.likes.extend([admin, alice, bob])
        welcome.likes.extend([alice, bob, carol])

        hot_reload.views.extend([bob, carol, admin])
        answer_modeling.views.extend([alice, carol, admin])
        design_tokens.views.extend([alice, bob, admin])
        data_loss.views.extend([bob, carol, admin])
        welcome.views.extend([alice, bob, carol])

        reload_answer.likes.extend([alice, carol])
        reload_tip.likes.extend([bob])
        reload_thanks.likes.extend([bob, carol, admin])
        modeling_answer.likes.extend([bob, carol, admin])

        session.commit()

        print("seed: created demo users, posts, comments, likes and views")
        print("seed: log in with any demo user (password: password123)")


if __name__ == "__main__":
    seed()
