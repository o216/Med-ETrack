'use strict';
const express = require('express');
const app = express();
var AWS = require('aws-sdk');
//config update goes here
var db = new AWS.DynamoDB();

app.get('/', (req, res) => {
  var params = {
    TableName : 'Med-ETrack'
  }

  db.scan(params, function(err, data) {
    if (err) {
      console.log(err);
      }
    else {
      console.log(data);
      res.send(data);
      }
  });

});

module.exports = app;
