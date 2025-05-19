from sqlalchemy import Column, types, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import pandas as pd 

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    id = Column(types.Integer,primary_key=True) 
    user_id = Column(types.String(length=32), unique=True)
    user = Column(types.String(length=80))
    hash = Column(types.String(length=32))
    salt = Column(types.String(length=80))
    firstname = Column(types.String(length=100))
    lastname = Column(types.String(length=100))
    
class LoginEvent(Base):
    __tablename__= "loginevent"
    id = Column(types.Integer, primary_key=True)
    user_id = Column(types.Integer, ForeignKey("users.id")) # users.id = <Users Table>.<Column>
    result = Column(types.Boolean)
    time = Column(types.TIMESTAMP)

class Fortune500(Base):
    __tablename__ = "fortune500"
    id = Column(types.Integer, primary_key=True)
    name = Column(types.String(length=100), unique=True )
    rank = Column(types.Integer)
    year = Column(types.Integer)
    industry = Column(types.String(100))
    sector = Column(types.String(),default='na')
    headquarters_state = Column(types.String(32),default='na')
    headquarters_city = Column(types.String(32),default='na')

class Artifacts(Base):
    __tablename__ = "artifacts"
    id = Column(types.Integer, primary_key=True)
    name = Column(types.String(length=100), unique=True )
    data = Column(types.JSON)

