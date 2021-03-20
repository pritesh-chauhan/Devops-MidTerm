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

mongo_client = MongoClient("mongodb+srv://admin:admin@busbookings.27hkg.mongodb.net/busbookings?retryWrites=true&w=majority")

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))

 

def atlas_connect():
    client = pymongo.MongoClient("mongodb+srv://admin:admin@busbookings.27hkg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.test   

#methods to add to database

def insert_one(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['busbookings']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...insert_one() to mongo: ", r)
        try:
            mongo_collection = db['busbookings']
            result = mongo_collection.insert_one(r)
            print("inserted _ids: ", result.inserted_id)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to insert_one.") 

def update_one(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['busbookings']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...update_one() to mongo: ", r)
        try:
            mongo_collection = db['busbookings']
            result = mongo_collection.update_one(
                {"_id" : r['_id']},
                {"$set": r},
                upsert=True)
            print ("...update_one() to mongo acknowledged:", result.modified_count)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to update_one.")

def insert_many(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['busbookings']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...insert_many() to mongo: ", r.values())
        try:
            mongo_collection = db['busbookings']
            result = mongo_collection.insert_many(r.values())
            print("inserted _ids: ", result.inserted_ids)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to insert_many.")

def update_many(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['busbookings']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...insert_many() to mongo: ", r.values())
        # much more complicated: use bulkwrite()
        # https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite
        ops = []
        records = r
        print("...bulkwrite() to mongo: ", records)
        for one_r in records.values():
            op = dict(
                    replaceOne=dict(
                        filter=dict(
                            _id=one_r['_id']
                            ),
                        replacement=one_r,
                        upsert=True
                    )
            )
            ops.append(op)
        try:
            mongo_collection = db['busbookings']
            result = mongo_collection.bulkWrite(ops, ordered=True)
            print("matchedCount: ", result.matchedCount)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to update_many.")

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

@app.route("/getOperator/<argument>/<value>/", methods=["POST"])
def findOp(argument, value):
    db = mongo_client['busbookings']
    opcollection = db['operators']
    #queryObject = {argument:value}
    # operator => src, dest, date, quantity

    #this line filters the operators based on src and date and quantity
    query = opcollection.find({"src":argument, "dst":value, "quantity":{"$gt":1}})
    query.pop('_id') 
    return jsonify(query)


#endpoint to get all bookings

@app.route("/getbookings", methods=["GET"])
def get_tweets2():
    db = mongo_client['busbookings']
    busbookings = db['bookings']
    return jsonify(busbookings)

@app.route("/addBooking", methods=["POST"])
def add_booking():
    db = mongo_client['busbookings']
    busbookings = db['bookings']
    user = request.json['user']
    source = request.json['source']
    destination = request.json['destination']
    operator = request.json['operator']

    # find_one based on date, src and dest  => object of operator that will have quantity field just decrement it by one
    #startdate = request.json['startdate']
    date = request.json['date']
    booking = dict(user=user, source=source, destination=destination,
                    date=date, operator=operator,_id=str(ObjectId()))
    busbookings[booking['_id']] = booking
    
        #return a message if no data is found
        #send statuscode
    return jsonify(booking)


#endpoint to register user
@app.route("/signup", methods=["GET","POST"])
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
        return jsonify({"message": "Email Address already exists. Kindly use a different one!"}), 200
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
            return jsonify({"message": "Error adding user"+ query}), 400


# endpoint to login
@app.route('/sign-in/<argument>/<value>/', methods=['GET']) 
def findOne(argument, value): 
    db = mongo_client['busbookings']
    users = db['users']
    queryObject = {argument: value} 
    query = users.find_one(queryObject) 
    query.pop('_id') 
    return jsonify(query) 

@app.route('/update/<key>/<value>/<element>/<updateValue>/', methods=['GET']) 
def update(key, value, element, updateValue): 
    db = mongo_client['busbookings']
    users = db['users']
    queryObject = {key: value} 
    updateObject = {element: updateValue} 
    query = users.update_one(queryObject, {'$set': updateObject}) 
    if query.acknowledged: 
        return "Update Successful"
    else: 
        return "Update Unsuccessful"

##################
# ADMINISTRATION #
##################

# This runs once before the first single request
# Used to bootstrap our collections
@app.before_first_request
def before_first_request_func():
    applyCollectionLevelUpdates()

# This runs once before any request
@app.before_request
def before_request_func():
    applyRecordLevelUpdates()


############################
# INFO on containerization #
############################

# To containerize a flask app:
# https://pythonise.com/series/learning-flask/building-a-flask-app-with-docker-compose

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
