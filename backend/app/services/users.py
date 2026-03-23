from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from schemas import CreateUser


def get_user_by_login(db: Session, login: str) -> models.User | None:
    return db.scalars(select(models.User).where(models.User.login == login)).first()


def get_user_by_credentials(
    db: Session,
    login: str,
    password: str,
) -> models.User | None:
    return db.scalars(
        select(models.User).where(
            models.User.login == login,
            models.User.password == password,
        )
    ).first()


def create_user(db: Session, data: CreateUser) -> models.User:
    user = models.User(
        lastName=data.lastName,
        firstName=data.firstName,
        login=data.login,
        password=data.password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
