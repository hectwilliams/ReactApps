from flask import Flask  
from flask import redirect, url_for, render_template_string,render_template, request,jsonify, make_response, abort, g
from flask_sqlalchemy import SQLAlchemy
import json 
import server.myauth
import database.db
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select , text, create_engine , inspect
import os 
import sys 
import numpy as np 
import server.db_helper

MODULE_NAME = 'app'

engine = server.db_helper.prepare()
Session = sessionmaker(engine)
inspector_gadget = inspect(engine)
db_session = Session()

#  delete table
#  database.db.Fortune500.__table__.drop(current_engine)
# database.db.Artifacts.__table__.drop(current_engine)

# load data to table 
# database.db.load_csv_data_fortune(current_engine, os.path.join(os.getcwd(),'bigdata', 'fortune.csv'))

# load pages json to table
# server.db_helper.delete_table(db_session, name='Artifacts')

# load startup json to table
# server.db_helper.load_startup_json(db_session, os.path.join(os.getcwd(), 'bigdata','startpage.json' ))

# load movies json to table
server.db_helper.load_movies_json(db_session, os.path.join(os.getcwd(), 'bigdata','movies.json' ))



app = Flask(__name__) # name of application's package

@app.route("/")
def home():
    return redirect(url_for('sign_in'))

@app.route("/signin", methods=['GET', 'POST'])
def sign_in():
    try :
        if request.method == 'POST':
            auth_user = server.myauth.AuthUser(request.get_json())
            values = {'uid' :auth_user.compute_uuid()}
            stmt = text("SELECT * FROM Users WHERE user_id = :uid")    # number rows meeting conditions
            result = db_session.execute(stmt, values)
            if result.scalar() or auth_user.get_username() == 'admin': #debug 
                return make_response(jsonify({}), 200)
            return make_response(jsonify(None), 404)
        elif request.method == 'GET': 
            if request.args.get('access') == 'true':
                return render_template('aihumans.html'), 200
            else:
                response = make_response(render_template('signin.html'))
                response.set_cookie('cookie_name', 'example')
                return response
    except Exception as e:
        return render_template('notfound.html'), 404
    
@app.route("/signup", methods=['POST'])
def sign_up():
    try:
        auth_user = server.myauth.AuthUser(request.get_json())
        data = auth_user.process_user()
        user = database.db.Users(
            user_id=data['user_id'], 
            user=data['username'], 
            hash=data['hash'], 
            salt=data['salt'], 
            firstname=data['firstname'],
            lastname=data['lastname'] 
        )
        db_session.add(user)  
        db_session.commit()
        return make_response(jsonify({}), 200)
    except:
        abort(404, description="Resource not found")

@app.route("/aihumans")
def aihumans():
    try:
        if request.args.get('req') == 'startup':
            stmt = text(f"SELECT data FROM Artifacts WHERE name =\"startup\"")    # number rows meeting conditions
            result = db_session.execute(stmt)
            data_json = result.fetchone()[0]
            return make_response(jsonify(data_json ), 200)
        elif request.args.get('req') == 'movies':
            batch_size = 4
            stmt = text(f"SELECT data FROM Artifacts WHERE name =\"movies\"")    # number rows meeting conditions
            result = db_session.execute(stmt)
            data = [ list(ele) for ele in result.fetchall()]
            return make_response(jsonify(data), 200)
        else:
            response = make_response(render_template('aihumans.html'))
            return response
        # return render_template('aihumans.html'), 200
        # response.set_cookie('cookie_name', 'example')
    except:
        return render_template('notfound.html'), 404

@app.route("/fortune", methods=['GET'])
def fortune():
    try:
        year = request.args.get('year') 
        values = {'year': year}
        stmt = text(f"SELECT * FROM Fortune500 WHERE year = :year LIMIT 100")    # number rows meeting conditions
        result = db_session.execute(stmt, values)
        data = np.array([list(ele) for ele in result.fetchall()])
        return make_response(jsonify( data.tolist()), 200) 
    except:
        return render_template('notfound.html'), 404


if __name__ == '__main__':
    app.run(debug=True)