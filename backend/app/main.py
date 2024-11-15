import uvicorn
import json
import logging
import os
import shutil
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, status, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi


from typing import TYPE_CHECKING, List
import sqlalchemy.orm as _orm

import schemas as _schemas
import services as _services

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.middleware("http")
async def set_forwarded_proto(request: Request, call_next):
    if "x-forwarded-proto" in request.headers:
        request.scope["scheme"] = request.headers["x-forwarded-proto"]
    response = await call_next(request)
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Received request: {request.method} {request.url}")
    logger.debug(f"Request headers: {request.headers}")
    response = await call_next(request)
    logger.info(f"Sent response: Status {response.status_code}")
    return response

@app.post("/register", response_model=_schemas.User)
async def handle_register(
    register: _schemas.CreateUser,
    db: _orm.Session = Depends(_services.get_db),
):
    logger.info(f"Получен запрос на регистрацию: {register}")
    try:
        new_user = await _services.create_user(user=register, db=db)
        logger.info(f"Создан новый пользователь: {new_user}")
        return JSONResponse(content={
            "isValid": 1,
            "data": {
                "firstName": new_user.firstName,
                "lastName": new_user.lastName
            }
        }, status_code=status.HTTP_201_CREATED)
    except ValueError as e:
        logger.warning(f"Ошибка при регистрации: {str(e)}")
        return JSONResponse(content={"isValid": 0, "message": str(e)}, status_code=status.HTTP_409_CONFLICT)
    except Exception as e:
        logger.exception(f"Ошибка при регистрации: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")

@app.post("/login", response_model=_schemas.User)
async def handle_login(
    login_data: _schemas.Login,
    db: _orm.Session = Depends(_services.get_db) 
):
    logger.info(f"Получен запрос на вход: {login_data}")
    try:
        user = await _services.get_user(db=db, login=login_data.login, password=login_data.password)
        if user is None:
            logger.warning("Вход не удался: пользователь не найден")
            return JSONResponse(content={"isValid": 0, "message": "Неверный логин или пароль"}, status_code=status.HTTP_401_UNAUTHORIZED)

        logger.info(f"Успешный вход пользователя: {user.login}")
        return JSONResponse(content={
            "isValid": 1, 
            "data": {
                "firstName": user.firstName, 
                "lastName": user.lastName
            }
        }, status_code=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Ошибка при обработке входа: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@app.post("/upload")
async def handle_upload(file: UploadFile = File(...)):
    logger.info(f"Получен запрос на загрузку файла: {file.filename}")
    try:
        url = "http://ml:9000/upload"
        files = {"file": (file.filename, file.file, file.content_type)}
        response = requests.post(url, files=files)
        logger.info(f"Ответ от ML сервиса: {response.status_code}")
        return response.json()
    except Exception as e:
        logger.error(f"Ошибка при загрузке файла: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка при загрузке файла")

@app.post("/save_image")
async def save_image(file: UploadFile = File(...)):
    logger.info(f"Получен запрос на сохранение изображения: {file.filename}")
    try:
        path = os.path.join("img", file.filename)
        with open(path, "wb+") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Изображение успешно сохранено: {path}")
        return JSONResponse(
            content={"success": True, "message": "Изображение успешно загружено"},
            status_code=200,
            media_type="application/json"
        )
    except Exception as e:
        logger.error(f"Ошибка при сохранении изображения: {str(e)}")
        return JSONResponse(
            content={"success": False, "message": str(e)},
            status_code=500,
            media_type="application/json"
        )

@app.get("/")
async def root():
    logger.info("Получен запрос к корневому маршруту")
    return {"message": "Добро пожаловать в API"}