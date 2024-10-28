import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

import database as _database

class User(_database.Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    lastName = Column(String, index=True)
    firstName = Column(String, index=True)
    login = Column(String, unique=True, index=True)
    # email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime(timezone=True), default=func.now())