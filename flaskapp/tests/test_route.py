# Imported Libraries
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

# def test_addsub(app, client):
#     """test if /addsub route adds data to file"""
#     payload = {'subs': [{'id': 2, 'name': 'dummy', 'cost': '9.99', 'period': 'month', 'date': '2021-05-21'}], 'id': 2}
#     json_data = json.dumps(payload)
#     res = client.post('/addsub', json=json_data)

#     with open(json_url, mode='r') as f:
#         n = json.load(f)

#         assert n == payload