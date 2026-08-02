import pytest

from utils.errors import ErrorCode


class TestRegister:
    def test_register_success(self, client):
        response = client.post("/api/register", json={
            "username": "newuser",
            "nickname": "New User",
            "email": "new@example.com",
            "password": "pass123",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "newuser"
        assert data["nickname"] == "New User"
        assert data["email"] == "new@example.com"
        assert "password" not in data

    def test_register_duplicate_username(self, client, registered_user):
        response = client.post("/api/register", json={
            "username": "testuser",
            "nickname": "Another",
            "email": "other@example.com",
            "password": "pass123",
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.USERNAME_TAKEN

    def test_register_duplicate_email(self, client, registered_user):
        response = client.post("/api/register", json={
            "username": "otheruser",
            "nickname": "Other",
            "email": "test@example.com",
            "password": "pass123",
        })
        assert response.status_code == 409
        assert response.json()["code"] == ErrorCode.EMAIL_TAKEN

    @pytest.mark.parametrize("payload", [
        {"username": "", "nickname": "Test", "email": "test@example.com", "password": "pass123"},
        {"username": "ab", "nickname": "Test", "email": "test@example.com", "password": "pass123"},
        {"username": "user@name", "nickname": "Test", "email": "test@example.com", "password": "pass123"},
        {"username": "newuser", "nickname": "", "email": "test@example.com", "password": "pass123"},
        {"username": "newuser", "nickname": "Test", "email": "not-an-email", "password": "pass123"},
        {"username": "newuser", "nickname": "Test", "email": "test@example.com", "password": "pass1"},
    ])
    def test_register_invalid_fields(self, client, payload):
        response = client.post("/api/register", json=payload)
        assert response.status_code == 422


class TestLogin:
    def test_login_username_success(self, client, registered_user):
        response = client.post("/api/login", json={
            "user": "testuser",
            "password": "securepass123",
        })
        assert response.status_code == 204
        assert "uid" in response.cookies

    def test_login_email_success(self, client, registered_user):
        response = client.post("/api/login", json={
            "user": "test@example.com",
            "password": "securepass123",
        })
        assert response.status_code == 204
        assert "uid" in response.cookies

    def test_login_wrong_password(self, client, registered_user):
        response = client.post("/api/login", json={
            "user": "testuser",
            "password": "wrongpass",
        })
        assert response.status_code == 401
        assert response.json()["code"] == ErrorCode.INVALID_CREDENTIALS

    def test_login_nonexistent_user(self, client):
        response = client.post("/api/login", json={
            "user": "nobody",
            "password": "pass",
        })
        assert response.status_code == 401
        assert response.json()["code"] == ErrorCode.INVALID_CREDENTIALS


class TestTokenValidation:
    def test_logged_with_valid_token(self, logged_in_client):
        response = logged_in_client.get("/api/logged")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"
        assert "password" not in data

    def test_logged_without_token(self, client):
        response = client.get("/api/logged")
        assert response.status_code == 401
        assert response.json() == {"code": ErrorCode.UNAUTHENTICATED, "message": "Not authenticated"}

    def test_logged_with_invalid_token(self, client):
        client.cookies.set("uid", "invalid.jwt.token")
        response = client.get("/api/logged")
        assert response.status_code == 401
        assert response.json() == {"code": ErrorCode.UNAUTHENTICATED, "message": "Not authenticated"}


class TestProfileRetired:
    def test_profile_with_valid_token_returns_404(self, logged_in_client):
        response = logged_in_client.get("/api/profile")
        assert response.status_code == 404

    def test_profile_without_token_returns_404(self, client):
        response = client.get("/api/profile")
        assert response.status_code == 404


class TestLogout:
    def test_logout_clears_cookie(self, logged_in_client):
        response = logged_in_client.post("/api/logout")
        assert response.status_code == 204

    def test_logout_without_token(self, client):
        response = client.post("/api/logout")
        assert response.status_code == 401
        assert response.json()["code"] == ErrorCode.UNAUTHENTICATED
