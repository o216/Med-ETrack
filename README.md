## Description:
Created as part of [AngelHack DC 2018](https://angelhack.com/portfolio-posts/angelhack-washington-d-c-hackathon-2018-july-7-8-2018/), Med-ETrack is a tool for caretakers to keep track of the medication intake of their patients.

It uses Ethereum to store caretaker-patient interactions on a public ledger adding verifiability of the medical data with smart contracts. This in turn communicates to a web application to which the caretaker has access and can see the last time the medication was taken as well as the frequency needed for subsequent medication intakes. This web app has an api that communicates to DynamoDB on AWS in order to get the data associated with each interaction. That api communicates to the patient's FitBit tracker and will start a countdown when the medication is administered and will alert the patient that they need another dosage.


## Completed during hackathon:

:white_check_mark: FitBit and web api integration

:white_check_mark: Web App where caretaker can monitor medication intake, add a record of medicine intake, and add a change of medication frequency

:x: Ethereum integration - but learned a lot!

## More info:

This repository hosts the FitBit and Ethereum portion of the project. You can see the web app associated with it: https://github.com/o216/Med-ETrack-WebApp
