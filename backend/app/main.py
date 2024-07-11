from fastapi import FastAPI, status, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Login(BaseModel):
    login: str
    password: str


class Register(BaseModel):
    login: str
    password: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="http://localhost.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.post("/login")
# def handle_login(login: Login):
#     return JSONResponse(content={"firstName": "Nikolay", "lastName": "Kegelik"}, status_code=status.HTTP_200_OK)

# @app.post("/register")
# def handle_register(register: Register):
#     return JSONResponse(content={"firstName": "Pavel", "lastName": "Prokopyev"}, status_code=status.HTTP_200_OK)

@app.post("/login")
def handle_login():
    return JSONResponse(content={"isValid": 1, "data": {"firstName": "Nikolay", "lastName": "Kegelik"}}, status_code=status.HTTP_200_OK)
