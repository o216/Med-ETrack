import * as messaging from "messaging";

//data from webApp - replace the text with the values
var API_KEY = "MYAPIKEYGOES HERE"; // TODO
var ENDPOINT = "https://MYENDPOINTGOESHERE.com"; //TODO

//query the webApp for the medication data
function queryWebApp() {
  fetch(ENDPOINT + "&APPID=" + API_KEY)
  .then(function(response) {
    response.json()
    .then(function(data) {
      //print the data to see in the log
      console.log("Got JSON response from server: " + JSON.stringify(data));
      //create a json object of the data we actually need
        let d = {
          "medicineId": data.USERID.Medicine,
          "rate": Number.parseInt(data.USERID.Rate),//comes in hours
          "lastTimeTaken" : Number.parseInt(data.USERID.lastTimeTaken),//comes in unix timestamp
        };
      //return the data to the fitbit
      returnMedicine(d);
      });
    })
  .catch(function (err) {
    console.log("Error fetching medicine: " + err);
  });
}

//returns the data to the fitbit
function returnMedicine(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
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
