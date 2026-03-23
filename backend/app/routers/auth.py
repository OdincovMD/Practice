from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from schemas import CreateUser, Login
from services import users as user_service

router = APIRouter()


def _ok(first_name: str, last_name: str) -> JSONResponse:
    return JSONResponse(
        content={
            "isValid": 1,
            "data": {"firstName": first_name, "lastName": last_name},
        }
    )


def _fail() -> JSONResponse:
    return JSONResponse(content={"isValid": 0})


@router.post("/register")
def register(payload: CreateUser, db: Session = Depends(get_db)) -> JSONResponse:
    if user_service.get_user_by_login(db, payload.login):
        return _fail()
    try:
        user_service.create_user(db, payload)
    except IntegrityError:
        db.rollback()
        return _fail()
    return _ok(payload.firstName, payload.lastName)


@router.post("/login")
def login(payload: Login, db: Session = Depends(get_db)) -> JSONResponse:
    user = user_service.get_user_by_credentials(
        db, payload.login, payload.password
    )
    if user is None:
        return _fail()
    return _ok(user.firstName, user.lastName)
