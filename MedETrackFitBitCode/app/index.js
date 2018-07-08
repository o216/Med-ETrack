/*
 * Entry point for the watch app
 * Fetches data from the companion (phone) which gets it from the webapp
 * messages are limited to 1024 bytes
 */
let document = require("document");
import document from "document";
import * as messaging from "messaging";
import clock from "clock";

//UI references
let label = document.getElementById("label");
let button = document.getElementById("button");
var hoursLabel = document.getElementById("hours");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
button.onactivate = function(evt) {
  button.style.visibility = "hidden";
}

//Medicine taken data
var wasMedTaken = true;

//Number of doese missed
var missedDoses = 0;

//Set label to default value
label.text = "Hello World!";

//Clock variables
let timeAtStart = new Date().getTime();
var currentTime = timeAtStart;
var totalSeconds = 0;
clock.granularity = 'seconds';
clock.ontick = (evt) => {
  currentTime = evt.date.getTime();
}

//timer that counts up from 0, set the moment after a dose is missed.
//probably needs to shut off at some point, we'll worry about that in a minute
function timer() {
  totalSeconds = parseInt((currentTime - timeAtStart)/1000);
  secondsLabel.text = pad(totalSeconds % 60);
  minutesLabel.text = pad(parseInt(totalSeconds / 60));
  hoursLabel.text = pad(parseInt(totalSeconds / 3600));
}

//pads the values for the clock if the digit is less than 10
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

//call the timer function every 925 ms. It is under 1 second because
//the system takes time to process the code, which means that updating the time
//with the current time every 1 second takes longer than 1 second and the
//clock skips numbers. 
//Note: this sometimes causes the clock to lag, but not very often.
setInterval(timer, 925);

//fetches the medicine data from the companion(phone) 
function fetchMedicine() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'medication'
    });
  }
}

//processes the fetched data from the companion(phone)
function processMedicine(data) {

  var milliRate = data.rate * 60 * 60 * 1000; //change the rate from hrs to ms
  var timestamp = new Date().getTime; //get current time (seperate from clock)
  
   if (timestamp - data.lastTimeTaken >= milliRate ) {
     console.log("Medication is late.");
     if (!wasMedTaken) {
       missedDoses++;
     } else {
       wasMedTaken = false;
     }
     button.style.visibility = "visible";
     label.text = "Time since missed dose"
     
   } else {
     console.log("You have left until you take another dose.");
     label.text = "Time until next dose"
     //TODO error handling
     //TODO use medicine id to identify the medication to be taken
   }
}


messaging.peerSocket.onopen = function() {
  //we are ready to send or recieve messages
  fetchMedicine();
}

messaging.peerSocket.onmessage = function(evt) {
  //we have recieved a message from our peer
  if (evt.data) {
    processMedicine(evt.data);
  }
}

messaging.peerSocket.onerror = function(err) {
  //handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
// Fetch the medicine info every 1 hour
setInterval(fetchMedicine, 60 * 1000 * 60)



