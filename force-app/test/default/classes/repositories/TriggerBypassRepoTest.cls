@IsTest
private class TriggerBypassRepoTest {
  @IsTest
  static void it_should_getInstance() {
    TriggerBypass__mdt accTb = TriggerBypass__mdt.getInstance('Account');

    Test.startTest();

    TriggerBypass__mdt tb = new TriggerBypassRepo().getInstance('Account');

    Test.stopTest();

    System.Assert.isNotNull(tb);
    System.Assert.areEqual(accTb.Id, tb.Id);
  }
}
