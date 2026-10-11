from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import auth
import models
import schemas
from database import get_db


router = APIRouter(
    tags=["users"]
)


@router.post("/register", status_code=201)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.scalar(
        select(models.User)
        .where(models.User.email == user.email)
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    hashed_password = auth.password_hash.hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }
@router.post("/login")
def login(
    credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    user = db.scalar(
        select(models.User)
        .where(models.User.email == credentials.email)
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    password_is_valid = auth.password_hash.verify(
        credentials.password,
        user.password_hash
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    access_token = auth.create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
