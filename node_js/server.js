var express = require('express');
var bodyParser = require('body-parser');

// create express app
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a api for add data
app.post('/api/data_add',function (req, res){
    var json = req.body;
    console.log("temp:" + json.temp);
    console.log("humid:" + json.humid);
    res.status(200).json({"message": "data accept success"});

    // Connect to mongodb
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/mymondb';
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        console.log('mongo is running');
        var db = client.db("mymondb"); 
        db.collection('weather',function(err,collection){
             collection.insert({temp:json.temp,humid:json.humid});
             console.log("data add");
        });
        client.close();
    });
});

// define a api for update data
app.post('/api/data_update',function (req, res){
    var json = req.body;
    console.log("id:" + json.id);
    console.log("temp:" + json.temp);
    console.log("humid:" + json.humid);
    res.status(200).json({"message": "data accept success"});

    // Connect to mongodb
    var MongoClient = require('mongodb').MongoClient;
    var id = require('mongodb').ObjectID(json.id);
    var url = 'mongodb://localhost:27017/mymondb';
    var newvalue = {$set: {temp:json.temp, humid:json.humid}};
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        var db = client.db("mymondb");
        // Find id and delete data
        db.collection('weather').updateOne({'_id':id}, newvalue, function(err, doc){
            if(!doc) throw err;
            console.log("data update");
        });
        client.close();
    });
});

// define a api for delete data
app.post('/api/data_delete',function (req, res){
    var json = req.body;
    console.log("id:" + json.id);
    res.status(200).json({"message": "data accept success"});
    // Connect to mongodb
    var MongoClient = require('mongodb').MongoClient;
    var id = require('mongodb').ObjectID(json.id);
    var url = 'mongodb://localhost:27017/mymondb';
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        var db = client.db("mymondb");
        // Find id and delete data
        db.collection('weather').findOne({'_id':id},function(err, doc1){
            if(!doc1) {
               return console.log("can not find data");
            }
            console.log("find data");
            db.collection('weather').deleteOne({'_id':id},function(err, doc2){
            if(!doc2) throw err;
            console.log("data delete");
            client.close();
            });
        });
    });
});

// define a api for get all of data
app.get('/api/data_getall', function(req, res){
    var json = req.body;
    res.status(200).json({"message": "data accept success"});

    // Connect to mongodb
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/mymondb';
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        var db = client.db("mymondb");
        // Find all of data
        db.collection("weather").find({}).toArray(function(err, res){
            if (err) throw err;
            console.log(res);
            client.close();
        });
    });
});

// define a simple route
app.get('/', function(req, res){
    res.json({"message": "Welcome to demo application"});
});

// listen for requests
var server = app.listen(3000, "127.0.0.1", function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
});
