pragma solidity ^0.4.24;

contract Med-ETrack {

   //mapping (address => uint) public patientNam;
   mapping (address => Patient) public patientsMap;
   mapping (address => CareGiver) public careGiversMap;
      
   struct CareGiver {
      string name;
   }

   struct Medication {
      string name;
      uint dosage;
   }
   
   struct Patient {
      string name;
      address[] careGivers;
      Medication[] medications;
   }

   function verifiy(address patient, address caregiver) internal returns(boolean){
      require(patientsMap[patient].careGiver)
   }

   function newPatient(string _name) public returns(boolean){
      //if patient not in map then add patient
      require(patientsMap[msg.sender] == 0);
      Patient memory patient;
      patient.name = _name;
      patientsMap[msg.sender] = patient;
      //add event??? ---------------------
   } 

   function newCareGiver(string _name) public returns(boolean){
      //if caregiver not in map then add caregiver
      require(careGiversMap[msg.sender] == 0);
      CareGiver memory caregiver;
      caregiver.name = _name;
      careGiversMap[msg.sender] = caregiver;
      //add event??? ---------------------
   }

   function addCaregiverToPatient(string _patient) public return(boolean){
      // if sender is a caretaker and patient exits
      // then add caretaker to patient.careGivers
   }

   function removeCaregiverFromPatient(string _patient) public return(boolean) {
      
   }
   

   function addMedicationToPatient(string _patient, string _med) public returns(boolean) {
      
   }

   function removeMediacationFromPatient(string _patient, string _med) public returns(boolena) {

   }
   
   function viewMedication(string _patient) public returns(Medication){

   }
   
   function viewCareGiver(string _patient) public returns(Medication){

   }

}
