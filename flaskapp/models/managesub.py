# Imported Libraries
import json
# import requests

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
