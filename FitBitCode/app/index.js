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
var background = document.getElementById("background");
let label = document.getElementById("label");
let button = document.getElementById("button");
var hoursLabel = document.getElementById("hours");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
button.style.visibility = "hidden";
button.onactivate = function(evt) {
  button.style.visibility = "hidden";
  background.style.fill = "fb-green";
  setClockUntil();
  label.text = "Time left until next dose of: " + medicineName;
}

//Medicine taken data
var wasMedTaken = true;

//Number of doese missed
var missedDoses = 0;

//Set label to default value

//Clock variables
let timeAtStart = new Date().getTime();
var currentTime = timeAtStart;
var totalSeconds = 0;
var msecondsUntil = 0;
var startTime = 0;
var secondsLeft = 0;
var firstTime = true;
var rate = 3;
var lastTimeTaken = 0;
var timeOfNextDose = 0;
clock.granularity = 'seconds';
clock.ontick = (evt) => {
  currentTime = evt.date.getTime();
}
var timeSinceInterval = null;
var timeUntilInterval = null;
var medicineName = null;

//timeSinceLastDose that counts up from 0, set the moment after a dose is missed.
//probably needs to shut off at some point, we'll worry about that in a minute'
function setClockSince() {
  timeSinceInterval = setInterval(timeSinceLastDose, 925);
  clearInterval(timeUntilInterval);
  timeSinceLastDose();
}

function timeSinceLastDose() {
  totalSeconds = parseInt((currentTime/1000) - timeOfNextDose);
  secondsLabel.text = pad(totalSeconds % 60);
  minutesLabel.text = pad((parseInt(totalSeconds / 60) %60));
  hoursLabel.text = pad(parseInt(totalSeconds / 3600));
}

function setClockUntil() {
  if (!firstTime) {
    clearInterval(timeSinceInterval);
  } else {
    firstTime = false;
  }
  timeUntilInterval = setInterval(timeUntilNextDose, 925);
  timeUntilNextDose();
}

function timeUntilNextDose() {
  console.log("h" + timeOfNextDose);
  secondsLeft = parseInt(timeOfNextDose - (currentTime/ 1000));
  console.log(secondsLeft);
  secondsLabel.text = pad(secondsLeft % 60);
  minutesLabel.text = pad((parseInt(secondsLeft / 60) % 60));
  hoursLabel.text = pad(parseInt(secondsLeft / 3600));
   if (secondsLeft <= 0) {
     secondsLabel.text = pad(0);
     minutesLabel.text = pad(0);
     hoursLabel.text = pad(0);
   } else {
     secondsLabel.text = pad(secondsLeft % 60);
    minutesLabel.text = pad((parseInt(secondsLeft / 60) % 60));
    hoursLabel.text = pad(parseInt(secondsLeft / 3600));
   }
  
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

//call the timeSinceLastDose function every 925 ms. It is under 1 second because
//the system takes time to process the code, which means that updating the time
//with the current time every 1 second takes longer than 1 second and the
//clock skips numbers. 
//Note: this sometimes causes the clock to lag, but not very often.

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
  medicineName = data.medicineName;
  rate = parseFloat(data.rate);
  lastTimeTaken = parseInt(data.lastTimeTaken);
  console.log(lastTimeTaken);
  //console.log("Medicine: " + medicineName + " Rate: " + rate + " Last Time Taken: " + lastTimeTaken);
  var secRate = rate * 60 * 60; //change the rate from hrs to ms
  timeOfNextDose = lastTimeTaken + secRate
  console.log(timeOfNextDose);
  setClockUntil(timeOfNextDose);
  //console.log("number: " + (currentTime/1000 - lastTimeTaken));
  //console.log("secRate: " + secRate);
   if ((currentTime/1000) - lastTimeTaken >= secRate) {
     missedDose(timeOfNextDose)
//      background.style.fill = "fb-red";
//      setClockSince();
//      console.log("Dose of is late");
     
//      if (!wasMedTaken) {
//        missedDoses++;
//      } else {
//        wasMedTaken = false;
//      }
//      button.style.visibility = "visible";
//      label.text = "Time since missed dose of " + medicineName;
     
   } else {
     background.style.fill = "fb-green",
     console.log("You have left until you take another dose.");
     label.text = ("Time left until next dose of " + medicineName);
     //TODO error handling
     //TODO use medicine id to identify the medication to be taken
   }
}

function missedDose() {
  background.style.fill = "fb-red";
  console.log("Dose is late");
  if (!wasMedTaken) {
    missedDoses++;
  } else {
    wasMedTaken = false;
  }
  button.style.visibility = "visible";
  label.text = "Time since missed dose of " + medicineName;
  setClockSince();
}

function fullyLoaded() {
  
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



