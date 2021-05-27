# Imported libraries
from json.decoder import JSONDecodeError
from flask import Flask, render_template, request
from flask_cors import CORS
from flaskapp.models.managesub import to_json, rm_json, rw_json, clear_json
import json, os, sys

# Flask app
app = Flask(__name__)
CORS(app)

# Agnostic filepath for root directory
site_root = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(site_root, 'subs.json')

@app.route("/")
def landing_page():
    """
    Display the homepage for the Subscriberfier
    """
    return render_template('index.html')

@app.route('/addsub', methods=['POST'])
def addsub():
    """
    Writes subscription information to subs.json file
    """
    # request data
    # data should be in format {"subs": [{"id": int, "name": str, "cost": str, "period": str, "date": str}], "id": int}
    # keys should be ["id", "name", "cost", "period", "date"]
    subdata = request.json

    try:
        if (list(subdata.keys())[0]) == 'subs':
            sublist = list(subdata.values())[0][0]
            keys = list(sublist.keys())
            # Check for matching keys
            if "id" and "name" and "cost" and "period" and "date" in keys:
                # Write data to file
                to_json(json_url, subdata)
                print('data added successfully')
            else:
                print(f'Invalid keys. Error:\n{keys}')
        else:
            print(f'Invalid format. Error:\n{subdata}')
    except AttributeError:
        print(f'Invalid attribute. Error:\n{subdata}')
    return f'', 200

@app.route('/delsub', methods=['POST'])
def delsub():
    """
    Deletes subscription entry from JSON based on id.
    """
    # request id
    # id must be int
    id = request.form['num']
    try:
        n = int(id)
        # Delete subscription from file
        rm_json(json_url, n)
        print('subscription deleted successfully')
    except TypeError:
        print(f'{id} is invalid. id must be number')
    return f'', 200

@app.route('/upsub', methods=['POST'])
def upsub():
    """
    Updates subs.json with new data
    """
    # request new data
    # data should be in format {'id': int, 'name': str, 'cost': str, 'period': str, 'date': str}
    correct_keys = ["id", "name", "cost", "period", "date"]
    payload = request.json
    
    try:
        payload_keys = list(payload.keys())
        if payload_keys.sort() == correct_keys.sort():
            # Update file with new subscription data
            rw_json(json_url, payload)
            print('subscription updated successfully')
        else:
            print(f'Invalid keys. Keys should be:\n["id", "name", "cost", "period", "date"]. Error:\n{payload_keys}')
    except TypeError:
        print(f'Invalid format. Error:\n{payload}')

    return f'', 200

@app.route('/clear', methods=['POST'])
def clear():
    """
    Clears subs.json file
    """
    # Clear subs.json
    data = clear_json(json_url)
    print("subs.json file has been cleared")

    return f'', 200

@app.route('/data', methods=['GET'])
def data():
    """
    Hosts subscription data which can be retrieved in web-app
    """
    try:
        # Open subs.json
        with open(json_url) as json_file:
            data = json.load(json_file)
        print(f'subs.json successfully returned')
        return data
    except JSONDecodeError:
        # If cannot JSONDecode, clear subs.json
        data = clear_json(json_url)
        print(f'subs.json cleared')
        return data
    except FileNotFoundError:
        # If subs.json doesn't exist, initialize file with {"subs": []}
        data = {"subs": []}
        with open(json_url, mode='w+') as f:
            f.write(json.dumps(data))
        print(f'subs.json created')
        return data

if __name__ == "__main__":
    app.run()
