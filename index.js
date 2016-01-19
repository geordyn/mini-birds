var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongojs = require('mongojs');

var app = express();


app.use(bodyParser.json());

var nodePort = 3000;
var ObjectId = require('mongodb').ObjectId;


//How to connect to Database:

//run 'mongod'

var db = mongojs('birds', ['sightings']);

app.post('/api/sighting', function(req, res) {
  var dataToInsert = req.body;
  db.sightings.insert(dataToInsert, function(err, result) {
    if (err) {
      res.status(500).end();
    }
    res.send(result);
  });
});

app.get('/api/sighting', function(req, res) {
  // db.getCollection('users').find({$and: [{dm_id: {$lt : 1000}}, {dm_id: {$gt: 900}}]})
  db.sightings.find({}, function(err, result) {
    res.send(result);
  });
  console.log('get hit');
});

app.delete('/api/sighting/:id', function(req, res) {
  var idToDelete = ObjectId(req.params.id);
  db.sightings.remove({ _id: idToDelete}, function(err, result){
    if(err){
      res.status(500).end();
    }
    res.send("successfully deleted record");
  });
  console.log('delete hit');
});

app.put('/api/sighting/:id', function(req, res) {
  console.log('update request received');
  var idToModify = ObjectId(req.params.id);
  var updateObject = {
    query: {_id: idToModify},
    update: {$set: req.body},
    new: false
  };
  db.sightings.findAndModify(updateObject, function(err, result){
    res.send(result);
  });
  console.log('put hit');

});


app.listen(nodePort, function() {
  console.log('now listening at port ' + nodePort);
});
