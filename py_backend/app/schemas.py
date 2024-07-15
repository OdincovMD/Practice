import datetime as _dt
from typing import Optional
from pydantic import BaseModel 


class Login(BaseModel):
    login: str
    password: str

class BaseUser(BaseModel):
    lastName: str
    firstName: str
    login: str
    password: str

class User(BaseUser):
    id: int
    created_at: _dt.datetime

    class Config:
        orm_mode = True
        from_attributes=True

# class UserUpdate(BaseUser):
#     lastName: Optional[str] = None
#     firstname: Optional[str] = None
#     login: Optional[str] = None
#     password: Optional[str] = None
#     # email: Optional[str] = None


class CreateUser(BaseUser):
    pass