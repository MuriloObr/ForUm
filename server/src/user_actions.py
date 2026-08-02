from sqlmodel import Session, select
from src.db.models.user import User
from src.db.engine import engine
from utils.api_types import NewUser
from utils.error_decorators import errorHandler
from utils.errors import ErrorCode, ForUmError
import os
import bcrypt
import jwt
import datetime as date

secret_key = os.getenv("JWT_SECRET_KEY")
jwt_algorithm = os.getenv("JWT_ALGORITHM")


def _get_user_data(session: Session, id: int):
    data = session.get(User, id)

    if data is None:
        return None

    jsonData = data.model_dump()
    jsonData.pop("password")

    return jsonData


@errorHandler("get")
def get_user_by_id(session: Session, id: int):
    user = session.get(User, id)

    if user is None:
        raise ForUmError(404, ErrorCode.USER_NOT_FOUND, "User not found")

    jsonData = user.model_dump()
    jsonData.pop("password")

    return jsonData


@errorHandler("post")
def create_new_user(session: Session, user: NewUser):
    hasUsername = session.exec(
        select(User).where(User.username == user.username)
    ).first()

    if hasUsername is not None:
        raise ForUmError(409, ErrorCode.USERNAME_TAKEN, "Username already taken")

    hasEmail = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if hasEmail is not None:
        raise ForUmError(409, ErrorCode.EMAIL_TAKEN, "Email already taken")

    hashPassword = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt())

    data = User(
        username=user.username,
        nickname=user.nickname,
        password=hashPassword.decode("utf-8"),
        email=user.email
    )

    session.add(data)
    session.flush()

    jsonData = data.model_dump()
    jsonData.pop("password")

    return jsonData


def login_with_user_or_email(user_email: str, password: str) -> str:
    with Session(engine) as session:
        if "@" in user_email:
            user = session.exec(
                select(User).where(User.email == user_email)
            ).first()
        else:
            user = session.exec(
                select(User).where(User.username == user_email)
            ).first()

        if user is None:
            raise ForUmError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid credentials")

        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            raise ForUmError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid credentials")

        token = jwt.encode({
            "user_id": user.id,
            "exp": date.datetime.now() + date.timedelta(hours=12)
        }, secret_key, algorithm=jwt_algorithm)

        return token
