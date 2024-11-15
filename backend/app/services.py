from typing import TYPE_CHECKING, List

import database as _database
import models as _models
import schemas as _schemas

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

def _add_tables():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_user(user: _schemas.CreateUser, db: "Session") -> _schemas.User:
    existing_user = await get_user(db, login=user.login)
    if existing_user:
        raise ValueError("Пользователь с таким логином уже существует")
    
    new_user = _models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return _schemas.User.from_orm(new_user)

async def get_user(db: "Session", login: str, password: str = None):
    query = db.query(_models.User).filter(_models.User.login == login)
    if password:
        query = query.filter(_models.User.password == password)
    return query.first()