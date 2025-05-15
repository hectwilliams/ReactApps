import os 
import database.db
import pandas as pd 
from sqlalchemy import insert , text
import json 

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

