from pydantic import BaseModel


class Login(BaseModel):
    login: str
    password: str


class CreateUser(BaseModel):
    lastName: str
    firstName: str
    login: str
    password: str
