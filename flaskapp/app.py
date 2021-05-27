# Imported libraries
from json.decoder import JSONDecodeError
from flask import Flask, render_template, request
from flask_cors import CORS
import json, os, sys

# Functions
def to_json(file, payload):
    """
    Takes payload data and writes it to a JSON file. JSON file should be initialized with {"subs": []}

    :param: file: file path
    :type: str

    :param: payload: data to be written to the file
    :type: str
    """

    # Open file as write and dump JSON payload to file
    with open(file, mode='w') as json_file:
        json.dump(payload, json_file)


def rm_json(file, id):
    """
    Finds the dictionary matching the id and rewrites the file without that dictionary

    :param: file: file path
    :type: str

    :param: id: id number
    :type: int
    """

    # Open file as read
    with open(file, mode='r') as json_file:
        # Load the data as JSON data
        data = json.load(json_file)
        # Get the values inside the JSON data and return the list of data
        for i,sub in enumerate(data["subs"]):
            if sub["id"] == id:
                data["subs"].pop(i)

    # Open file again as read/write
    with open(file, mode='r+') as f:
        # Go to the beginning of the file
        f.seek(0)
        # Delete the current data in the file
        f.truncate()
        # Write the new data from above to the file
        f.write(json.dumps(data))


def rw_json(file, payload):
    """
    Reads current apps.json file and rewrites to the json file with new values

    :param: file: file path
    :type: str

    :param: payload: new updated data
    :type: dict
    
    """

    with open (file, mode='r') as json_file:
        # load the current json data into variable datastore
        datastore = json.load(json_file)
        # get the listed values from the key "subs": [all data here]
        subs_list = datastore["subs"]

        datastore["subs"] = [payload if sub["id"] == payload["id"] else sub for sub in subs_list] 

    with open (file, mode='w') as f:
        json.dump(datastore,f)


def clear_json(file):
    """
    Opens file and clears subscription entries. Resets file back to {"subs": []}

    :param: file: file path
    :type: str
    """

    init_json = {"subs": []}

    with open(file, mode='r+') as f:
        f.seek(0)
        f.truncate()
        f.write(json.dumps(init_json))

    return init_json

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
