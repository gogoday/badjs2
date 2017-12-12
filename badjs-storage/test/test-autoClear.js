/**
 * Created by chriscai on 2015/1/14.
 */

var MongoClient = require('mongodb').MongoClient;

global.MONGODB = { 
    url : "mongodb://localhost:27017/badjs",
}

global.pjconfig = {
    maxAge: 5
}



 var clear = require('./../service/autoClear');

 clear();





