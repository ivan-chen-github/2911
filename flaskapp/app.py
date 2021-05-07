# Imported libraries
from flask import Flask, render_template
from flask_cors import CORS
from flask import request
from models.managesub import to_json
import json
import os

# Flask app
app = Flask(__name__)
CORS(app)

# Agnostic filepath for root directory
site_root = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(site_root, 'subs.json')

@app.route("/")
def landing_page():
    """
    Starting route that displays the main page
    """
    return render_template('index.html')

@app.route("/index.html")
def home():
    """
    Route for returning to homepage
    """
    return render_template('index.html')

@app.route("/new.html")
def new():
    """
    Route that displays new subscription page
    """
    return render_template('new.html')

# @app.route("note.html")
# def note():
#     """
#     Route that displays notes
#     """
#     return render_template('note.html')

@app.route('/addsub', methods=['POST'])
def addsub():
    """
    Writes subscription information to subs.json file
    """
    # request data
    subdata = request.form['sub_data']
    
    # append data to JSON
    to_json(json_url, subdata)

    return f'', 200


@app.route('/data', methods=['GET'])
def data():
    """
    Hosts subscription data which can be retrieved in web-app
    """
    with open(json_url) as json_file:
        data = json.load(json_file)
    return f'{data}'

if __name__ == "__main__":
    app.run()
    