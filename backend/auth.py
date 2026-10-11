from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session
from config import settings

import models
from database import get_db


password_hash = PasswordHash.recommended()

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

security = HTTPBearer()


def create_access_token(user_id: int):
    expiration = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expiration
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = int(payload["sub"])

    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    user = db.scalar(
        select(models.User)
        .where(models.User.id == user_id)
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found."
        )

    return user