from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from utils.errors import ErrorCode, ForUmError, register_error_handlers


def make_app():
    app = FastAPI()
    register_error_handlers(app)

    @app.get("/domain")
    def domain():
        raise ForUmError(409, "SOMETHING_CONFLICTED", "It conflicted")

    @app.get("/http")
    def http():
        raise HTTPException(status_code=401, detail="Not allowed")

    @app.get("/http500")
    def http500():
        raise HTTPException(status_code=500, detail="secret db detail")

    @app.get("/unexpected")
    def unexpected():
        raise ValueError("secret internal detail")

    return app


class TestErrorContract:
    def test_forum_error_returns_lean_body(self):
        with TestClient(make_app()) as client:
            response = client.get("/domain")
        assert response.status_code == 409
        assert response.json() == {"code": "SOMETHING_CONFLICTED", "message": "It conflicted"}

    def test_http_exception_detail_surfaced_as_message(self):
        with TestClient(make_app()) as client:
            response = client.get("/http")
        assert response.status_code == 401
        assert response.json() == {"code": ErrorCode.HTTP_ERROR, "message": "Not allowed"}

    def test_http_exception_500_is_generic_and_not_leaked(self):
        with TestClient(make_app(), raise_server_exceptions=False) as client:
            response = client.get("/http500")
        assert response.status_code == 500
        assert response.json() == {
            "code": ErrorCode.INTERNAL_ERROR,
            "message": "Something went wrong",
        }
        assert "secret db detail" not in response.text

    def test_unexpected_error_is_generic_and_not_leaked(self):
        with TestClient(make_app(), raise_server_exceptions=False) as client:
            response = client.get("/unexpected")
        assert response.status_code == 500
        assert response.json() == {
            "code": ErrorCode.INTERNAL_ERROR,
            "message": "Something went wrong",
        }
        assert "secret internal detail" not in response.text

    def test_validation_error_keeps_native_shape(self):
        from fastapi import FastAPI
        from pydantic import BaseModel

        app = FastAPI()
        register_error_handlers(app)

        class Payload(BaseModel):
            name: str

        @app.post("/validate")
        def validate(payload: Payload):
            return payload

        with TestClient(app) as client:
            response = client.post("/validate", json={})
        assert response.status_code == 422
        assert "detail" in response.json()
