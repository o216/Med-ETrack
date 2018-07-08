import * as messaging from "messaging";

//data from webApp - replace the text with the values
var API_KEY = "MYAPIKEYGOES HERE"; // TODO
var ENDPOINT = "https://medi-etrack-db.herokuapp.com/"; //TODO

//query the webApp for the medication data
function queryWebApp() {
  fetch(ENDPOINT)
  .then(function(response) {
    response.json()
    .then(function(data) {
      //print the data to see in the log
      console.log("Got JSON response from server: " + JSON.stringify(data));
      //create a json object of the data we actually need
      
      var medicineName = data.Items[0].medicineName.S;
      var rate = Number.parseFloat(data.Items[0].rate.N);//comes in hours
      var lastTimeTaken = data.Items[0].lastTimeTaken.S;//comes in unix timestamp as string
      //console.log("Medicine: " + medicineName + " Rate: " + rate + " Last Time Taken: " + lastTimeTaken);
      //return the data to the fitbit
      returnMedicine(medicineName, rate, lastTimeTaken);
      });
    })
  .catch(function (err) {
    console.log("Error fetching medicine: " + err);
  });
}

//returns the data to the fitbit
function returnMedicine(medicineName, rate, lastTimeTaken) {
  var data = new Object();
  data.medicineName = medicineName;
  data.rate = rate;
  data.lastTimeTaken = lastTimeTaken;
  console.log("hello!");
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log("Message ready!");
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

//if the fitbit sends a command called "medication" the phone will query the webApp.
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "medication") {
    queryWebApp();
  }
}

//handle errors.
messaging.peerSocket.onerror = function (err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}
