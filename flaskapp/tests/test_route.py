# Imported Libraries
from typing import Type
import pytest, json, os, ast

root = os.path.dirname((os.path.dirname(__file__)))
json_url = os.path.join(root, 'subs.json')

def test_landing_page(app, client):
    """test '/' route for 200 ok"""
    res = client.get('/')
    assert res.status_code == 200


def test_data(app, client):
    """test if '/data' route returns data"""
    res = client.get('/data')
    with open(json_url) as json_file:
        data = json.load(json_file)
    # Get data from route
    reply = res.data
    # Decode bytestring
    decoded_reply = ast.literal_eval(reply.decode("UTF-8"))
    # Check data from route is same as data in file
    assert decoded_reply == data


def test_data_error(app, client):
    """test error checking in /data"""
    # open subs.json file
    with open(json_url, mode='w') as f:
        # rewrite file with empty string
        f.write('')
    # get request at /data
    res = client.get('/data')
    with open(json_url, mode='r') as f:
        n = json.load(f)
        # assert that file has been fixed
        assert n == {"subs": []}


def test_missing_json(app, client):
    """test app still works if subs.json is missing"""
    # delete subs.json file
    os.remove(json_url)
    # assert that file was deleted
    assert os.path.exists(json_url) == False
    # get request at /data which should create subs.json
    res = client.get('/data')
    # open subs.json
    with open(json_url, mode='r') as f:
        n = json.load(f)
        # assert that file is initialized with {"subs": []}
        assert n == {"subs": []}


def test_addsub(app, client):
    """test if /addsub route adds data to file"""
    # test data
    payload = {
    'subs': [{'id': 1, 'name': 'dummy', 'cost': '111.00', 'period': 'month', 'date': '2021-05-26'},
            {"id": 2, "name": "dummy2", "cost": "333.00", "period": "month", "date": "2021-05-26"}]
    }
    # test HTTP response, data as json
    res = client.post('/addsub', json=payload)
    # open subs.json and check file data equals payload data
    with open(json_url, mode='r') as f:
        n = json.load(f)
        assert n == payload


def test_addsub_error(app, client):
    """test error checking in /addsub"""
    # test error data
    payload = {'id': 1}
    # post the error data
    res = client.post('/addsub', json=payload)
    # assert that AttributeError is raised
    assert AttributeError


def test_upsub(app, client):
    """test if /upsub successfully edits file"""
    # test data
    payload = {'id': 1, 'name': 'dummy', 'cost': '999.00', 'period': 'month', 'date': '2021-05-26'}
    # test HTTP response, data as json
    res = client.post('/upsub', json=payload)
    # open subs.json and check that file data has been updated
    with open(json_url, mode='r') as f:
        n = json.load(f)
        assert n == {
        'subs': [{'id': 1, 'name': 'dummy', 'cost': '999.00', 'period': 'month', 'date': '2021-05-26'},
                {"id": 2, "name": "dummy2", "cost": "333.00", "period": "month", "date": "2021-05-26"}]
        }


def test_upsub_error(app, client):
    """test error checking in /upsub"""
    # test error data
    payload = 'invalid'
    # post the error data
    res = client.post('upsub', json=payload)
    # assert that TypeError is raised
    assert TypeError


def test_delsub(app, client):
    """test if /delsub sucessfully deletes entry"""
    # test HTTP response, data as {num:1}
    res = client.post('/delsub', data= dict(num = 1)) 
    # open subs.json and check that id1 has been deleted
    with open(json_url, mode='r') as f:
        n = json.load(f)
        assert n == {
        'subs': [{"id": 2, "name": "dummy2", "cost": "333.00", "period": "month", "date": "2021-05-26"}]
        }


def test_delsub_error(app, client):
    """test error checking in /delsub"""
    # post with error data
    res = client.post('/delsub', data = dict(num = 'invalid'))
    # assert that TypeError is raised
    assert TypeError


def test_clear(app, client):
    """test if /clear successfully deletes subs.json"""
    # test HTTP response, empty response
    res = client.delete('/clear')
    # assert that subs.json doesn't exist
    assert os.path.exists(json_url) == False
