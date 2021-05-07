from models.managesub import to_json, rm_json, clear_json
import pytest
import os
import json

# Filepath
root = os.path.dirname((os.path.dirname(__file__)))
json_url = os.path.join(root, 'tests/test.json')

def test_to_json():
    """ test to if there is a score.json file and compares to what should be in there"""
    # test data
    payload = {"subs": [{"cost": 99, "date": "2021-05-06", "id": 2, "name": "Dummy", "period": "monthly"}]}

    # write data to file
    to_json(json_url, payload)
    
    # check file contents
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data)
        if data == {"subs": [{"cost": 99, "date": "2021-05-06", "id": 2, "name": "Dummy", "period": "monthly"}]}:
            assert True
        else:
            assert False

def test_rm_json():
    """ test if entry is cleared from file """
    # remove dictionary with id 1
    rm_json(json_url, 2)

    # check if the file has been rewritten
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data)

        assert data == {"subs": []}

def test_clear_json():
    """ test if file is cleared of all contents """
    # clear the file contents
    clear_json(json_url)

    # check if file is empty
    with open(json_url, mode='r') as f:
        f.seek(0)

        assert f.read(1) == ""
