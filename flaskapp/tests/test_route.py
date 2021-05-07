import pytest
import json
import os
import ast

root = os.path.dirname((os.path.dirname(__file__)))
json_url = os.path.join(root, 'tests/test.json')

def test_landing_page(app, client):
    """test '/' route for 200 ok"""
    res = client.get('/')
    assert res.status_code == 200

def test_home(app, client):
    """test '/index.html' route for 200 ok"""
    res = client.get('/index.html')
    assert res.status_code == 200

def test_new(app, client):
    """test '/new.html' route for 200 ok"""
    res = client.get('/new.html')
    assert res.status_code == 200

def test_data(app, client):
    """test if '/data' route returns data"""
    res = client.get('/data')
    with open(json_url) as json_file:
        data = json.load(json_file)
    
    reply = res.data
    decoded_reply = ast.literal_eval(reply.decode("UTF-8"))

    print(reply)

    assert decoded_reply == data