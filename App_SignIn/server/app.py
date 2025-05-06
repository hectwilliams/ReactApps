import os 
import requests
from flask import Flask  
from flask import redirect, url_for, render_template_string,render_template

URI = os.path.join(os.getcwd(), '../', 'client','public','index.html' )
MODULE_NAME = 'app'
app = Flask(__name__) # name of application's package

@app.route("/")
def home():
    return redirect(url_for('sign_in'))

@app.route("/signin")
def sign_in():
    try:
        return render_template('index.html'), 200
    except:
        return render_template('notfound.html'), 404

if __name__ == '__main__':
    app.run(debug=True)