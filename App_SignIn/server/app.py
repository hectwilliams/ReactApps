from flask import Flask  
from flask import redirect, url_for, render_template_string,render_template, request,jsonify, make_response, abort, g, send_file, Response
from flask_cors import CORS
import server.myauth
import database.db
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select , text, create_engine , inspect
import numpy as np 
import server.db_helper
import os 
import requests
import shutil
import tempfile
import array

MODULE_NAME = 'app'
CONFIG_DATABASE = True
DB_NAME='main'
engine, metadata = server.db_helper.prepare()
Session = sessionmaker(engine)
db_session = Session()
inspector_gadget = inspect(engine)

# database name(s)
# server.db_helper.get_db_names(engine)

# delete a table 
# server.db_helper.delete_table(engine, tablename='Artifacts')
# metadata = database.db.Base.metadata.create_all(engine) # generates schema or tables in our target db

# load Artifacts to table
# server.db_helper.load_json(db_session, 'startup', os.path.join(os.getcwd(), 'bigdata','startpage.json' )) 
# server.db_helper.load_json(db_session, 'movies' ,os.path.join(os.getcwd(), 'bigdata','movies.json' ))
# db_session.commit()  

app = Flask(__name__) # name of application's package
CORS(app) # make request to domain different from this server 

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
        elif request.args.get('req') == 'personsnotexist':
            
            img_resp = requests.get(
                url="https://thispersondoesnotexist.com",
                stream=True
            )

            print(img_resp.status_code)
            print(img_resp.request.body)
            print(img_resp.request.headers)
            print(img_resp.request.url)
            print(img_resp.encoding)
            print(img_resp.headers)

            data = array.array('B', img_resp.raw.read() )
 
            return make_response(jsonify( data.tolist() ), 200)
        
        elif request.args.get('req') == 'wavesmeta':

            return make_response({'testing': 1234}, 200)

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