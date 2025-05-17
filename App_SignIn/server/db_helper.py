import os 
import database.db
import pandas as pd 
import json 
from sqlalchemy import create_engine , inspect, insert, text, Table
from sqlalchemy.orm import declarative_base, sessionmaker
import sqlalchemy.exc 

def load_csv_data_fortune(engine, csv_file):
    """
        .csv file location:  https://www.kaggle.com/datasets/rm1000/fortune-500-companies
    """
    # csv to dataframe
    df = pd.read_csv(csv_file)

    # filter dataframe 
    df = df[["name","rank","year","industry","sector","headquarters_state","headquarters_city"]]
    print(df)

    # write csv to database 
    try:
        df.to_sql(database.db.Fortune500.__tablename__, con=engine, if_exists='replace', index=False)
    except ValueError as err:
        print(err.args)

def load_json(session, name, json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
        artifact_entry = database.db.Artifacts(name= name, data= data   )
        session.add(artifact_entry)

def delete_table(engine, tablename):
    tablename = tablename.lower()
    if tablename == 'artifacts':
        database.db.Artifacts.__table__.drop(engine)
    elif tablename == 'fortune500':
        database.db.Fortune500.__table__.drop(engine)
    elif tablename == 'loginevent':
        database.db.LoginEvent.__table__.drop(engine)
    elif tablename == 'users':
        database.db.Users.__table__.drop(engine)

def get_db_names(engine):
    inspector = inspect(engine)
    databases = inspector.get_schema_names()
    print(databases)

def prepare():
    engine = create_engine("sqlite:///:memory", echo=True, future=True)
    metadata = database.db.Base.metadata.create_all(engine) # generates schema or tables in our target db
    return engine , metadata

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


