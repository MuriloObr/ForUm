import pytest
import json

from utils.errors import ErrorCode


@pytest.fixture
def sample_comment(logged_in_client, sample_post):
    response = logged_in_client.post("/api/posts/comment", json={
        "post_id": sample_post["id"],
        "content": "This is a comment",
    })
    assert response.status_code == 200
    return response.json()


class TestCommentCreation:
    def test_create_comment(self, logged_in_client, sample_post):
        response = logged_in_client.post("/api/posts/comment", json={
            "post_id": sample_post["id"],
            "content": "Great post!",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["id"] is not None
        assert data["content"] == "Great post!"
        assert data["post_id"] == sample_post["id"]
        assert "user" in data or "user_id" in data

    def test_create_multiple_comments(self, logged_in_client, sample_post):
        for i in range(3):
            resp = logged_in_client.post("/api/posts/comment", json={
                "post_id": sample_post["id"],
                "content": f"Comment {i}",
            })
            assert resp.status_code == 200

        response = logged_in_client.get(f"/api/comments/{sample_post['id']}")
        assert response.status_code == 200
        assert len(response.json()) == 3

    def test_create_comment_unauthenticated(self, sample_post):
        from fastapi.testclient import TestClient
        from src.main import app
        with TestClient(app) as fresh_client:
            response = fresh_client.post("/api/posts/comment", json={
                "post_id": sample_post["id"],
                "content": "Should fail",
            })
            assert response.status_code == 401

    def test_create_comment_on_nonexistent_post(self, logged_in_client):
        response = logged_in_client.post("/api/posts/comment", json={
            "post_id": 9999,
            "content": "Bad post",
        })
        assert response.status_code == 500


class TestCommentRetrieval:
    def test_get_comments_for_post(self, logged_in_client, sample_post):
        post_id = sample_post["id"]
        logged_in_client.post("/api/posts/comment", json={
            "post_id": post_id, "content": "First",
        })
        logged_in_client.post("/api/posts/comment", json={
            "post_id": post_id, "content": "Second",
        })

        response = logged_in_client.get(f"/api/comments/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2
        contents = {c["content"] for c in data}
        assert "First" in contents
        assert "Second" in contents

    def test_get_comments_empty_post(self, logged_in_client, sample_post):
        response = logged_in_client.get(f"/api/comments/{sample_post['id']}")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_comments_missing_post_returns_not_found(self, logged_in_client):
        response = logged_in_client.get("/api/comments/9999")
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.POST_NOT_FOUND

    def test_get_comments_includes_user(self, logged_in_client, sample_post):
        logged_in_client.post("/api/posts/comment", json={
            "post_id": sample_post["id"], "content": "With user",
        })
        response = logged_in_client.get(f"/api/comments/{sample_post['id']}")
        assert response.status_code == 200
        comment = response.json()[0]
        assert "user" in comment
        assert comment["user"]["username"] == "testuser"
        assert "password" not in comment["user"]

    def test_comment_includes_like_count_and_is_liked(self, logged_in_client, sample_comment):
        comment_id = sample_comment["id"]
        logged_in_client.post("/api/comments/like", json={
            "comment_id": comment_id,
        })
        response = logged_in_client.get(f"/api/comments/{sample_comment['post_id']}")
        assert response.status_code == 200
        comment = next(c for c in response.json() if c["id"] == comment_id)
        assert comment["like_count"] == 1
        assert comment["is_liked"] is True

    def test_comments_read_work_logged_out(self, logged_in_client, sample_comment):
        from fastapi.testclient import TestClient
        from src.main import app

        comment_id = sample_comment["id"]
        logged_in_client.post("/api/comments/like", json={
            "comment_id": comment_id,
        })
        with TestClient(app) as anon:
            response = anon.get(f"/api/comments/{sample_comment['post_id']}")
        assert response.status_code == 200
        comment = next(c for c in response.json() if c["id"] == comment_id)
        assert comment["like_count"] == 1
        assert comment["is_liked"] is False


class TestCommentLikes:
    def test_like_comment(self, logged_in_client, sample_comment):
        response = logged_in_client.post("/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        assert response.status_code == 204

    def test_duplicate_like_comment(self, logged_in_client, sample_comment):
        logged_in_client.post("/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        response = logged_in_client.post("/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.COMMENT_ALREADY_LIKED

    def test_unlike_comment(self, logged_in_client, sample_comment):
        logged_in_client.post("/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        response = logged_in_client.request("DELETE", "/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        assert response.status_code == 204

    def test_unlike_comment_without_like(self, logged_in_client, sample_comment):
        response = logged_in_client.request("DELETE", "/api/comments/like", json={
            "comment_id": sample_comment["id"],
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.COMMENT_NOT_LIKED

    def test_like_missing_comment(self, logged_in_client):
        response = logged_in_client.post("/api/comments/like", json={
            "comment_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.COMMENT_NOT_FOUND

    def test_unlike_missing_comment(self, logged_in_client):
        response = logged_in_client.request("DELETE", "/api/comments/like", json={
            "comment_id": 9999,
        })
        assert response.status_code == 404
        assert response.json()["code"] == ErrorCode.COMMENT_NOT_FOUND
