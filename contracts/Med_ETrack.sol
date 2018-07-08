pragma solidity ^0.4.24;

contract Med_ETrack {

   //mapping (address => uint) public patientNam;
   mapping (address => Patient) public patientsMap;
   mapping (address => bool) public careGiversMap;

   struct Medication {
      uint rate_dosage; //hours
   }
   
   struct Patient {
      string name;
      mapping (address => bool) caregivers;
      mapping (string => Medication) medications;
   }

   function verify(address patient, address caregiver) view internal returns(bool){
      return careGiversMap[caregiver] && patientsMap[patient].caregivers[caregiver]; 
   }

   event AddedPatient(address patient);

   function newPatient(address sender, string _name) public {
      //if patient not in map then add patient
      require(strcmp(patientsMap[sender].name,""));
      Patient memory patient;
      patient.name = _name;
      patientsMap[sender] = patient;

      emit AddedPatient(sender);
   } 

   event AddedCareGiver(address sender);
   
   function newCareGiver(address sender) public {
      //if caregiver not in map then add caregiver
      require(!careGiversMap[sender]);
      careGiversMap[sender] = true;

      emit AddedCareGiver(sender);
   }

   event AddedCareGiverToPatient(address caregiver, address Patient);

   function addCareGiverToPatient(address _caregiver, address _patient) public {
      // if sender is a caretaker and patient exits
      // then add caretaker to patient.careGivers
      require(!verify(_patient, _caregiver));
      patientsMap[_patient].caregivers[_caregiver] = true;

      emit AddedCareGiverToPatient(_caregiver, _patient);
   }

   event RemovedCareGiverToPatient(address caregiver, address _patient);
   
   function removeCareGiverFromPatient(address _caregiver, address _patient) public {
     require(verify(_patient, _caregiver));
     patientsMap[_patient].caregivers[_caregiver] = false;
   }

   event AddedMedicationToPatient(address _caregiver, address _patient,
				  string _med, uint _dosage);
   
   function addMedicationToPatient(address _caregiver, address _patient, string _med, uint _dosage) public {
      require(verify(_patient, _caregiver));

      Medication memory med;
      med.rate_dosage;
      patientsMap[_patient].medications[_med] = med;

      emit AddedMedicationToPatient(_caregiver, _patient, _med, _dosage);
   }

   event RemovedMedicationToPatient(address _caregiver, address _patient,
				  string _med, uint _dosage);
   function removeMediacationFromPatient(address _caregiver, address _patient, string _med) public {
      require(verify(_patient,_caregiver)
	      && patientsMap[_patient].medications[_med].rate_dosage != 0);
      patientsMap[_patient].medications[_med].rate_dosage = 0;
   }

   event RemovedPatient(address _patient);
   
   function removePatient(address _patient) public {
      require(!strcmp(patientsMap[_patient].name,""));
      Patient memory empty;
      patientsMap[_patient] = empty;

      emit RemovedPatient(_patient);
   }

   event RemovedCareGiver(address _caregiver);
   
   function removeCareGiver(address _caregiver) public {
      require(careGiversMap[_caregiver]);
      careGiversMap[_caregiver] = false;

      emit RemovedCareGiver(_caregiver);
   }
     
   // Helpers
   function strcmp (string a, string b) internal pure returns(bool){
      return keccak256(bytes(a)) == keccak256(bytes(b));
   }

   function getPatient(address _patient) public view returns(string){
      return patientsMap[_patient].name;
   }

   function isCareGiver(address _patient, address _caregiver)  public view returns(bool){
      return patientsMap[_patient].caregivers[_caregiver];
   }

   function getCareGiver(address _caregiver) public view returns(bool){
      return careGiversMap[_caregiver];
   }

}
