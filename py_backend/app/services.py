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


async def create_user(
    user: _schemas.CreateUser, db: "Session"
) -> _schemas.User:
    user = _models.User(**user.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return _schemas.User.from_orm(user)

# async def get_all_users(db: "Session") -> List[_schemas.User]:
#     users = db.query(_models.User).all()
#     return list(map(_schemas.User.from_orm, users))


async def get_user(login: str, password: str, db: "Session"):
    user = db.query(_models.User).filter(_models.User.login == login, _models.User.password == password).first()
    return user

# async def delete_user(user: _models.User, db: "Session"):
#     db.delete(user)
#     db.commit()

# async def change_user(
#     user_data: _schemas.CreateUser, user: _models.User, db: "Session"
# ) -> _schemas.User:
#     user.username = user_data.username
#     user.name = user_data.name
#     user.surname = user_data.surname
#     user.email = user_data.email
#     user.password = user_data.password

#     db.commit()
#     db.refresh(user)

#     return _schemas.User.from_orm(user)

# def update_user(db: "Session", db_user: _models.User, user: _schemas.UserUpdate):
#     update_data = user.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(db_user, key, value)

#     db.commit()
#     db.refresh(db_user)
#     return db_user