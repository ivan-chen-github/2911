# Imported Libraries
from models.managesub import to_json, rm_json, clear_json, rw_json
import pytest, os, json

# Filepath
root = os.path.dirname((os.path.dirname(__file__)))
json_url = os.path.join(root, 'tests/test.json')

def test_to_json():
    """ test to if there is a score.json file and compares to what should be in there"""
    # test data
    payload = {"subs": [{"id": 1, "name": "dummy", "cost": "9.99", "period": "month", "date": "2021-05-20"}], "id": 1}

    # write data to file
    to_json(json_url, payload)
    
    # check file contents
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data)
        assert data == {"subs": [{"id": 1, "name": "dummy", "cost": "9.99", "period": "month", "date": "2021-05-20"}], "id": 1}


def test_rw_json():
    """ test if entry is edited/updated """
    # updated data
    payload = {"id": 1, "name": "dummy2", "cost": "99.99", "period": "month", "date": "2021-05-20"}

    # update file
    rw_json(json_url, payload)

    # check file has been updated
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data)
        assert data == {"subs": [{"id": 1, "name": "dummy2", "cost": "99.99", "period": "month", "date": "2021-05-20"}], "id": 1}


def test_rm_json():
    """ test if entry is cleared from file """
    # remove dictionary with id 1
    rm_json(json_url, 1)

    # check if the file has been rewritten
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data)

        assert data == {"subs": [], "id": 1}


def test_clear_json():
    """ test if file is cleared of all contents """
    # clear the file contents
    clear_json(json_url)

    # check if file is empty
    with open(json_url, mode='r') as f:
        data = json.load(f)

        assert data == {"subs": []}
