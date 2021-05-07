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

    # with open(file, mode='r+') as json_file:
    #     json.dump(payload, json_file)
    with open(file) as json_file:
        data = json.load(json_file)
    with open(file, mode='r+') as f:
        data.append(json.loads(payload))
        json.dump(data, f)

def rm_json(file, id):
    """
    Finds the dictionary matching the id and rewrites the file without that dictionary

    :param: file: file path
    :type: str

    :param: id: id number
    :type: int
    """
    with open(file, mode='r') as json_file:
        data = json.load(json_file)
        for i, d in enumerate(data):
            if d['id'] == 1:
                data.pop(i)

    with open(file, mode='r+') as f:
        f.seek(0)
        f.truncate()
        f.write(str(data))
