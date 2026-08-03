from src.main import app


EXPECTED_OPERATION_IDS = {
    ("get", "/api/logged"): "getLoggedUser",
    ("get", "/api/user/{userID}"): "getUser",
    ("get", "/api/posts/{postID}"): "getPost",
    ("get", "/api/posts"): "getPosts",
    ("get", "/api/posts/user/{userID}"): "getUserPosts",
    ("get", "/api/comments/{postID}"): "getPostComments",
    ("post", "/api/posts/create"): "createPost",
    ("delete", "/api/posts/delete/{postID}"): "deletePost",
    ("post", "/api/posts/comment"): "createComment",
    ("post", "/api/posts/like"): "likePost",
    ("delete", "/api/posts/like"): "unlikePost",
    ("post", "/api/comments/like"): "likeComment",
    ("delete", "/api/comments/like"): "unlikeComment",
    ("put", "/api/comments/best"): "chooseBestComment",
    ("post", "/api/posts/view"): "viewPost",
    ("put", "/api/posts/closed"): "togglePostClosed",
    ("post", "/api/register"): "register",
    ("post", "/api/login"): "login",
    ("post", "/api/logout"): "logout",
}


def test_every_api_route_has_an_explicit_operation_id():
    schema = app.openapi()["paths"]
    for (method, path), expected in EXPECTED_OPERATION_IDS.items():
        assert schema[path][method]["operationId"] == expected, f"{method.upper()} {path}"


def test_openapi_paths_match_the_contract():
    schema_paths = {
        (method, path)
        for path, operations in app.openapi()["paths"].items()
        for method in operations
    }
    assert schema_paths == set(EXPECTED_OPERATION_IDS)


def test_spa_fallback_is_excluded_from_the_schema():
    schema = app.openapi()["paths"]
    assert "/{path}" not in schema
