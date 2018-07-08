'use strict';
const express = require('express');
const app = express();
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.ACCESS_ID, secretAccessKey:  process.env.SECRET_ACCESS_KEY, region: process.env.REGION});
var db = new AWS.DynamoDB();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;

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

app.listen(port, () =>
  console.log(`Server is listening on port ${port}.`)
)
