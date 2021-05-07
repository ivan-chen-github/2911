# Imported Libraries
import json
import requests

def to_json(file, payload):
    """
    Takes payload data and writes it to a JSON file. JSON file must be initialized with an empty list first.

    :param: file: file path
    :type: str

    :param: payload: data to be written to the file
    :type: str
    """
    with open(file) as json_file:
        data = json.load(json_file)
    with open(file, mode='w') as f:
        data.append(json.loads(payload))
        json.dump(data, f)

def rm_json(file, id):
    """
    Opens file and deletes an entry based on id

    :param: file: file path
    :type: str

    :param: id: id number
    :type: int
    """
    with open(file) as json_file:
        data = json.load(json_file)
    with open(file, mode='w') as f:
        for index, d in enumerate(data):
            if d["id"] == id:
                print(d)
                data.pop(index)
