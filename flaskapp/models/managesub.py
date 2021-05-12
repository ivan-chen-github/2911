# Imported Libraries
import json
# import requests

def to_json(file, payload):
    """
    Takes payload data and writes it to a JSON file. JSON file must be initialized with an empty list first.

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
        for list in data.values():
            # For each dict in the list, enumerate it to get the index of each dict
            for i, d in enumerate(list):
                # if there is a dictionary with key "id" matching the id parameter
                if d["id"] == id:
                    # remove that dictionary from the list of dicts
                    list.pop(i)

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

    :param: id: id number
    :type: int
    
    """
    # both loops  go into the payload data and extract the id from the dict data
    for new_list in payload.values():
        for payload_d in new_list:
            matched_id = payload_d['id']# this is the id used to match with the current data
            new_payload_vals = payload_d
    
    # initialize the new dict and list to append all changed & unchanged contents
    new_dict = {}
    new_values_list = []
    # Open file as read
    with open (file, mode='r') as f:
        # load the current json data into variable datastore
        datastore = json.load(f)
        # get the listed values from the key "subs": [all data here]
        for list in datastore.values():
            # loops into each dict inside that that list
            for d in list:
                # loops into each singular dict key & value in that dict
                for key, value in d.items():
                    # if the key is 'id' and the value matches the value of the payload id - it executes
                    if key == 'id' and value == matched_id:
                        d = new_payload_vals
                # appends those dictonary values after each iteration (changed or unchanged)
                new_values_list.append(d)
    
    # this creates a new dict with the same 'subs' as key with the new values
    new_dict['subs'] = new_values_list
    # opens the subs.json file and writes the dictonary (same key) with the
    with open (file, mode='w') as new_json:
        json.dump(new_dict, new_json)


def clear_json(file):
    """
    Opens file and clears all content

    :param: file: file path
    :type: str
    """

    with open(file, mode='r+') as f:
        f.seek(0)
        f.truncate()