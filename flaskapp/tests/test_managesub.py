from models.managesub import to_json, rm_json
import pytest
import os
import json

# Filepath
root = os.path.dirname((os.path.dirname(__file__)))
json_url = os.path.join(root, 'tests/test.json')

def test_to_json():
    """ test to if there is a score.json file and compares to what should be in there"""
    # test data
    payload = '{"id": 1, "name": "dummy", "cost": 9.99, "period": "monthly", "date": "2021-01-01"}'

    # write data to file
    to_json(json_url, payload)
    
    # check file contents
    with open(json_url, mode='r') as f:
        data = json.load(f)
        print(data[0])
        if data[0] == {"id": 1, "name": "dummy", "cost": 9.99, "period": "monthly", "date": "2021-01-01"}:
            assert True
        else:
            assert False

def test_rm_json():
    """ test if entry is cleared from file """
    # remove dictionary with id 1
    rm_json(json_url, 1)

    # check if the file has been rewritten
    with open(json_url, mode='r') as f:
        data = json.load(f)
        # print(data)
        assert data == []

