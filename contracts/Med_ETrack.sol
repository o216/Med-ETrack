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

   function newPatient(string _name) public {
      //if patient not in map then add patient
      require(strcmp(patientsMap[msg.sender].name,""));
      Patient memory patient;
      patient.name = _name;
      patientsMap[msg.sender] = patient;

      emit AddedPatient(msg.sender);
   } 

   event AddedCareGiver(address sender);
   
   function newCareGiver() public {
      //if caregiver not in map then add caregiver
      require(!careGiversMap[msg.sender]);
      careGiversMap[msg.sender] = true;

      emit AddedCareGiver(msg.sender);
   }

   event AddedCareGiverToPatient(address caregiver, address Patient);

   function addCareGiverToPatient( address _patient) public {
      // if sender is a caretaker and patient exits
      // then add caretaker to patient.careGivers
      require(!verify(_patient, msg.sender));
      patientsMap[_patient].caregivers[msg.sender] = true;

      emit AddedCareGiverToPatient(msg.sender, _patient);
   }

   event RemovedCareGiverToPatient(address caregiver, address _patient);
   
   function removeCareGiverFromPatient( address _patient) public {
     require(verify(_patient, msg.sender));
     patientsMap[_patient].caregivers[msg.sender] = false;
     
     emit RemovedCareGiverToPatient(msg.sender, _patient);
   }

   event AddedMedicationToPatient(address _caregiver, address _patient,
				  string _med, uint _dosage);
   
   function addMedicationToPatient(address _patient, string _med, uint _dosage) public {
      require(verify(_patient, msg.sender));

      Medication memory med;
      med.rate_dosage;
      patientsMap[_patient].medications[_med] = med;

      emit AddedMedicationToPatient(msg.sender, _patient, _med, _dosage);
   }

   event RemovedMedicationToPatient(address _caregiver, address _patient,
				  string _med);
   function removeMediacationFromPatient( address _patient, string _med) public {
      require(verify(_patient,msg.sender)
	      && patientsMap[_patient].medications[_med].rate_dosage != 0);
      patientsMap[_patient].medications[_med].rate_dosage = 0;
      
      emit RemovedMedicationToPatient(msg.sender, _patient, _med);
   }

   event RemovedPatient(address _patient);
   
   function removePatient(){
      require(!strcmp(patientsMap[msg.sender].name,""));
      Patient memory empty;
      patientsMap[msg.sender] = empty;

      emit RemovedPatient(msg.sender);
   }

   event RemovedCareGiver(address _caregiver);
   
   function removeCareGiver(){
      require(careGiversMap[msg.sender]);
      careGiversMap[msg.sender] = false;

      emit RemovedPatient(msg.sender);
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
