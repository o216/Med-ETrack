import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Med_ETrack.sol";

contract TestMed{

   address constant senderA = 0x6D399838C2a46016C5E7eA4Dae669Cf0Caa05a0b;
   address constant senderB = 0xb954452809f23082A906C4D7Fbf18fcbD8152a8d;
   
   function testAddPatient() {
      Med_ETrack med = Med_ETrack(DeployedAddresses.Med_ETrack());
      
      med.newPatient(senderA, "pat");
      //Assert.equal(msg.sender, tx.origin);

      //emit testEvent(msg.sender);
      Assert.equal(med.getPatient(senderA), "pat", "should be pat!");
   }
   
   function testAddCareGiver() {
      Med_ETrack med = Med_ETrack(DeployedAddresses.Med_ETrack());
      
      med.newCareGiver(senderB);
      //Assert.equal(msg.sender, tx.origin);

      //emit testEvent(msg.sender);
      Assert.equal(med.getCareGiver(senderB), true, "should be true!");
   }

   function testIsCareGiver() {
      Med_ETrack med = Med_ETrack(DeployedAddresses.Med_ETrack());
      
      //med.newCareGiver(senderB);
      //Assert.equal(msg.sender, tx.origin);
      med.addCareGiverToPatient(senderB, senderA);
      //emit testEvent(msg.sender);
      Assert.equal(med.isCareGiver(senderA, senderB), true, "should be true!");
   }

   function testAddMeds(){
      Med_ETrack med = Med_ETrack(DeployedAddresses.Med_ETrack());

      med.addMedicationToPatient(senderB, senderA, "Adderal 10mg", 12);

      Assert.equal(med.hasMedication(senderA, "Adderal 10mg"), "Adderal 10mg", "should have addy!");
   }
   
   function testRemoveCareGiver() {
      Med_ETrack med = Med_ETrack(DeployedAddresses.Med_ETrack());
      
      //med.newCareGiver(senderB);
      //Assert.equal(msg.sender, tx.origin);
      med.removeCareGiverFromPatient(senderB, senderA);
      //emit testEvent(msg.sender);
      Assert.equal(med.isCareGiver(senderA, senderB), false, "should be false!");
   }


}
