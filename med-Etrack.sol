pragma solidity ^0.4.24;

contract Med_ETrack {

   //mapping (address => uint) public patientNam;
   mapping (address => Patient) public patientsMap;
   mapping (address => CareGiver) public careGiversMap;
      
   struct CareGiver {
      uint name;
   }

   struct Medication {
      string name;
      uint dosage;
   }
   
   struct Patient {
      uint name;
      mapping (address => bool) caregivers;
      Medication[] medications;
   }

   function verifiy(address patient, address caregiver) internal returns(bool){
      return patientsMap[patient].caregivers[caregiver] //fix
   }


   event AddedPatient(address patient);

   function newPatient(string _name) public {
      //if patient not in map then add patient
      require(patientsMap[msg.sender] == 0);
      Patient memory patient;
      patient.name = _name;
      patientsMap[msg.sender] = patient;

      emit AddedPatient(msg.sender);
   } 

   event AddedCareGiver(address caregiver);
   
   function newCareGiver(string _name) public {
      //if caregiver not in map then add caregiver
      require(careGiversMap[msg.sender] == 0);
      CareGiver memory caregiver;
      caregiver.name = _name;
      careGiversMap[msg.sender] = caregiver;

      emit AddedCareGiver(msg.sender);
   }

   event AddedCareGiverToPatient(address caregiver, address Patient);
   function addCaregiverToPatient(address _patient) public {
      // if sender is a caretaker and patient exits
      // then add caretaker to patient.careGivers
      require(patientsMap[_patient]
	      && careGiversMap[msg.sender]
	      && !verifiy(_patient, msg.sender));
      patientsMap[_patient].caregivers[msg.sender] = true;

      emit AddedCareGiverToPatient(msg.sender, _patient);
   }

   function removeCaregiverFromPatient(string _patient) public {
      
   }
   

   function addMedicationToPatient(string _patient, string _med) public {
      
   }

   function removeMediacationFromPatient(string _patient, string _med) public {

   }
   
   function viewMedication(string _patient) public returns(Medication[]){

   }
   
   function viewCareGiver(string _patient) public returns(CareGiver[]){

   }

}
