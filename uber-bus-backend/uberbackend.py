from flask import Flask, flash, request, jsonify, render_template, redirect, url_for, g, session, send_from_directory, abort
from flask_cors import CORS
from flask_api import status
from datetime import date, datetime, timedelta
from calendar import monthrange
from dateutil.parser import parse
import pytz
import os
import sys
import time
import uuid
import json
import random
import string
import pathlib
import io
from uuid import UUID
from bson.objectid import ObjectId

# straight mongo access
from pymongo import MongoClient

mongo_client = MongoClient("mongodb+srv://pritesh:pritesh@cluster0.y9bhh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))

def atlas_connect():
    client = pymongo.MongoClient("mongodb+srv://pritesh:pritesh@cluster0.y9bhh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.test   

def tryexcept(requesto, key, default):
    lhs = None
    try:
        lhs = requesto.json[key]
        # except Exception as e:
    except:
        lhs = default
    return lhs

## seconds since midnight
def ssm():
    now = datetime.now()
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return str((now - midnight).seconds)


#Endpoints to handle bus bookings
@app.route("/api/getoperator", methods=["GET","POST"])
def getOperator():
    db = mongo_client['busbookings']
    opcollection = db['operators']
    source = request.json['source']
    destination = request.json['destination']
    date = request.json['date']
    print(type(date))
    print('Date: ', date)
    date = date.split("T")
    date = date[0]+"T00:00:00.000+00:00"
    print("Source: ", source)
    print("Destination: ", destination)
    print('After Date split: ', date)
    query = opcollection.find({'source': source,
    'destination': destination,
    'date': date
    })    
    print(query)
    if query == None:
        return jsonify({"message": "No operators found"}), 200
    operator = {} 
    i = 0
    for x in query: 
        operator[i] = x 
        operator[i].pop('_id') 
        i += 1
    print("Number of Operators: ", len(operator))
    print("Operators: ", operator)
    if len(operator) < 1:
        return jsonify({"message": "No operators has seats available"}), 200
    return jsonify(operator), 200

#endpoint to get all bookings
@app.route("/api/getbookings", methods=["GET","POST"])
def getAllBookings():
    db = mongo_client['busbookings']
    busbookings = db['bookings']
    email = request.json['email']
    query = busbookings.find({'email': email})
    if query == None:
        return jsonify({"message": "No bookings found"}), 200
    bookings = {} 
    i = 0
    for x in query: 
        bookings[i] = x 
        bookings[i].pop('_id') 
        i += 1
    print("Bookings: ", bookings)
    return jsonify(bookings), 200

@app.route("/api/addbooking", methods=["GET","POST"])
def addBooking():
    db = mongo_client['busbookings']
    busbookings = db['bookings']
    email = request.json['email']
    source = request.json['source']
    destination = request.json['destination']
    date = request.json['date']
    date = date.split("T")
    date = date[0]+"T00:00:00.000+00:00"
    operator = request.json['operator']
    opcollection = db['operators']
    opObj = {'source': source,
    'destination': destination,
    'date': date,
    'name': operator
    }
    print('Operator')
    print(operator)
    queryOp = opcollection.find_one(opObj)

    if queryOp == None:
        return jsonify({'message': 'Operator not available'}), 200
    elif queryOp["quantity"] < 1:
        return jsonify({'message': 'Requested operator has no tickets available'}), 200
    opQuantity = { "$set": { 'quantity': queryOp["quantity"]-1 } } 
    
    queryOp = opcollection.update_one(opObj, opQuantity)
    if queryOp == None:
        return jsonify({'message': 'Error in update operator quantity'}), 200

    booking = {'email': email,
    'source': source,
    'destination': destination,
    'date': date,
    'operator': operator
    }
    
    query = busbookings.insert_one(booking)
    print("Inserted booking: ", query)
    if query:
        return jsonify({"message": "Booking successfull"}), 200
    else:
        return jsonify({"message": "Error inserting booking"}), 200


#endpoint to register user
@app.route("/api/signup", methods=["GET","POST"])
def signUp(): 
    db = mongo_client['busbookings']
    users = db['users']
    fname = request.json['fname']
    lname = request.json['lname']
    password = request.json['password']
    email = request.json['email']
	
    result = {}
    queryObject = {"email":email}
    user = users.find_one(queryObject)
    if user != None:
        return jsonify({"message": "Email Address already exists. Kindly use a different one"}), 200
    else:
        uber_user = { 'fname': fname, 
        'lname': lname, 
        'email': email,
        'password': password
        }

        query = users.insert_one(uber_user)
        print("User inserted ", query)
    
        if query:
            return jsonify({"message": "User added successfully"}), 200
        else:
            return jsonify({"message": "Error adding user"}), 400

@app.route("/api/delete", methods=["GET","POST"])
def deletebooking(): 
    db = mongo_client['busbookings']
    bookings = db['bookings']
    users = db['users']
    email = request.json['email']
    source = request.json['source']
    destination = request.json['destination']
    date = request.json['date']
    operator = request.json['operator']

    booking = {'email': email,
    'source': source,
    'destination': destination,
    'date': date,
    'operator': operator
    }
    query = bookings.delete_one(booking)
    opcollection = db['operators']
    opObj = {'source': source,
    'destination': destination,
    'date': date,
    'name': operator
    }
    queryOp = opcollection.find_one(opObj)

    if queryOp == None:
        return jsonify({'message': 'Operator not found'}), 200

    opQuantity = { "$set": { 'quantity': queryOp["quantity"]+1 } } 
    print("New Quantity: ", opQuantity)    
    print("Deleted user: ", query)    
    queryOp = opcollection.update_one(opObj, opQuantity)

    if queryOp == None:
        return jsonify({'message': 'Error in update operator quantity'}), 200
    print("Updated quantity: ", queryOp)
    if query:
        return jsonify({"message": "Booking deletion successfully"}), 200
    else:
        return jsonify({"message": "Error deleting booking"}), 400

# endpoint to login
@app.route('/api/signin', methods=["GET","POST"]) 
def signIn(): 
    print('Inside Sign In')
    email = request.json['email']
    password = request.json['password']
    print('Email: ', email)
    queryObject = {"email" : email}    
    db = mongo_client['busbookings']
    users = db['users']
    query = users.find_one(queryObject)
    if query == None:
        return jsonify({'message': 'No user found'}), 200 
    else:
        print('Inside else of signin')
        if query['email'] != email:
            return jsonify({"message": "Incorrect email address"}), 200
        elif query['password'] != password:
            return jsonify({"message": "Incorrect password"}), 200
        else:
            return jsonify({"message": "User logged in successfully",
            "fname": query['fname'],
            "lname": query['lname'],
            "email": query['email'],
            "isLoggedIn": 'true'}), 200 

@app.route('/test', methods=["GET"])
def test(): 
    return "Test"

##################
# ADMINISTRATION #
##################

# This runs once before the first single request
# Used to bootstrap our collections
# @app.before_first_request
# def before_first_request_func():
#     applyCollectionLevelUpdates()

# # This runs once before any request
# @app.before_request
# def before_request_func():
#     applyRecordLevelUpdates()


############################
# INFO on containerization #
############################

# To containerize a flask app:
# https://pythonise.com/series/learning-flask/building-a-flask-app-with-docker-compose

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')
