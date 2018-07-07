pragma solidity ^0.4.24;

contract Med_ETrack {

   //mapping (address => uint) public patientNam;
   mapping (address => Patient) public patientsMap;
   mapping (address => bool) public careGiversMap;

   struct Medication {
      string name;
      uint dosage;
   }
   
   struct Patient {
      string name;
      mapping (address => bool) caregivers;
      mapping (uint => Medication) medications;
   }

   function verifiy(address patient, address caregiver) internal returns(bool){
      return patientsMap[patient].caregivers[caregiver]; //fix
   }


   event AddedPatient(address patient);

   function newPatient(string _name) public {
      //if patient not in map then add patient
      require(strcmp(patientsMap[msg.sender].name,""));
      Patient memory patient;
      patient.name = _name;
      patientsMap[msg.sender] = patient;

      emit AddedPatient(msg.sender);
   } 

   event AddedCareGiver(address caregiver);
   
   function newCareGiver() public {
      //if caregiver not in map then add caregiver
      require(!careGiversMap[msg.sender]);
      careGiversMap[msg.sender] = true;

      emit AddedCareGiver(msg.sender);
   }

   event AddedCareGiverToPatient(address caregiver, address Patient);

   function addCaregiverToPatient(address _patient) public {
      // if sender is a caretaker and patient exits
      // then add caretaker to patient.careGivers
      require(!strcmp(patientsMap[_patient].name,"")
	      && careGiversMap[msg.sender]
	      && !verifiy(_patient, msg.sender));
      patientsMap[_patient].caregivers[msg.sender] = true;

      emit AddedCareGiverToPatient(msg.sender, _patient);
   }

   function strcmp (string a, string b) internal pure returns (bool){
       return keccak256(a) == keccak256(b);
   }

   /*
   function removeCaregiverFromPatient(string _patient) public {
      
   }
   

   function addMedicationToPatient(string _patient, string _med) public {
      
   }

   function removeMediacationFromPatient(string _patient, string _med) public {

   }
   
   function viewMedication(string _patient) public returns(Medication[]){

   }
   
   function viewCareGiver(string _patient) public returns(CareGiver[]){

   } */

}
