from sqlalchemy import Column, types, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy import create_engine , inspect
import os 
import pandas as pd 
import time 

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
    
def prepare():
    engine = create_engine("sqlite:///:memory", echo=True, future=True)
    inspector_gadget = inspect(engine)
    Base.metadata.create_all(engine) # generates schema or tables in our target db
    Session = sessionmaker(engine)

    return Session(), engine
"""
Command :
    print(inspector_gadget.get_table_names())
Result:
    ['loginevent', 'users']

Command
    print(inspector_gadget.get_columns('loginevent'))
Result:
    [{'name': 'id', 'type': INTEGER(), 'nullable': False, 'default': None, 'primary_key': 1}, {'name': 'user_id', 'type': INTEGER(), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'result', 'type': BOOLEAN(), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'time', 'type': TIMESTAMP(), 'nullable': True, 'default': None, 'primary_key': 0}]

Command
    print(inspector_gadget.get_columns('users'))
Result:
    [{'name': 'id', 'type': INTEGER(), 'nullable': False, 'default': None, 'primary_key': 1}, {'name': 'user_id', 'type': VARCHAR(length=32), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'user', 'type': VARCHAR(length=80), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'hash', 'type': VARCHAR(length=32), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'salt', 'type': VARCHAR(length=80), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'firstname', 'type': VARCHAR(length=100), 'nullable': True, 'default': None, 'primary_key': 0}, {'name': 'lastname', 'type': VARCHAR(length=100), 'nullable': True, 'default': None, 'primary_key': 0}]

"""

def load_csv_data_fortune(engine, csv_file):
    """
        .csv file location:  https://www.kaggle.com/datasets/rm1000/fortune-500-companies
    """
    # csv to dataframe
    df = pd.read_csv(csv_file)

    # filter dataframe 
    df = df[["name","rank","year","industry","sector","headquarters_state","headquarters_city"]]
    print(df)
    # # write csv to database 
    try:
        df.to_sql(Fortune500.__tablename__, con=engine, if_exists='replace', index=False)
    except ValueError as err:
        print(err.args)
        print('BOOOOOM')
