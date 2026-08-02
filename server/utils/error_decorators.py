from sqlmodel import Session
from src.db.engine import engine


def errorHandler(method: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            with Session(engine) as session:
                try:
                    data = func(session, *args, **kwargs)
                except Exception:
                    session.rollback()
                    raise
                else:
                    if method == "post":
                        session.commit()
                    return [data, None]
        return wrapper
    return decorator
