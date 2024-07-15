from fastapi import FastAPI, status, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from typing import TYPE_CHECKING, List
import fastapi as _fastapi
import sqlalchemy.orm as _orm

import schemas as _schemas
import services as _services

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

# class Register(BaseModel):
#     lastName: str
#     firstName: str
#     login: str
#     password: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# """Эмулирование работы базы данных"""
# main_table = [{"login": "horo", "password": "123456Qw", "firstName": "Nikolay", "lastName": "Kegelik"},
#               {"login": "base", "password": "123456Qw", "firstName": "John", "lastName": "Doe"},
#               {"login": "a", "password": "a", "firstName": "John", "lastName": "Doe"}
#               ]

# @app.post("/login")
# def handle_login(login: Login):
#     sorted_table = next(filter(lambda x: x["login"] == login.login, main_table), None)
#     if sorted_table and login.password == sorted_table["password"]:
#         return JSONResponse(content={"isValid": 1, "data": {"firstName": sorted_table["firstName"], "lastName": sorted_table["lastName"]}}, status_code=status.HTTP_200_OK)
#     return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)

# @app.post("/register")
# def handle_register(register: Register):
#     sorted_table = next(filter(lambda x: x["login"] == register.login, main_table), None)
#     if sorted_table:
#         return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)
#     main_table.append({"login": register.login, "password": register.password, "firstName": register.firstName, "lastName": register.lastName})
#     return JSONResponse(content={"isValid": 1, "data": {"firstName": register.firstName, "lastName": register.lastName}}, status_code=status.HTTP_200_OK)

# /users/
@app.post("/register", response_model=_schemas.User)
async def handle_register(
    register: _schemas.CreateUser,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    try: 
        sorted_table = await _services.get_user(db=db, login=register.login, password=register.password)
        if sorted_table is None:
            await _services.create_user(user=register, db=db)
            return JSONResponse(content={"isValid": 1, "data": {"firstName": register.firstName, "lastName": register.lastName}}, status_code=status.HTTP_200_OK)
        return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)
    except: 
        return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)

# /users/{user_id} 
@app.post("/login", response_model=_schemas.User)
async def handle_login(
    login_data: _schemas.Login,
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    sorted_table = await _services.get_user(db=db, login=login_data.login, password=login_data.password)
    if sorted_table is None:
        return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)

    return JSONResponse(content={"isValid": 1, "data": {"firstName": sorted_table.firstName, "lastName": sorted_table.lastName}}, status_code=status.HTTP_200_OK)

# @app.delete("/users/{user_id}/")
# async def delete_user(
#     user_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)
# ):
#     user = await _services.get_user(db=db, user_id=user_id)
#     if user is None:
#         raise _fastapi.HTTPException(status_code=404, detail="User does not exist")

#     await _services.delete_user(user, db=db)

#     return "successfully deleted the user"

# @app.put("/users/{user_id}/", response_model=_schemas.User)
# async def change_user(
#     user_id: int,
#     user_data: _schemas.CreateUser,
#     db: _orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     user = await _services.get_user(db=db, user_id=user_id)
#     if user is None:
#         raise _fastapi.HTTPException(status_code=404, detail="User does not exist")

#     return await _services.change_user(
#         user_data=user_data, user=user, db=db
#     )

# @app.patch("/users/{user_id}", response_model=_schemas.User)
# async def update_user(
#     user_id: int, 
#     user: _schemas.UserUpdate, 
#     db: _orm.Session = _fastapi.Depends(_services.get_db)
# ):
#     db_user = await _services.get_user(db=db, user_id=user_id)
#     if db_user is None:
#         raise _fastapi.HTTPException(status_code=404, detail="Пользователь не найден")

#     return _services.update_user(
#         db, db_user=db_user, user=user
#     )

@app.post("/upload")
async def handle_upload(file: UploadFile = File(...)):
    url = "http://ml:9000/upload"
    files = {"file": (file.filename, file.file, file.content_type)}
    response = requests.post(url, files=files)
    return response.json()
    # return JSONResponse(content={"result": "Бактериальная пневмония", "probability": 0.96})