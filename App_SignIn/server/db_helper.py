import os 
import database.db
import pandas as pd 
import json 
from sqlalchemy import create_engine , inspect, insert, text
from sqlalchemy.orm import declarative_base, sessionmaker

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
        df.to_sql(database.db.Fortune500.__tablename__, con=engine, if_exists='replace', index=False)
    except ValueError as err:
        print(err.args)

def load_startup_json(session, json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
        values = {'data_json' : json.dumps(data), 'name': 'startup'}
        stmt = text("INSERT INTO Artifacts (name, data) VALUES (:name, :data_json)")
        session.execute(stmt, values)
        session.commit()


def load_movies_json(session, json_file):
    with open(json_file,'r') as file:
        data = json.load(file)
        values = {'data_json' : json.dumps(data), 'name': 'movies'}
        stmt = text("INSERT INTO Artifacts (name, data) VALUES (:name, :data_json)")
        session.execute(stmt, values)
        session.commit()

def load_pages_json(session, json_file):
    with open(json_file,'r') as file:
        data = json.load(file)
        values = {'data_json' : json.dumps(data), 'name': 'movies'}
        stmt = text("INSERT INTO Artifacts (name, data) VALUES (:name, :data_json)")
        session.execute(stmt, values)
        session.commit()

def delete_table(session, name):
    prefix= ""
    values = {'tablename': name} 
    stmt = text("DROP TABLE :tablename")
    session.execute(stmt, values)
    session.commit()

def prepare():
    engine = create_engine("sqlite:///:memory", echo=True, future=True)
    declarative_base().metadata.create_all(engine) # generates schema or tables in our target db
    return engine 

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


