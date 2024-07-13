from fastapi import FastAPI, status, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

class Login(BaseModel):
    login: str
    password: str


class Register(BaseModel):
    lastName: str
    firstName: str
    login: str
    password: str
    rep_passwrod: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="http://localhost.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""Эмулирование работы базы данных"""
main_table = [{"login": "horo", "password": "123456Qw", "firstName": "Nikolay", "lastName": "Kegelik"},
              {"login": "base", "password": "123456Qw", "firstName": "John", "lastName": "Doe"}
              ]

@app.post("/login")
def handle_login(login: Login):
    sorted_table = next(filter(lambda x: x["login"] == login.login, main_table), None)
    if sorted_table and login.password == sorted_table["password"]:
        return JSONResponse(content={"isValid": 1, "data": {"firstName": sorted_table["firstName"], "lastName": sorted_table["lastName"]}}, status_code=status.HTTP_200_OK)
    return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)

@app.post("/register")
def handle_register(register: Register):
    sorted_table = next(filter(lambda x: x["login"] == register.login, main_table), None)
    if sorted_table:
        return JSONResponse(content={"isValid": 0}, status_code=status.HTTP_200_OK)
    main_table.add({"login": register.login, "password": register.password, "firstName": register.firstName, "lastName": register.lastName})
    return JSONResponse(content={"isValid": 1, "data": {"firstName": register.firstName, "lastName": register.lastName}}, status_code=status.HTTP_200_OK)

@app.post("/upload/")
async def handle_upload(file: UploadFile = File(...)):
    url = "http://localhost:9000/upload"
    files = {"file": (file.filename, file.file, file.content_type)}
    response = requests.post(url, files=files)
    return response.json()