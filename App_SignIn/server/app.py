from flask import Flask  
from flask import redirect, url_for, render_template_string,render_template, request,jsonify, make_response
import json 

MODULE_NAME = 'app'
app = Flask(__name__) # name of application's package

def check_signin ():
    return json.dump({'status', 'ready'})

@app.route("/")
def home():
    return redirect(url_for('sign_in'))

@app.route("/signin", methods=['GET', 'POST'])
def sign_in():
    try:
        if request.method == 'POST':
            response = {
                'message': 'received username and password',
                'data' : request.get_json()
            }
            return make_response(jsonify(response), 200)
        else:
            return render_template('signin.html'), 200
    except:
        return render_template('notfound.html'), 404

@app.route("/aihumans")
def aihumans():
    try:
        return render_template('aihumans.html'), 200
    except:
        return render_template('notfound.html'), 404

if __name__ == '__main__':
    app.run(debug=True)