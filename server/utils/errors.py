from http import HTTPStatus
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("forum.errors")


class ErrorCode:
    INTERNAL_ERROR = "INTERNAL_ERROR"
    HTTP_ERROR = "HTTP_ERROR"
    POST_NOT_FOUND = "POST_NOT_FOUND"
    USER_NOT_FOUND = "USER_NOT_FOUND"
    COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND"
    POST_ALREADY_LIKED = "POST_ALREADY_LIKED"
    POST_NOT_LIKED = "POST_NOT_LIKED"
    COMMENT_ALREADY_LIKED = "COMMENT_ALREADY_LIKED"
    COMMENT_NOT_LIKED = "COMMENT_NOT_LIKED"


class ForUmError(Exception):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ForUmError)
    def handle_forum_error(request: Request, exc: ForUmError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"code": exc.code, "message": exc.message},
        )

    @app.exception_handler(HTTPException)
    def handle_http_exception(request: Request, exc: HTTPException) -> JSONResponse:
        if exc.status_code >= HTTPStatus.INTERNAL_SERVER_ERROR:
            logger.exception(
                "Unhandled error on %s %s", request.method, request.url.path
            )
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "code": ErrorCode.INTERNAL_ERROR,
                    "message": "Something went wrong",
                },
            )
        message = (
            exc.detail
            if exc.detail is not None
            else HTTPStatus(exc.status_code).phrase
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"code": ErrorCode.HTTP_ERROR, "message": message},
        )

    @app.exception_handler(Exception)
    def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            content={
                "code": ErrorCode.INTERNAL_ERROR,
                "message": "Something went wrong",
            },
        )
