import pytest
import json

from fastapi.testclient import TestClient
from src.main import app
from utils.errors import ErrorCode


class TestPostCRUD:
    def test_create_post(self, logged_in_client):
        response = logged_in_client.post("/api/posts/create", json={
            "title": "My First Post",
            "content": "Hello forum!",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["title"] == "My First Post"
        assert data["content"] == "Hello forum!"
        assert data["is_closed"] is False
        assert data["answer_id"] is None
        assert "user" in data
        assert data["user"]["username"] == "testuser"
        assert "password" not in data["user"]
        assert data["like_count"] == 0
        assert data["view_count"] == 0
        assert data["is_liked"] is False

    def test_get_post_by_id(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        response = logged_in_client.get(f"/api/posts/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Post"
        assert data["content"] == "Post content here"
        assert data["user"]["username"] == "testuser"

    def test_get_all_posts(self, logged_in_client):
        logged_in_client.post("/api/posts/create", json={
            "title": "Post A", "content": "Content A",
        })
        logged_in_client.post("/api/posts/create", json={
            "title": "Post B", "content": "Content B",
        })
        response = logged_in_client.get("/api/posts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        titles = {p["title"] for p in data}
        assert "Post A" in titles
        assert "Post B" in titles


class TestPostValidation:
    def test_create_post_empty_title(self, logged_in_client):
        response = logged_in_client.post("/api/posts/create", json={
            "title": "", "content": "Body",
        })
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_create_post_title_too_long(self, logged_in_client):
        response = logged_in_client.post("/api/posts/create", json={
            "title": "x" * 121, "content": "Body",
        })
        assert response.status_code == 422

    def test_create_post_empty_content(self, logged_in_client):
        response = logged_in_client.post("/api/posts/create", json={
            "title": "Valid Title", "content": "",
        })
        assert response.status_code == 422

    def test_create_post_content_too_long(self, logged_in_client):
        response = logged_in_client.post("/api/posts/create", json={
            "title": "Valid Title", "content": "x" * 10001,
        })
        assert response.status_code == 422

    def test_create_post_by_missing_user(self, client):
        import jwt as pyjwt
        import os

        token = pyjwt.encode(
            {"user_id": 99999, "exp": 9999999999},
            os.environ["JWT_SECRET_KEY"],
            algorithm="HS256",
        )
        client.cookies.set("uid", token)
        response = client.post("/api/posts/create", json={
            "title": "Hello", "content": "World",
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.USER_NOT_FOUND


class TestPostReadEndpoints:
    def test_empty_posts_list_returns_empty_array(self, client):
        response = client.get("/api/posts")
        assert response.status_code == 200
        assert response.json() == []

    def test_user_with_no_posts_returns_empty_array(self, client, test_engine):
        from sqlmodel import Session, select
        from src.db.models.user import User

        client.post("/api/register", json={
            "username": "lonewolf",
            "nickname": "Lone",
            "email": "lone@example.com",
            "password": "pass123",
        })
        with Session(test_engine) as session:
            user = session.exec(select(User).where(User.username == "lonewolf")).one()
        response = client.get(f"/api/posts/user/{user.id}")
        assert response.status_code == 200
        assert response.json() == []

    def test_missing_post_returns_not_found(self, logged_in_client):
        response = logged_in_client.get("/api/posts/9999")
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND

    def test_missing_user_returns_not_found(self, logged_in_client):
        response = logged_in_client.get("/api/posts/user/9999")
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.USER_NOT_FOUND

    def test_get_user_returns_not_found_for_missing_user(self, logged_in_client):
        response = logged_in_client.get("/api/user/9999")
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.USER_NOT_FOUND

    def test_post_includes_counts_and_is_liked(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        logged_in_client.post("/api/posts/like", json={
            "post_id": post_id,
        })
        logged_in_client.post("/api/posts/view", json={
            "post_id": post_id,
        })
        response = logged_in_client.get(f"/api/posts/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["like_count"] == 1
        assert data["view_count"] == 1
        assert data["is_liked"] is True

    def test_logged_out_read_works_and_is_liked_false(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        logged_in_client.post("/api/posts/like", json={
            "post_id": post_id,
        })
        with TestClient(app) as anon:
            response = anon.get(f"/api/posts/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["like_count"] == 1
        assert data["is_liked"] is False


class TestPostLikes:
    def test_like_post(self, logged_in_client, sample_post):
        response = logged_in_client.post("/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 204

    def test_duplicate_like(self, logged_in_client, sample_post):
        logged_in_client.post("/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        response = logged_in_client.post("/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.POST_ALREADY_LIKED

    def test_unlike_post(self, logged_in_client, sample_post):
        logged_in_client.post("/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        response = logged_in_client.request("DELETE", "/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 204

    def test_unlike_without_like(self, logged_in_client, sample_post):
        response = logged_in_client.request("DELETE", "/api/posts/like", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.POST_NOT_LIKED

    def test_like_missing_post(self, logged_in_client):
        response = logged_in_client.post("/api/posts/like", json={
            "post_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND

    def test_unlike_missing_post(self, logged_in_client):
        response = logged_in_client.request("DELETE", "/api/posts/like", json={
            "post_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND


class TestPostView:
    def test_view_is_idempotent(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        first = logged_in_client.post("/api/posts/view", json={
            "post_id": post_id,
        })
        second = logged_in_client.post("/api/posts/view", json={
            "post_id": post_id,
        })
        assert first.status_code == 204
        assert second.status_code == 204
        response = logged_in_client.get(f"/api/posts/{post_id}")
        assert response.json()["view_count"] == 1

    def test_view_missing_post(self, logged_in_client):
        response = logged_in_client.post("/api/posts/view", json={
            "post_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND


class TestPostAnswer:
    def _register_and_login(self, client, username, email):
        client.post("/api/register", json={
            "username": username,
            "nickname": username,
            "email": email,
            "password": "pass123",
        })
        client.post("/api/login", json={
            "user": username,
            "password": "pass123",
        })

    def test_mark_best_answer(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        comment_resp = logged_in_client.post("/api/posts/comment", json={
            "post_id": post_id,
            "content": "The answer",
        })
        assert comment_resp.status_code == 201
        comment_id = comment_resp.json()["id"]

        response = logged_in_client.put("/api/comments/best", json={
            "post_id": post_id,
            "comment_id": comment_id,
        })
        assert response.status_code == 200
        assert response.json()["answer_id"] == comment_id

    def test_non_owner_cannot_mark_answer(self, logged_in_client, sample_post):
        post_id = sample_post["id"]

        comment_resp = logged_in_client.post("/api/posts/comment", json={
            "post_id": post_id,
            "content": "A comment",
        })
        assert comment_resp.status_code == 201
        comment_id = comment_resp.json()["id"]

        from fastapi.testclient import TestClient
        from src.main import app
        with TestClient(app) as other_client:
            self._register_and_login(other_client, "other", "other@example.com")
            response = other_client.put("/api/comments/best", json={
                "post_id": post_id,
                "comment_id": comment_id,
            })
            assert response.status_code == 403
            assert response.json()["code"] == ErrorCode.NOT_POST_OWNER

    def test_answer_comment_from_other_post(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        other_post = logged_in_client.post("/api/posts/create", json={
            "title": "Second Post",
            "content": "Body",
        })
        assert other_post.status_code == 201
        comment_resp = logged_in_client.post("/api/posts/comment", json={
            "post_id": other_post.json()["id"],
            "content": "Comment on second post",
        })
        assert comment_resp.status_code == 201

        response = logged_in_client.put("/api/comments/best", json={
            "post_id": post_id,
            "comment_id": comment_resp.json()["id"],
        })
        assert response.status_code == 400
        assert response.json()["code"] == ErrorCode.COMMENT_NOT_ON_POST

    def test_choose_answer_missing_post(self, logged_in_client):
        response = logged_in_client.put("/api/comments/best", json={
            "post_id": 9999,
            "comment_id": 1,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND


class TestPostClose:
    def test_close_post(self, logged_in_client, sample_post):
        response = logged_in_client.put("/api/posts/closed", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 200
        assert response.json()["is_closed"] is True

    def test_reopen_post(self, logged_in_client, sample_post):
        logged_in_client.put("/api/posts/closed", json={
            "post_id": sample_post["id"],
        })
        response = logged_in_client.put("/api/posts/closed", json={
            "post_id": sample_post["id"],
        })
        assert response.status_code == 200
        assert response.json()["is_closed"] is False

    def test_non_owner_cannot_close(self, logged_in_client, sample_post):
        from fastapi.testclient import TestClient
        from src.main import app
        with TestClient(app) as other_client:
            other_client.post("/api/register", json={
                "username": "other",
                "nickname": "Other",
                "email": "other@example.com",
                "password": "pass123",
            })
            other_client.post("/api/login", json={
                "user": "other",
                "password": "pass123",
            })
            response = other_client.put("/api/posts/closed", json={
                "post_id": sample_post["id"],
            })
            assert response.status_code == 403
            assert response.json()["code"] == ErrorCode.NOT_POST_OWNER

    def test_close_missing_post(self, logged_in_client):
        response = logged_in_client.put("/api/posts/closed", json={
            "post_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND


class TestPostDelete:
    def test_author_delete_returns_204(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        response = logged_in_client.request("DELETE", f"/api/posts/delete/{post_id}")
        assert response.status_code == 204
        response = logged_in_client.get(f"/api/posts/{post_id}")
        assert response.status_code == 404

    def test_non_author_cannot_delete(self, logged_in_client, sample_post):
        from fastapi.testclient import TestClient
        from src.main import app
        with TestClient(app) as other_client:
            other_client.post("/api/register", json={
                "username": "other",
                "nickname": "Other",
                "email": "other@example.com",
                "password": "pass123",
            })
            other_client.post("/api/login", json={
                "user": "other",
                "password": "pass123",
            })
            response = other_client.request(
                "DELETE", f"/api/posts/delete/{sample_post['id']}"
            )
            assert response.status_code == 403
            assert response.json()["code"] == ErrorCode.NOT_POST_OWNER

    def test_delete_missing_post(self, logged_in_client):
        response = logged_in_client.request("DELETE", "/api/posts/delete/9999")
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND

    def test_author_delete_post_with_comments_and_likes(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        logged_in_client.post("/api/posts/comment", json={
            "post_id": post_id, "content": "Child comment",
        })
        logged_in_client.post("/api/posts/like", json={"post_id": post_id})

        response = logged_in_client.request("DELETE", f"/api/posts/delete/{post_id}")
        assert response.status_code == 204
        assert logged_in_client.get(f"/api/posts/{post_id}").status_code == 404
        assert logged_in_client.get(f"/api/comments/{post_id}").status_code == 404
